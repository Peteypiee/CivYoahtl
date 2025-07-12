/*
BoatCat's OneFarm system allows you to set one farm macro, one time. V1.3.1, 7/12/25
No more having to constantly switch your farm key, and no more keyboard clutter from having multiple farm keybinds!
Fill in your own farms. Use the format provided by the example Yoahtl farms, with as precise corner/boundary values as possible
If you would like to have farms added to the default script, please let me know via Discord, @Peteypiee
*/

// CLASSES
class farm {
	constructor(xEast, xWest, zNorth, zSouth, material="", regrowTime = "Unknown", woodFarm=false, group="hue", privacy=false) {
		this.xEast = xEast;
		this.xWest = xWest;
		this.zNorth = zNorth;
		this.zSouth = zSouth;
		this.material = material;
		this.woodFarm = woodFarm;
		this.path = material + ".js";
		this.regrowTime = regrowTime;
		this.group = group;
		this.privacy = privacy;
		this.minY = -64;
		this.maxY = 255;
	}
	
	setY(min, max) {
		this.minY = min;
		this.maxY = max;
	}
	
	setScript(path) {
		this.path = path;
	}
	
	inBounds() {
		let pl = Player.getPlayer();
		let x = pl.getPos().x;
		let y = pl.getPos().y;
		let z = pl.getPos().z;
		//Chat.log(this.zSouth + " " + this.zNorth + " " + this.xEast + " " + this.xWest);
		if (z-2 <= this.zSouth && z+2 >= this.zNorth 
			&& x-2 <= this.xEast && x+2 >= this.xWest
			&& y-2 <= this.maxY && y+2 >= this.minY
			) {
			return true;
		} else {
			return false;
		}
	}
	
	runScript() {
		if (this.inBounds()) {	
			this.announce();
			JsMacros.runScript(this.path);	
		}
	}
	
	getItems() { // UNUSED
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
	
	announce() {
		Chat.say("/g " + this.group);
		Client.waitTick(2);
		let now = new Date();
		let msg = "[" + this.group + "farms] " + this.material + " farm started: " + now.toLocaleString() + ".  Estimated time to regrow: " + this.regrowTime;
		if (!this.privacy) {
			Chat.say(msg);
		} else {
			Chat.log(msg);
		}
		Client.waitTick(2);
		Chat.say("/local");
	}
}

// FARMS
var farms = [];

const wheatFarm = new farm(6384, 6225, -1426, -1303, material="wheat", regrowTime = "8 h");
wheatFarm.setY(80,90);
farms.push(wheatFarm);

const carrotFarm = new farm(6607, 6416, -1520, -1377, material="carrot", regrowTime = "16 h"); // NOT ON GITHUB
farms.push(carrotFarm);

const potatoFarm = new farm(3624, 3465, 8274, 8397, material="potato"); // MISSING REGROW TIME. FILL IN ON NEXT TRIP
farms.push(potatoFarm);

const oakFarm = new farm(6398, 6258, -2016, -1861, material="oak", regrowTime = "12 h", woodFarm=true); // NOT ON GITHUB
farms.push(oakFarm);

const jungleFarm = new farm(7581, 7441, -110, 75, material="jungle", regrowTime = "15 h", woodFarm=true); // NOT ON GITHUB
jungleFarm.setScript("YoahtlJungle.js");
farms.push(jungleFarm);

const cocoaFarm = new farm(7753, 7661, 31, 95, material="cocoa_beans", regrowTime = "24 h");
cocoaFarm.setScript("cocoafarm.js");
farms.push(cocoaFarm);

const sugarFarm = new farm(7726, 7632, -192, -97, material="sugar_cane", regrowTime = "12 h"); // NOT ON GITHUB
sugarFarm.setScript("sugar.js"); // NOTE: sugar_cane vs. sugar.js
farms.push(sugarFarm);

const vineFarm = new farm(6320, 6239, -1390, -1348, material="vines");
vineFarm.setY(-7,18);
farms.push(vineFarm);

const spiderFarm = new farm(7840, 7839, -56, -55, material="spider_eye");
spiderFarm.setScript("spider_farm.js");
farms.push(spiderFarm);

// TEMP MELON FARM PLANTING SCRIPT
const melonPlace = new farm(8430, 8322, -1484, -1383, material="melon");
melonPlace.setScript("melonPlace.js");
farms.push(melonPlace);

// FUNCTIONS
function getCurrentFarm() {
	var currentFarm = null;
	for (let i = 0; i < farms.length; i++) {
		if (farms[i].inBounds()) {
			currentFarm = farms[i];
		}
	}
	if (currentFarm == null) {
		throw "Not in a recognized farm. Find a farm or update your farm list";
	}
	currentFarm.runScript();
}

// CODE
getCurrentFarm();
