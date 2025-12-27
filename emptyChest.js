// Editable stuff
var farmMode = true;

// Other stuff
const p = Player.getPlayer();
var inv = Player.openInventory();
var farmItems = [];
var slots = [];

function emptyChest(){
    p.interact();
    Client.waitTick(4);
    inv = Player.openInventory();
    Client.waitTick(4);
    
    let slotCount = inv.getTotalSlots();
    let chestSlots = 0;
    //Chat.log(slotCount);
    if (slotCount == 46) {
        throw "Please open a chest";
    } else if (slotCount == 90) {
        chestSlots = 54; // Double Chest
    } else if (slotCount == 41) {
        chestSlots = 4;  // Hopper
    } else if (slotCount == 63) {
        chestSlots = 27; // Barrel/Single Chest
    } else if (slotCount == 45) {
        chestSlots = 9;  // Dropper/Hopper
    }
    
    for (var slot=0; slot<chestSlots; slot++) {
        let itemId = inv.getSlot(slot).getItemID();
        let empty = (itemId == `minecraft:air`);
        
        if (!empty) {
            if (farmMode) {
                if (!farmItems.includes(itemId)) {
                    farmItems.push(itemId);
                    //Chat.log("Pushing " + slot + ": " + itemId + " " + empty);
                    slots.push(slot);
                }
            } else { // Not empty slot, not in a farm: move it
                slots.push(slot);
                Client.waitTick();
            }
        }
    }
    
    //Chat.log(slots)
    for (let i = 0; i < slots.length; i++) {
        //Chat.log(slots[i]);
        
        if (farmMode) {
            inv.quickAll(slots[i]);
        } else {
            inv.quick(slots[i]);
        }
        Client.waitTick(1);
    }
    
    inv.close();
}

emptyChest();
