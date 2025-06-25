/*
BoatCat's OneFarm system allows you to set one farm macro, one time. V1.0.0, 6/24/25
No more having to constantly switch your farm key, and no more keyboard clutter from having multiple farm keybinds!
Fill in your own farms. Use the format provided by the example Yoahtl farms, with as precise corner/boundary values as possible
If you would like to have farms added to the default script, please let me know via Discord, @Peteypiee
*/

// CLASSES
class farm {
	constructor(xEast, xWest, zNorth, zSouth, material="", woodFarm=false) {
		this.xEast = xEast;
		this.xWest = xWest;
		this.zNorth = zNorth;
		this.zSouth = zSouth;
		this.material = material;
		this.woodFarm = woodFarm;
		this.path = material + ".js";
	}
	
	setScriptPath(path) {
		this.path = path;
	}
	
	inBounds(pl) {
		let x = pl.getPos().x;
		let z = pl.getPos().z;
		//Chat.log(this.zSouth + " " + this.zNorth + " " + this.xEast + " " + this.xWest);
		if (z-5 <= this.zSouth && z+5 >= this.zNorth && x-5 <= this.xEast && x+5 >= this.xWest) {
			return true;
		} else {
			return false;
		}
	}
	
	getItems() { // TO IMPLEMENT
		let items = [];
		if (woodFarm) {
			items.push("minecraft:" + this.material + "_sapling");
			items.push("minecraft:" + this.material + "_log");
			items.push("minecraft:" + this.material + "_leaves");
			items.push("minecraft:stick");
		}
		else {
			items.push("minecraft:" + this.material);
		}
		return items;
	}
}

// VARIABLES
const p = Player.getPlayer();

var farms = [];
const wheatFarm = new farm(6384, 6225, -1426, -1303, material="wheat");
farms.push(wheatFarm);
const carrotFarm = new farm(6607, 6416, -1520, -1377, material="carrot"); // NOT YET PORTED TO GITHUB
farms.push(carrotFarm);
const potatoFarm = new farm(3624, 3465, 8274, 8397, material="potato");
farms.push(potatoFarm);
const oakFarm = new farm(6398, 6258, -2016, -1861, material="oak", woodFarm=true); // NOT YET PORTED TO GITHUB
farms.push(oakFarm);
const jungleFarm = new farm(7581, 7441, -110, 75, material="jungle", woodFarm=true); // NOT YET PORTED TO GITHUB
jungleFarm.setScriptPath("YoahtlJungle.js");
farms.push(jungleFarm);
const sugarFarm = new farm(7726, 7632, -192, -97, material="sugar_cane"); // NOT YET PORTED TO GITHUB
sugarFarm.setScriptPath("sugar.js"); // NOTE: sugar_cane vs. sugar.js
farms.push(sugarFarm);

// FUNCTIONS
function getCurrentFarm() {
	var currentFarm = null;
	for (let i = 0; i < farms.length; i++) {
		if (farms[i].inBounds(p)) {
			currentFarm = farms[i];
		}
	}
	
	if (currentFarm == null) {
		throw "Not in a recognized farm. Find a farm or update your farm list";
	}
	Chat.log("Running " + currentFarm.material + " farm");
	JsMacros.runScript(currentFarm.path);
}

// CODE
getCurrentFarm();
