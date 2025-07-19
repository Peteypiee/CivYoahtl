/*
Yoahtl Cocoa Bean Farm - MechanicalRift - V1.0.0
*/

var p = Player.getPlayer();

const jump  = Player.createPlayerInput(0, 0, 90, 0, true, false, false);
const sneak = Player.createPlayerInput(0, 0, 90, 0, false, true, false);
const movenorth = Player.createPlayerInput(0, 1, 180, -33.5, false, false, false);
const movesouth = Player.createPlayerInput(0, 1,   0, -33.5, false, false, false);

// Make sure food is selected in hotbar, otherwise, it will keep trying to right click every tick to eat
function eat() {
  while (p.getFoodLevel() < 20) {
    Chat.log("Attempting to eat food...");
    KeyBind.keyBind("key.use", true);
    Client.waitTick(20);
    KeyBind.keyBind("key.use", false);
  }
}

function farm_row() {
  var count = 0;
    
  while (true) {
    eat();
    count++;
    KeyBind.keyBind("key.use", true);
    if (count < 427) {
      Player.addInput(movenorth);
      Client.waitTick(2);
      if (count == 400) {
         Chat.log("halfway there...");
      }
    }
    else if (count <= 845) {
      Player.addInput(movesouth);
      Client.waitTick(2);
      if (count == 800) {
        Chat.log("almost done");
      }
    }
    else {
      KeyBind.keyBind("key.use", false);
      Chat.log("complete!");
      break;
    }
  }
  
}

function farm_floor() {

  for (let floor = 0; floor <= 14; floor++) {
    Chat.log("Starting floor:".concat(" ", floor + 1));
  
    if ( floor != 0 ) {
        Player.addInput(jump);
        Client.waitTick(5);
    }

    farm_row();
    
    if ( floor == 14 ) {
      for (let floordown = 14; floordown > 0; floordown--) {
        Player.addInput(sneak);
        Client.waitTick(5);
      }
    }
  } 
  
}

function move_hb(direction, multiplier) {
  for (let move = 0; move <= 4 * multiplier; move++) {
    Player.addInput(direction);
    Client.waitTick(1);
  }
}

function cycle() {
  Player.addInput(jump);
  Client.waitTick(5);
  Player.addInput(sneak);
  Client.waitTick(5);
}

const move_section_a = Player.createPlayerInput(1, 0, -90, 0, false, false, false);
const move_section_b = Player.createPlayerInput(1, 0,   0, 0, false, false, false);
const move_section_c = Player.createPlayerInput(1, 0,  90, 0, false, false, false);

function move_section() {
  for(let section=0; section <= 13; section++) {
    Chat.log("Starting Section:".concat(" ", section + 1));
    if (section != 0) {
      move_hb(move_section_a, 2);
      move_hb(move_section_b, 4.5);
      move_hb(move_section_c, 2);
    }
    cycle();
    farm_floor();
  }
}

// This starts the automation, make sure you are on top of the lodestone when starting. 
move_section();
