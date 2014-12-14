var setting = "setting.js"

/*
launchpad.js by K.Aoki(Prily - prhyzmica.com)

Please read setting.js
*/


//-----common setting-----
inlets = 1
outlets = 3
autowatch = 1
setoutletassist(0, "data out")
setoutletassist(1, "note out")
setoutletassist(1, "ctl out")

//-----LP-----
var Page = 0
var _LP = function() {
	//init
	this.map = {}
	this.map.objList = {}
	this.map.posList = new Array(8)
	this.buffer = new Array
	for (var i = 0; i < 8; i++) {
		this.map.posList[i] = new Array(8 * 9)
		for (var r = 0; r < 8; r++) {
			for (var c = 0; c < 9; c++) {
				var position = r * 16 + c
				var o = new empty(position)
				this.map.posList[i][position] = o
				this.buffer[position] = 0
			}
		}
	}
}
_LP.prototype = {
	add: function(page, keyname, type, position, colormap, option) {
		var o = new type(this.map, page, keyname, position, colormap, option)
	},
	setPage: function(page) {
		if (page < 0 || 7 < page) {
			Page = 0
			post("ERR : invalid pagenumber. pagenumber is 0~7\n")
		} else {
			Page = page
			post("Page set " + Page + "\n")
		}
		
		LP.out(2, [0, 0]) //hard reset
		
		//pagetab lighting
		LP.out(2, [50, 104 + Page])
	
		//flash
		this.flash(Page)
	},
	push: function(position, velocity) {
		this.map.posList[Page][position].push(velocity, position)
	},
	flash: function(page) {
		for each(var o in this.map.objList) {
			if (o.page == page) o.flash()
		}
	},
	set: function(keyname, data) {
		if (keyname in this.map.objList) {
			this.map.objList[keyname].set(data)
		} else {
			post("ERR : invalid keyname " + keyname + " \n")
		}
	},
	out : function(num, out) {
		outlet(num,out)
		if (num==2) {
			if (out[0]==0 && out[1]==0) {
				for (var r = 0; r < 8; r++) {
					for (var c = 0; c < 9; c++) {
						this.buffer[r*16+c] = 0
					}
				}
			}
		}else if(num==1) {
			this.buffer[out[0]] = out[1]
		}
	},
	getcolor : function(pos) {
		return this.buffer[pos]
	}
}



//-----include key objects-----
include("keyobj.js")
include("8x8font.js")




//-----user setting-----
function initialize() {
	LP = new _LP
	Page = 0
	include(setting)
}



//-----functions-----
var LP = new _LP


function set() {
	var keyname = arguments[0]
	var data = [arguments[1], arguments[2], arguments[3]]
	LP.set(keyname, data)
}

function setPage() {
	var page = arguments[0]
	LP.setPage(page)
}

function note() {
	var position = arguments[0]
	var velocity = arguments[1]
	LP.push(position, velocity)
}

function ctl() {
	var position = arguments[1];
	var velocity = arguments[0];
	if (velocity == 127) LP.setPage(position - 104)
}

function loadbang() {
	reset()
}

function reset() {
	initialize()
	LP.setPage(0)
	post("LP setup done!\n")
}

function dump() {
	for (var obj in LP.map.objList) {
		post(obj)
	}
}


post("launchpad.js compiled.\n")