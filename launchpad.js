var setting = "setting.js"

/*
launchpad.js by K.Aoki(Prily - prhyzmica)

#usage
	1.add obj to LP
	LP.add(page,keyname,type,position,colormap)

	keyname: name of key(unique)
	type:		function
	position:	button position data(val or array)


#type
	button)
	position: position
	colormap:	[off,on]

	toggle)
	position: position
	colormap:	[off,on]

	selector)
	position:	[button1,button2,...]
	colormap:	[off,on]
	
	counter)
	selector, but display only
	
	fader)
	position: [zero_button,position_gap,length]
	colormap:	[off,on]
	
	matrix)
	position: [upper_left_button_row,upper_left_button_column,width,height]
	colormap:	[off,on]
	
	matrix_display)
	matrix, but display only


#colormap
	the bigger, the brighter. 0 is OFF. 

	Red:	0,1,2,3 
	Green:	0,16,32,48
	Value = Red + Green

	example:
		HIGH:
			Green 48
			Yerrow 49
			Orange 51
			Reg 3
		MIDDLE:
			Green 32
			Yerrow 33
			Orange 35
			Red 2
		LOW:
			Green 16
			Yerrow 17
			Orange 19
			Red 1
*/


//-----common setting-----
inlets = 1
outlets = 3
autowatch = 1

//-----LP-----
var Page = 0
var _LP = function(){
	//init
	this.map = {}
	this.map.objList = {}
	this.map.posList = new Array(8)
	for (var i=0; i<8; i++) {
		this.map.posList[i] = new Array(8*9)
		for (var r=0; r<8; r++) {
			for (var c=0; c<9; c++) {
				var position = r*16+c
				var o = new empty(position)
				this.map.posList[i][position] = o
			}
		}
	}
}
_LP.prototype = {
	add : function(page,keyname,type,position,colormap,option){
		var o = new type(this.map,page,keyname,position,colormap,option)
	},
	setPage : function(page) {
		if (page<0 || 7<page) {
			Page = 0
			post("ERR : invalid pagenumber. pagenumber is 0~7\n")
		}else{
			Page = page
			post("Page set "+Page+"\n")
		}
		outlet(2,[0,0]) //hard reset
		//pagetab lighting
		for (var i=0; i<8; i++) {
			outlet(2,[0,104+i])
		}
		outlet(2,[50,104+Page])
		
		//flash
		LP.flash(Page)
	},
	push : function(position,velocity) {
		this.map.posList[Page][position].push(velocity,position)
	},
	flash : function(page) {
		for each (var o in this.map.objList) {
			if(o.page==page) o.flash()
		}
	},
	set : function(keyname,data) {
		if (keyname in this.map.objList) {
			this.map.objList[keyname].set(data)
		}else{
			post("ERR : invalid keyname "+keyname+" \n")
		}
	}
}



//-----include key objects-----
include("keyobj.js")
include("8x8font.js")








//-----user setting-----
function initialize(){
	LP = new _LP
	Page = 0
	include(setting)
}



//-----functions-----
var LP = new _LP


function set(){
	var keyname = arguments[0]
	var data = [arguments[1],arguments[2],arguments[3]]
	LP.set(keyname,data)
}
function setPage(){
	var page = arguments[0]
	LP.setPage(page)
}
function note(){
	var position = arguments[0]
	var velocity = arguments[1]
	LP.push(position,velocity)
}
function ctl(){
	var position = arguments[1];
	var velocity = arguments[0];
	if (velocity==127) LP.setPage(position-104)
}
function loadbang(){
	reset()
}
function reset(){
	initialize()
	LP.setPage(0)
	post("LP setup done!\n")
}
function dump(){
	for(var obj in LP.map.objList) {
		post(obj)
	}
}


post("launchpad.js compiled.\n")
//reset()
