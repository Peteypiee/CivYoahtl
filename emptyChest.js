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
	
  for (var slot=0; slot<54; slot++) {
		let itemId = inv.getSlot(slot).getItemID()
		let empty = (itemId == `minecraft:air`);
		
		if (!empty) {
			if (farmMode) {
				if (!farmItems.includes(itemId)) {
					farmItems.push(itemId);
					//Chat.log("Pushing " + slot + ": " + itemId + " " + empty);
					slots.push(slot);
				}
			} else { // Not empty slot, not in a farm: move it
				slots.push(slot)
				Client.waitTick();
			}
		}
  }
    
	Chat.log(slots)
	for (let i = 0; i < slots.length; i++) {
		//Chat.log(slots[i]);
		
		if (farmMode) {
			inv.quickAll(slots[i]);
		} else {
			inv.quick(slots[i]);
		}
		Client.waitTick(1);
	}
	
	inv.close()
}

emptyChest();
