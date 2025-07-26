/*
BoatCat's OneFarm system allows you to set one farm macro, one time. V1.4.0, 7/26/25
No more having to constantly switch your farm key, and no more keyboard clutter from having multiple farm keybinds!
Fill in your own farms. Use the format provided by the example Yoahtl farms, with as precise corner/boundary values as possible
If you would like to have farms added to the default script, please let me know via Discord, @Peteypiee
*/

// CLASSES
class farm {
	constructor(xEast, xWest, zNorth, zSouth, material="", regrowTime="Unknown", woodFarm=false, silent=false) {
		this.xEast = xEast;
		this.xWest = xWest;
		this.zNorth = zNorth;
		this.zSouth = zSouth;
		this.material = material;
		this.woodFarm = woodFarm;
		this.path = material + ".js";
		this.regrowTime = regrowTime;
		this.silent = silent;
		this.minY = -64;
		this.maxY = 255;
		this.group = "hue";
	}
	
	setY(min, max) {
		this.minY = min;
		this.maxY = max;
	}
	
	setScript(path) {
		this.path = path;
	}
	
	setGroup(group) {
		this.group = group;
	}
	
	getGroup() {
		return this.group;
	}
	
	inBounds(dist=3) {
		let pl = Player.getPlayer();
		let x = pl.getPos().x;
		let y = pl.getPos().y;
		let z = pl.getPos().z;
		//Chat.log(this.zSouth + " " + this.zNorth + " " + this.xEast + " " + this.xWest);
		if  (  z-dist <= this.zSouth && z+dist >= this.zNorth 
			&& x-dist <= this.xEast  && x+dist >= this.xWest
			&& y-dist <= this.maxY   && y+dist >= this.minY
			) {
			return true;
		} else {
			return false;
		}
	}
	
	runScript() {
		let bounds = this.inBounds();
		let valid = this.verifyGroup();
		if (!bounds) {
			let err = "Farm ran out of bounds"
			throw err;
		} 
		else if (!valid) {
			let err = "Could not verify namelayer group";
			throw err;
		} 
		else {
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
			if (this.material=="oak"||this.material=="dark_oak") {
				items.push("minecraft:apple");
			}
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
		if (this.silent) {
			Chat.log(msg);
		} else {
			Chat.say(msg);
		}
		Client.waitTick(2);
		Chat.say("/local");
	}
	
	verifyGroup() {
		Chat.say("/nl " + this.group);
		Client.waitTick(5);
		if (Hud.getOpenScreen()) {	// PROGRAMMED LIKE THIS TO NOT RELY ON CHAT MESSAGES;
			Client.waitTick();		// DON'T WANT A CHANCE OF FALSE NEGATIVE FOR AUTHENTICATION
			Player.openInventory().close();
			return true;
		}
		return false;
	}
}

// TOTEC FARMS
var farms = [];

const wheatFarm = new farm(6384, 6225, -1426, -1303, material="wheat", regrowTime="8 h", woodFarm=false);
wheatFarm.setY(80,90);
farms.push(wheatFarm);

const carrotFarm = new farm(6607, 6416, -1520, -1377, material="carrot", regrowTime="16 h", woodFarm=false);
farms.push(carrotFarm);

const oakFarm = new farm(6398, 6258, -2016, -1861, material="oak", regrowTime="12 h", woodFarm=true);
farms.push(oakFarm);

const jungleFarm = new farm(7581, 7441, -110, 75, material="jungle", regrowTime="15 h", woodFarm=true);
jungleFarm.setScript("YoahtlJungle.js");
farms.push(jungleFarm);

const sugarFarm = new farm(7726, 7632, -192, -97, material="sugar_cane", regrowTime="12 h", woodFarm=true);
sugarFarm.setScript("sugar.js");
farms.push(sugarFarm);

const cocoaFarm = new farm(7753, 7661, 31, 95, material="cocoa_beans", regrowTime="24 h", woodFarm=false);
farms.push(cocoaFarm);

const vineFarm = new farm(6320, 6239, -1390, -1348, material="vines", regrowTime = "N/A", woodFarm=false);
vineFarm.setY(-7,18);
farms.push(vineFarm); 

const spiderFarm = new farm(7840, 7839, -56, -55, material="spider_eye", regrowTime="N/A", woodFarm=false);
spiderFarm.setScript("spider_farm.js");
farms.push(spiderFarm);

// YUKIHANA FARMS
const potatoFarm = new farm(3624, 3465, 8274, 8397, material="potato", regrowTime="16 h", woodFarm=false);
farms.push(potatoFarm);

// TEMP MELON FARM PLANTING SCRIPT
const melonPlace = new farm(8430, 8322, -1484, -1383, material="melon_seeds", regrowTime="N/A", woodFarm=false, silent=true);
melonPlace.setScript("melonPlace.js");
farms.push(melonPlace);

// FUNCTIONS
function getRecentMsg() {
	let msg = Chat.getHistory().getRecvLine(0).getText().getString();
	return msg;
}

function getAllFarms(group="") {
	for (let i = 0; i < farms.length; i++) {
		let farm = farms[i];
		if (farm.getGroup().search(group) != -1) {
			Chat.log(farm.material + " farm; Group: " + farm.getGroup());
		}
	}
}

function getCurrentFarm() {
	var currentFarm = null;
	for (let i = 0; i < farms.length; i++) {
		if (farms[i].inBounds()) {
			currentFarm = farms[i];
		}
	}
	if (currentFarm == null) {
		Chat.log("Not in a recognized farm. Find a farm from this list:");
		getAllFarms();
		let err = "Not in a recognized farm";
		throw err;
	}
	currentFarm.runScript();
}

// CODE
//getAllFarms("hue");
getCurrentFarm();
