    
    /*Client.waitTick(2*3600*+0*60*+0);
    KeyBind.key("key.keyboard.space",true);
    Client.waitTick(5);
    KeyBind.key("key.keyboard.space",false);
*/
// HuM4nB31nG's Crop Bot
// Modified by Mokotowskie, MechanicalRift, x1025
// Used for any of the major crop farms (potato, wheat, carrot, beet)
// Modified to be able to shift-click items into chests and auto-resume harvesting/replanting.
// YOU CAN CHANGE THIS BELOW:
const food = "minecraft:bread"; // Set to whatever food item ID you are eating

// Don't change anything below this line unless you know what you're doing.
// ---------------------------------------------------------------------------------------
// NOTE - PLEASE READ: This script was specifically made for the Yoahtl beetfarm near Himmelfalke.
// Make sure that you have a rectangular farm, you have the food you want to eat in the hotbar,
// And that you have room in your hotbar for whatever item you need to replant.
// Boundaries of the beetroot farm.
const xEast = 3624;
const xWest = 3465;
const zNorth = 8274;
const zSouth = 8397;
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
function farmLine() {
    // Start at west, harvest to east, move back and click
    p.lookAt(180, 90);
    // Move north and harvest!
    Chat.log("Harvesting and replanting of row " + line + " commenced!");
    KeyBind.keyBind("key.forward", true);
    KeyBind.keyBind("key.use", true);
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
    KeyBind.keyBind("key.use", false);
    Client.waitTick();
    dumpCrops();
    Client.waitTick();
    var newLine = line + 1;
    Chat.log("Row " + line + " finished! Moving on to row " + newLine + "!");
    KeyBind.keyBind("key.right", true);
    while (true) {
        if (p.getPos().x >= xWest + line + 1) {
            break;
        }
    }
    KeyBind.keyBind("key.right", false);
    Client.waitTick(5);
    // Move east and farm.
    KeyBind.keyBind("key.back", true);
    KeyBind.keyBind("key.use", true);
    while (true) {
        if (p.getPos().z >= zSouth + 0.5) {
            break;
        }
    }
    KeyBind.keyBind("key.back", false);
    Client.waitTick();
    KeyBind.keyBind("key.use", false);
}
// Checks for player's food level.
function eatFood() {
    getItemInHotbar(food);
    KeyBind.keyBind("key.use", true);
    while (true) {
        if (p.getFoodLevel() >= 20) {
            break;
        }
        else {
            Client.waitTick(20);
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
function dumpCrops() {
    p.lookAt(180, 0);
    Client.waitTick(20);
    const inv = Player.openInventory();
    //dumps wheat seeds into the water storeage behind the chests
    for (let i = 9; i < 45; i++) {
        if (inv.getSlot(i).getItemId() == "minecraft:poisonous_potato") {
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
    p.lookAt(180, 71);
    Client.waitTick(20);
    KeyBind.key("key.mouse.right", true);
    KeyBind.key("key.mouse.right", false);
    Client.waitTick(60);
    //YES IT REQURIES THE INVS CAUSE JSMACROS IS FUCKING RETARDED
    const invs = Player.openInventory();
    Client.waitTick(10);
    for (let x = 54; x < 90; x++) {
        Client.waitTick();
        if (invs.getSlot(x).getItemId() == "minecraft:potato") {
            //Chat.log(x);
            invs.quick(x);
            Client.waitTick();
        }
        Client.waitTick();
    }
    inv.close();
    Client.waitTick();
    p.lookAt(180, 90);
    Client.waitTick();
}
// Main function
function farmLines() {
    // Assumes you are already in position.
    while (true) {
        // Eat
        eatFood();
        // Farm line
        farmLine();
        // Move one
        x += 2;
        var newLine = line + 2;
        if (newLine >= 160) {
            KeyBind.keyBind("key.forward", false);
            KeyBind.keyBind("key.attack", false);
            end();
            Client.waitTick(220);
        }

        Chat.log("Row " + (line + 1) + " finished! Moving on to row " + newLine + "!");
        KeyBind.keyBind("key.right", true);
        line = line + 2;
        while (true) {
            if (p.getPos().x >= x) {
                break;
            }
            else {
                Client.waitTick();
            }
        }
        KeyBind.keyBind("key.right", false);
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
// Execution
farmLines();
