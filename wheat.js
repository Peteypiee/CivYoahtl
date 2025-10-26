// HuM4nB31nG's Crop Bot (BoatCat V2.1.0, 7/19/25)
// Modified by Mokotowskie, MechanicalRift, x1025, BoatCat
// Used for any of the major crop farms (potato, wheat, carrot, beet)
// Added a toggleable sprint mode and improved sweep toggle. Also updated basic food list

// YOU CAN CHANGE THIS BELOW:
const food = ["minecraft:bread", "minecraft:baked_potato", "minecraft:potato", "minecraft:carrot", "minecraft:cooked_porkchop"]; // Set to whatever food item IDs you are eating
const tools = []; // List of all tool item IDs used in the farm
const farmDirection = "RIGHT"; // RIGHT/LEFT (starting from west -> RIGHT, starting from east -> LEFT)
const sweepMode = true; // SWEEP MODE ONLY WORKS FOR FARMING EAST->WEST
const sprintSweep = true; // SWEEP MODE SPRINT TOGGLE, TURN OFF TO SAVE FOOD

// Don't change anything below this line unless you know what you're doing.
// ---------------------------------------------------------------------------------------
// NOTE - PLEASE READ: This script was specifically made for the Yoahtl wheatfarm near Homeland.
// Make sure that you have a rectangular farm, you have the food you want to eat in the hotbar,
// And that you have room in your hotbar for whatever item you need to replant.

// Boundaries of the farm.
const xEast = 6384;
const xWest = 6225;
const zNorth = -1426;
const zSouth = -1303;

// Boolean variable to end the script
var endCheck = false

// List of items that should be allowed by the script to stay in hotbar (prefers putting them in open inventory slots)
var hotbarItems = []; // Food and tools are autoloaded in prepareHotbar()

// The coords of the front of the chest.
// Example: If a double chest is taking x coordinate -53 and z coordinates 140 and 141, and you are facing east,
// you set the x coordinate to be -54 and the z coordinate to be 140.5.
// Image link of Journey Map as Example: https://i.imgur.com/hVtm28d.png
//const xChest = -4566;
//const zChest = 6317;
// NOTE: The crop and food constants have been modified such that they now take in the item's ID.
// Website for list of unit IDs in minecraft: https://minecraftitemids.com/

const p = Player.getPlayer();
var selectedHotBarSlot = 0;

// Sets line according to your x position - addition by x1025
var line = Math.floor(p.getPos().x) - xWest;

// Minimize waste by being as close to the left edge of the block
var x = xWest + line + 0.0625;
Chat.log("Line Start: " + line)

// The amount of time that is added everytime you go back to the chest,
// so the bot can wait and render the chunk the chest is located in.

var minute = 0;
var waitTime = 0;

//Checks if AutoJump is enabled, throws an error if it is.
function getAutoJump() {
	var gameOptions = Client.getGameOptions(); //We need to get the options class...
	var gameOptionsRaw = gameOptions.getRaw(); //and then get the raw versions ...
	return gameOptionsRaw.field_1848; //Return the value of autoJump according to Yarn mappings...
}
if (getAutoJump() == true) {
	Chat.log("CANNOT START SCRIPT: Please Disable AutoJump before starting the script!");
	throw "AutoJump is enabled, cannot continue.";
}

// Harvests the row and replants it.
function farmLineNorth() 
{
	// Start at east, harvest to west, move north and click
	
	lookAt(180, 90);
	
	// Move north and harvest!
	
	Chat.log("Harvesting and replanting of row "+ line +" commenced!");
	
	KeyBind.keyBind("key.forward", true);
	KeyBind.keyBind("key.use", true);
	
	while (true)
	{
		if (p.getPos().z <= zNorth + 0.5) 
		{
			break;
		}
		else 
		{
			Client.waitTick();
		}
	}
	
	KeyBind.keyBind("key.forward", false);
	KeyBind.keyBind("key.use", false);
	
	Client.waitTick();
	
	dumpCrops();
	
	// For now, sweeping is only allowed left to right
	if (sweepMode) {
		if (line >= xEast - xWest) {
			endCheck = true;
			end();
		} else {
			if (line <= 2) {
				// Do nothing
				Client.waitTick();
			} else if (line >= (xEast - xWest - 1)) {
				moveLeft(1)
				x += 1
				line += 1
			} else {
				KeyBind.keyBind("key.use", true); // Farms crops by chest that may have been missed
				moveLeft(2); // Previously 2.5 (1.5 above)
				x += 2;
				line += 2; // Re-adds to x and line cause moveLeft auto-decrements and I don't want that here
				KeyBind.keyBind("key.use", false);
			}
			
			Client.waitTick();
			
			lookAt(0, 0);
			if (sprintSweep) {
				KeyBind.keyBind("key.sprint", true);
			}
			KeyBind.keyBind("key.forward", true);
			KeyBind.keyBind("key.use", true); // Allows for eating item in offhand while running
			
			while (true) {
				if (p.getPos().z >= zSouth) {
					break;
				}
			}
			KeyBind.keyBind("key.sprint", false);
			KeyBind.keyBind("key.forward", false);
			KeyBind.keyBind("key.use", false);
			
			Client.waitTick();
			lookAt(180, 0);
			Client.waitTick();
			
			moveRight(); // Works because x and line are still at old locations
		}
	} else if (farmDirection == "LEFT") {
		if (line <= 1) {
			endCheck = true;
			end();
		} else {
			moveLeft();
		}
	} else if (farmDirection == "RIGHT") {
		if (line >= xEast - xWest) {
			endCheck = true;
			end();
		} else {
			moveRight();
		}
	} else {
		Chat.log("Invalid farmDirection");
	}
}

// Harvests the row and replants it.
function farmLineSouth()
{
	// Start at east, harvest to west, move south and click
	
	Client.waitTick(5);
		
	// Move south and farm.
	KeyBind.keyBind("key.back", true);
	KeyBind.keyBind("key.use", true);
	
	while (true) {
		if (p.getPos().z >= zSouth + 0.5) {
			break;
		}
	}
	
	KeyBind.keyBind("key.back", false);
	KeyBind.keyBind("key.use", false);
	
	if (farmDirection == "LEFT") {
		if (line <= 1) {
			endCheck = true;
			end();
		} else {
			moveLeft();
		}
	} else if (farmDirection == "RIGHT") {
		if (line >= xEast - xWest) {
			endCheck = true;
			end();
		} else {
			moveRight();
		}
	} else {
		Chat.log("Invalid farmDirection");
	}
}

// Checks for player's food level.
function eatFood() 
{
	for (var i = 0; i < food.length; i++) {
		if (getItemInHotbar(food[i])) {
			break; // Allows for multiple food items, tries to get each in the list
		}
	}
    KeyBind.keyBind("key.use", true);
	let numAttempts = 0 // Added by BoatCat
    while (true) {
        if (p.getFoodLevel() >= 16) {
            break;
        }
        else {
            Client.waitTick(20);
			
			numAttempts += 1;
			if (numAttempts > 8 && numAttempts % 2 == 0) {
				Chat.log("You are out of food!");
			}
			if (numAttempts == 40) {
				Chat.log("You have been AFK for too long, logging you out shortly!")
			}
			if (numAttempts == 41) {
				endMotion();
				break;
			}
        }
    }
    KeyBind.keyBind("key.use", false);
}

// Select's an item from the hotbar.
// If an item doesn't exist in the hotbar,
// it will take it from the main inventory.
function getItemInHotbar(item) {
	const inv = Player.openInventory();
	for (let i = 0; i < 9; i++) {
		if (inv.getSlot(i + 36).getItemId() == item) {
			inv.setSelectedHotbarSlotIndex(i);
			selectedHotBarSlot = i;
			break;
		}
		else if (i == 8) {
			swapFromMain(item);
		}
		Client.waitTick();
	}
}

// Function swaps an item from your main inventory
// into the player's first Hotbar set.
function swapFromMain(item) {
	const inv = Player.openInventory();
	for (let i = 9; i < 36; i++) {
		if (inv.getSlot(i).getItemId() == item) {
			inv.swap(i, 36);
			break;
		}
	}
}

// Prepares the script with tool and food item IDs to prevent them from being automatically removed
function prepareHotbar() {
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

// Removes non-farm items from your hotbar
// If this starts removing items you don't want removed, add their ids to hotbarItems at the top of the script
function cleanHotbar()
{
	try {
		const inv = Player.openInventory();
		for (let i = 0; i < 9; i++) {
			if (!hotbarItems.includes(inv.getSlot(i+36).getItemId())) {
				for (let j = 9; j <= 35; j++) {
					if (inv.getSlot(j).isEmpty()) {
						inv.click(i+36);
						Client.waitTick(2);
						inv.click(j);
						Client.waitTick(2);
					}
				}
			}
		}
	} catch (error) {
		Chat.log(error)
	}
}

function dumpCrops() {
	lookAt(180, 0);
	Client.waitTick(20);
	const inv = Player.openInventory();
	//dumps wheat seeds into the water storeage behind the chests
	for (let i = 9; i < 45; i++) {
		if (inv.getSlot(i).getItemId() == "minecraft:wheat_seeds") {
			inv.click(i);
			Client.waitTick();
			inv.click(-999);
			Client.waitTick();
		}
		else {
			Client.waitTick();
		}
	}
	Client.waitTick();
	//mechanical's storage method from old obby script
	//stores the wheat into the chest
	lookAt(180, 45);
	Client.waitTick(20);
	KeyBind.key("key.mouse.right", true);
	KeyBind.key("key.mouse.right", false);
	Client.waitTick(60);
	//YES IT REQURIES THE INVS CAUSE JSMACROS IS FUCKING RETARDED
	const invs = Player.openInventory();
	Client.waitTick(10);
	for (let x = 54; x < 90; x++) {
		Client.waitTick();
		if (invs.getSlot(x).getItemId() == "minecraft:wheat") {
			//Chat.log(x);
			invs.quick(x);
			Client.waitTick();
		}
		Client.waitTick();
	}
	inv.close();
	Client.waitTick();
	lookAt(180, 90);
	Client.waitTick();
	//cleanHotbar(); // Added by BoatCat
}

// Legal lookat function courtesy of mitw153
function lookAt(yaw, pitch, frac = 0.1) {
	
	Chat.log("Start look!");

	const lerp = (a, b, f) => {
		return Math.fround(a + f * (b - a));
	};

	const round = (n, d) => {
		const pwr = Math.pow(10, d);
		return Math.round((n + Number.EPSILON) * pwr) / pwr;
	};

	yaw = round(yaw, 1);
	pitch = round(pitch, 1);

	// the "plyr" variable isn't needed if you have one defined already and change the instances of "plyr" here to that variable
	const plyr = Player.getPlayer();
	const plyrRaw = plyr.getRaw();
	
	let currYaw = plyr.getYaw();
	let currPitch = plyr.getPitch();

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
	
	//Chat.log("Look completed!");
}

// Main function
function farmLines() 
{
	// Assumes you are already in position.
	let oldLine = 0;
	
	prepareHotbar();
	
	while (true) 
	{
		// Eat
		eatFood();
		
		oldLine = line;
		farmLineNorth();
		
		if (endCheck) {
			break;
		}
		
		Chat.log("Row "+ oldLine +" finished! Moving on to row "+ line +"!");
		
		if (farmDirection == "SWEEP") {
			continue; // Skips southbound farm as northbound w/ sweep brings player back to south
		}
		
		oldLine = line; 
		farmLineSouth()
		Chat.log("Row "+ oldLine +" finished! Moving on to row "+ line +"!");

		if (endCheck){
			break;
		}

		Client.waitTick();
	}
}


function end() {
	Chat.log("Job is finished.");
	// on even lines, move back to the start
	// because script fails to do so
	if (line % 2 == 0) {
		Chat.log("Moving back to start.");
		// move back to start
		KeyBind.keyBind("key.forward", true);
		// wait until we are back at the start
		while (true) {
			if (p.getPos().z <= zNorth + 0.5) {
				break;
			}
			else {
				Client.waitTick();
			}
		}
		KeyBind.keyBind("key.forward", false);
		Client.waitTick();
		dumpCrops();
	}
	Chat.log("Now logging out.");
	Chat.say("/logout");
}

// Added by BoatCat
function endMotion() 
{
	lookAt(180, 0);
	
	KeyBind.keyBind("key.forward", true);
	
	while (true)
	{
		if (p.getPos().z <= zNorth + 0.5) 
		{
			break;
		}
	}
	
	lookAt(270, 0);
	while (true)
	{
		if (p.getPos().x >= xEast - 0.5) {
			break;
		}
	}

	KeyBind.keyBind("key.sprint", false);
	KeyBind.keyBind("key.forward", false);
	KeyBind.keyBind("key.attack", false);
	end();
	Client.waitTick(220);
}

function moveLeft(n = 1) 
{
	x -= n;
	line -= n;
	KeyBind.keyBind("key.left", true);
		
	while (true) 
	{
		if (p.getPos().x <= x) 
		{
		   break;
		} 
		else 
		{
		   Client.waitTick()
		}
	}
	
	KeyBind.keyBind("key.left", false);
}

function moveRight(n = 1) 
{
	x += n;
	line += n;
	KeyBind.keyBind("key.right", true);
		
	while (true) 
	{
		if (p.getPos().x >= x) 
		{
		   break;
		} 
		else 
		{
		   Client.waitTick()
		}
	}
	
	KeyBind.keyBind("key.right", false);
}

// Execution
farmLines();
