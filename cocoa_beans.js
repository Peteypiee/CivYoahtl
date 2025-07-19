/*
Yoahtl Cocoa Bean Farm - MechanicalRift, BoatCat - V2.0.0
*/
const p = Player.getPlayer();

const jump  = Player.createPlayerInput(0, 0, 90, 0, true, false, false);
const sneak = Player.createPlayerInput(0, 0, 90, 0, false, true, false);
const moveWest = Player.createPlayerInput(0, 1, 180, -33.5, false, false, false);
const moveEast = Player.createPlayerInput(0, 1,   0, -33.5, false, false, false);

var xEast = 7753;
var xWest = 7662;
var zNorth = 33;
var zSouth = 93;
var yBase = 91;

var numRows = 16;

// YOU CAN CHANGE THIS BELOW:
const food = ["minecraft:bread", "minecraft:baked_potato"]; // Set to whatever food item IDs you are eating
const tools = []; // List of all tool item IDs used in the farm
const crop = "minecraft:cocoa_beans";
const dropThreshold = 16; // Number of stacks at which the script should stop to dump crops
const topFloor = 14;

// List of items that should be allowed by the script to stay in hotbar (prefers putting them in open inventory slots)
var hotbarItems = []; // FOOD AND TOOLS ARE ADDED AUTOMATCALLY, ADD SPECIAL ITEMS HERE

// FUNCTIONS
function farmRow() 
{
	Chat.log(getCurrentFloor());
	eatFood();
	KeyBind.keyBind("key.use", true);
	Client.waitTick(2);
	while (p.getPos().x >= (xWest + 0.5)) {
		KeyBind.keyBind("key.use", true);
		Player.addInput(moveWest);
		Client.waitTick(2);
	}
    KeyBind.keyBind("key.use", false);
	
	eatFood();
	KeyBind.keyBind("key.use", true);
	Client.waitTick(2);
	while (p.getPos().x <= xEast - 0.5) {
		KeyBind.keyBind("key.use", true);
		Player.addInput(moveEast);
		Client.waitTick(2);
	}
    KeyBind.keyBind("key.use", false);
}

function farmSection()
{
	Chat.log(getCurrentSection());
	for (let floor = 0; floor <= 14; floor++) { // ASSUMES STARTING ON FIRST FLOOR
		Chat.log("Starting floor:".concat(" ", floor + 1));
	  
		if (floor != 0) {
			Player.addInput(jump);
			Client.waitTick(5);
		}
		
		const inv = Player.openInventory();
		let items = inv.findItem(crop);
		if (items.length >= dropThreshold) {
			dumpCrops(floor);
		}

		farmRow();
		
		if (floor == topFloor) {
			for (let floordown = topFloor; floordown > 0; floordown--) {
				Player.addInput(sneak);
				Client.waitTick(5);
			}
		}
	}
}

function cycle() 
{
	Player.addInput(jump);
	Client.waitTick(5);
	Player.addInput(sneak);
	Client.waitTick(5);
}

function changeSection()
{
	function move_hb(direction, multiplier) {
		for (let move = 0; move <= 4 * multiplier; move++) {
			Player.addInput(direction);
			Client.waitTick(1);
		}
	}
	const move_a = Player.createPlayerInput(1, 0, -90, 0, false, false, false);
	const move_b = Player.createPlayerInput(1, 0,   0, 0, false, false, false);
	const move_c = Player.createPlayerInput(1, 0,  90, 0, false, false, false);
	
	move_hb(move_a, 2);
	move_hb(move_b, 4.5);
	move_hb(move_c, 2);
}

function getCurrentSection() {
	let relativeZ = p.getPos().z - zNorth;
	let dist = zSouth - zNorth;
	let section = Math.round((relativeZ / dist) * numRows) + 1;
	return ("Farming section " + section);
}

function getCurrentFloor() {
	let relativeY = p.getPos().y - yBase;
	let distBetweenFloors = 6;
	let floor = Math.round(relativeY / 6);
	return ("Farming floor " + floor);
}

function dumpCrops(currentFloor)
{
	let floor = currentFloor;
	for (floor = currentFloor; floor > 0; floor--) {
		Player.addInput(sneak);
		Client.waitTick(5);
	}
	lookAt(180, 0);
	
	const inv = Player.openInventory();
	for (let i = 9; i < 45; i++) {
		if (inv.getSlot(i).getItemId() == crop) {
			inv.dropSlot(i, true);
			Client.waitTick();
        }
        else {
            Client.waitTick();
        }
	}
	
	for (floor = 0; floor < currentFloor; floor++) {
		Player.addInput(jump);
		Client.waitTick(5);
	}
}

function main()
{
	for (let section=0; section<=13; section++) {
		if (section!=0) {
			changeSection();
		}
		cycle();
		farmSection();
	}
}


// IMPORTED FUNCTIONS (from potato.js)
// Legal lookat function courtesy of mitw153
function lookAt(yaw, pitch, frac = 0.1) 
{
    const lerp = (a, b, f) => {
        return Math.fround(a + f * (b - a));
    };

    const round = (n, d) => {
        const pwr = Math.pow(10, d);
        return Math.round((n + Number.EPSILON) * pwr) / pwr;
    };

    yaw = round(yaw, 1);
    pitch = round(pitch, 1);
	
    const plyrRaw = p.getRaw();
    let currYaw = p.getYaw();
    let currPitch = p.getPitch();

    const deltaYaw = yaw - currYaw;
    currYaw = deltaYaw > 180 ? currYaw + 360 : deltaYaw < -180 ? currYaw - 360 : currYaw;

    while (round(currYaw, 1) !== yaw || round(currPitch, 1) !== pitch) {
        currYaw = lerp(currYaw, yaw, frac);
        currPitch = lerp(currPitch, pitch, frac);
        
        // support forge and fabric, raw methods to set yaw and pitch
        try {
            plyrRaw.method_36456(currYaw);
            plyrRaw.method_36457(currPitch);
        } catch {
            plyrRaw.m_146922_(currYaw);
            plyrRaw.m_146926_(currPitch);
        }
        
        Time.sleep(10);
    }
}

// Checks for player's food level.
function eatFood() 
{
    while (p.getFoodLevel() < 20) {
        for (var i = 0; i < food.length; i++) {
			if (getItemInHotbar(food[i])) {
				break; // Allows for multiple food items, tries to get each in the list
			}
		}
		KeyBind.keyBind("key.use", true);
        Client.waitTick(20);
		KeyBind.keyBind("key.use", false);
    }
}

// Select's an item from the hotbar.
// If an item doesn't exist in the hotbar,
// it will take it from the main inventory.
function getItemInHotbar(item) 
{
    const inv = Player.openInventory();
    for (let i = 0; i < 9; i++) {
        if (inv.getSlot(i + 36).getItemId() == item) {
            inv.setSelectedHotbarSlotIndex(i);
            selectedHotBarSlot = i;
			return true;
        }
        else if (i == 8) {
            return swapFromMain(item);
        }
        Client.waitTick();
    }
	return false;
}

// Function swaps an item from your main inventory
// into the player's first Hotbar set.
function swapFromMain(item) 
{
    const inv = Player.openInventory();
    for (let i = 9; i < 36; i++) {
        if (inv.getSlot(i).getItemId() == item) {
            inv.swap(i, 36);
            return true;
        }
    }
	return false;
}

// Prepares the script with tool and food item IDs to prevent them from being automatically removed
function prepareHotbar() 
{
	for (let i = 0; i < (food.length); i++) {
		if (!hotbarItems.includes(food[i])) {
			hotbarItems.push(food[i]);
		}
	}
	for (let i = 0; i < (tools.length); i++) {
		if (!hotbarItems.includes(tools[i])) {
			hotbarItems.push(tools[i]);
		}
	}
}

main();
