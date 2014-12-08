/*
launchpad.js by K.Aoki(Prily - prhyzmica)

#usage
	1.set to LP
	LP.set(keyname,type,position,colormap)

	keyname: name of key
	type:		"button","toggle","selector",etc
	position:	button position data
	colormap:	light color

	2.reset

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
	
	fader)
	position: [zero_button,position_gap,length]
	colormap:	[off,on]
	
	matrix)
	position: [upper_left_button_row,upper_left_button_column,width,height]
	colormap:	[off,on]


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

//-----setup(user)-----
var Namemap = {}
var Myset = function(){
	var addobj = function(page,keyname,type,pos,color,ex){
		Namemap[keyname]=page
		LP[page].addobj(keyname,type,pos,color)
	}
	
	//object1
	addobj(0,"o1mesh","toggle",0,[1,51])
	addobj(0,"o1point","toggle",1,[1,51])
	addobj(0,"o1camera","button",2,[16,48])
	addobj(0,"o1preset","button",3,[16,48])
	addobj(0,"o1color","toggle",4,[1,51])
	addobj(0,"o1auto","toggle",7,[1,3])
	
	//object2
	addobj(0,"o2enable","toggle",16,[1,51])
	addobj(0,"o2mode","selector",[17,18,19],[17,49])
	addobj(0,"o2num","selector",[20,21,22],[17,49])
	addobj(0,"o2auto","toggle",23,[1,3])
	
	//beat
	addobj(0,"b_in","button",104,[1,3])
	addobj(0,"b_minus","button",102,[1,3])
	addobj(0,"b_plus","button",103,[1,3])
	addobj(0,"b_rst","button",96,[1,3])
	addobj(0,"b_disp","counter",[112,113,114,115,116,117,118,119],[0,32])
	
	//fader
	addobj(1,"f0","fader",[112,-16,8],[16,51],"H")
	addobj(1,"f1","fader",[113,-16,8],[16,51],"H")
	addobj(1,"f2","fader",[114,-16,8],[16,51],"H")
	addobj(1,"f3","fader",[115,-16,8],[16,51],"H")
	addobj(1,"f4","fader",[116,-16,8],[16,51],"H")
	addobj(1,"f5","fader",[117,-16,8],[16,51],"H")
	addobj(1,"f6","fader",[118,-16,8],[16,51],"H")
	addobj(1,"f7","fader",[119,-16,8],[16,51],"H")

	
	//matrix
	addobj(2,"mt1","matrix_toggle",[0,0,8,8],[0,3])
	addobj(3,"mdisp","matrix_display",[0,0,8,8],[0,3])
}


//-----io-----

inlets = 3
outlets = 3
/*
in0  = notein
in1  = midiin(CC)
in2  = display
out0 = data
out1 = noteout
out2 = midiout(CC)
*/


//-----LP-----

var LP = []
var Page = 0 //0..7
var LPpage = function(pagenum) {
	this.pagenum = pagenum
	this.keyMap = []
	this.objList = {}
	this.thisLPpage = this
	
	//all reset
	//cell,A~H
	for (var r=0; r<8; r++) {
		for (var c=0; c<9; c++) {
			var position = r*16+c
			var k = new emptyKey(position)
			this.keyMap[position] = k
		}
	}

}
LPpage.prototype = {
	addobj : function(keyname,type,position,colormap,ex){
		switch (type) {
			case "button" :
				var k = new buttonKey(keyname,position,colormap,this.thisLPpage)
				this.objList[keyname] = k
				this.keyMap[position] = k
				break
			case "toggle" :
				var k = new toggleKey(keyname,position,colormap,this.thisLPpage)
				this.objList[keyname] = k
				this.keyMap[position] = k
				break
			case "selector" :
				var k = new selectorKeys(keyname,position,colormap,this.thisLPpage)
				this.objList[keyname] = k
				for (var i=0; i<position.length; i++) {
					this.keyMap[position[i]] = k
				}
				break
			case "fader" :
				var position2 = new Array()
				for (var i=0; i<position[2]; i++) {
					position2[i] = position[0]+position[1]*i
				}
				var k = new faderKeys(keyname,position2,colormap,this.thisLPpage)
				this.objList[keyname] = k
				for (var i=0; i<position2.length; i++) {
					this.keyMap[position2[i]] = k
				}
				break
			case "counter" :
				var k = new counterKeys(keyname,position,colormap,this.thisLPpage)
				this.objList[keyname] = k
				for (var i=0; i<position.length; i++) {
					this.keyMap[position[i]] = k
				}
				break
			case "matrix_toggle" :
				var k = new matrix_toggleKeys(keyname,position,colormap,this.thisLPpage)
				this.objList[keyname] = k
				for (var r=0; r<position[2]; r++) {
					for (var c=0; c<position[3]; c++) {
						this.keyMap[(position[0]+r)*16+(position[1]+c)] = k
					}
				}
				break
			case "matrix_display" :
				var k = new matrix_displayKeys(keyname,position,colormap,this.thisLPpage)
				this.objList[keyname] = k
				for (var r=0; r<position[2]; r++) {
					for (var c=0; c<position[3]; c++) {
						this.keyMap[(position[0]+r)*16+(position[1]+c)] = k
					}
				}
				break
		}
	},
	push : function(position,velocity) {
		this.keyMap[position].push(velocity,position)
	},
	flash : function() {
		for each (var o in this.objList) {
			o.flash()
		}
	},
	set : function(keyname,data) {
		this.objList[keyname].set(data)
	}
}

//-----mapping-----

function mapping() {
	//port set
	
	
	//hard reset
	outlet(2,[176,0,0])
	
	//new LP
	for (var i=0; i<8; i++) {
		LP[i] = new LPpage(i)
	}

	//1~8
	for (var i=0; i<8; i++) {
		outlet(2,[176,104+i,0])
	}
	
	//page set
	Page = 0
	outlet(2,[176,104,127])
	
	Myset()
	
	//flash
	LP[0].flash()
		
	post("LP setup done!\n")
}
	


//-----Keys-----

//empty
var emptyKey = function(position) {
	this.keyname = "(none)"
	this.position = position
	this.colormap = [0,16]
}
emptyKey.prototype = {
	push : function(velocity) {
		if (velocity==127) {
			outlet(0,[this.keyname,1]) //data
			outlet(1,[this.position,this.colormap[1]]) //noteout
		}else{
			outlet(1,[this.position,this.colormap[0]]) //noteout
		}
	},
	flash : function(){},
	set : function(data){}
}

//button
var buttonKey = function(keyname,position,colormap,thisLPpage) {
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	this.thisLPpage = thisLPpage
}
buttonKey.prototype = {
	push : function(velocity) {
		if (velocity==127) {
			outlet(0,[this.keyname,1]) //data
			outlet(1,[this.position,this.colormap[1]]) //noteout
		}else{
			outlet(1,[this.position,this.colormap[0]]) //noteout
		}
	},
	flash : function() {
		//outlet(0,[this.keyname,0]) //data
		outlet(1,[this.position,this.colormap[0]]) //noteout
	},
	set : function(data) {}
}

//toggle
var toggleKey = function(keyname,position,colormap,thisLPpage) {
	this.keyname = keyname
	this.position = position
	this.data = 0
	this.colormap = colormap
	this.thisLPpage = thisLPpage
}
toggleKey.prototype = {
	push : function(velocity) {
		if (velocity==127) {
			if (this.data==0) this.data = 1
			else this.data = 0
			outlet(0,[this.keyname,this.data]) //data
			outlet(1,[this.position,this.colormap[this.data]]) //noteout
		}else{
			outlet(1,[this.position,this.colormap[this.data]]) //noteout
		}
	},
	flash : function() {
		outlet(0,[this.keyname,this.data]) //data
		outlet(1,[this.position,this.colormap[this.data]]) //noteout
	},
	set : function(data) {
		this.data = data[0]
		if(Page==this.thisLPpage.pagenum) {this.flash()}
	}
}

//selector
var selectorKeys = function(keyname,positions,colormap,thisLPpage) {
	this.keyname = keyname
	this.positions = positions
	this.colormap = colormap
	this.thisLPpage = thisLPpage
	this.data = 0
	this.mem = 0
}
selectorKeys.prototype = {
	push : function(velocity,position) {
		if (velocity==127) {
			outlet(1,[this.positions[this.data],this.colormap[0]]) //noteout	
			for (var i=0; i<this.positions.length; i++) {
				if (this.positions[i]==position) {
					this.data = i
					outlet(0,[this.keyname,this.data]) //data
					outlet(1,[position,this.colormap[1]]) //noteout
				}
			}
		}
	},
	flash : function() {
		for (var i=0; i<this.positions.length; i++) {
			if (this.data==i) {
				outlet(0,[this.keyname,this.data]) //data
				outlet(1,[this.positions[i],this.colormap[1]]) //noteout
			}else{
				outlet(1,[this.positions[i],this.colormap[0]]) //noteout
			}
		}
	},
	set : function(data) {
		if(Page==this.thisLPpage.pagenum) {
			outlet(1,[this.positions[this.data],this.colormap[0]]) //noteout
			this.data = data[0]
			outlet(1,[this.positions[this.data],this.colormap[1]]) //noteout
		}else{
			this.data = data[0]
		}
	}
}

//counter
var counterKeys = function(keyname,positions,colormap,thisLPpage) {
	this.keyname = keyname
	this.positions = positions
	this.colormap = colormap
	this.thisLPpage = thisLPpage
	this.data = 0
	this.mem = 0
}
counterKeys.prototype = {
	push : function(velocity,position) {},
	flash : function() {
		for (var i=0; i<this.positions.length; i++) {
			if (this.data==i) {
				outlet(0,[this.keyname,this.data]) //data
				outlet(1,[this.positions[i],this.colormap[1]]) //noteout
			}else{
				outlet(1,[this.positions[i],this.colormap[0]]) //noteout
			}
		}
	},
	set : function(data) {
		if(Page==this.thisLPpage.pagenum) {
			outlet(1,[this.positions[this.data],this.colormap[0]]) //noteout
			this.data = data[0]
			outlet(1,[this.positions[this.data],this.colormap[1]]) //noteout
		}else{
			this.data = data[0]
		}
	}
}

//fader
var faderKeys = function(keyname,positions,colormap,thisLPpage) {
	this.keyname = keyname
	this.positions = positions
	this.colormap = colormap
	this.thisLPpage = thisLPpage
	this.data = 0
	this.mem = 0
}
faderKeys.prototype = {
	push : function(velocity,position) {
		if (velocity==127) {
			var match = 0
			for (var i=0; i<this.positions.length; i++) {
				if (this.positions[i]==position) {
					match = 1
					this.data = i
					outlet(0,[this.keyname, this.data*(1.0/(this.positions.length-1)) ]) //data
					outlet(1,[this.positions[i],this.colormap[1]]) //noteout
				}else if (match==0) {
					outlet(1,[this.positions[i],this.colormap[1]])
				}else{
					outlet(1,[this.positions[i],this.colormap[0]]) //noteout
				}
			}
		}
	},
	flash : function() {
		var match = 0
		for (var i=0; i<this.positions.length; i++) {
			if (i==this.data) {
				match = 1
				outlet(0,[this.keyname, this.data*(1.0/(this.positions.length-1)) ]) //data
				outlet(1,[this.positions[i],this.colormap[1]]) //noteout
			}else if (match==0) {
				outlet(1,[this.positions[i],this.colormap[1]])
			}else{
				outlet(1,[this.positions[i],this.colormap[0]]) //noteout
			}
		}
	},
	set : function(data) {
		var d = Math.round(data[0] / (1.0/(this.positions.length-1)))
		this.data = d
		if(Page==this.thisLPpage.pagenum) {this.flash()}
	}
}

//matrix_toggle
var matrix_toggleKeys = function(keyname,position,colormap,thisLPpage) {
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	this.thisLPpage = thisLPpage
	this.data = []
	for (var r=0; r<this.position[2]; r++) {
		for (var c=0; c<this.position[3]; c++) {
			this.data[(this.position[0]+r)*16+(this.position[1]+c)] = {val:0, colmun:c, row:r}
		}
	}
}
matrix_toggleKeys.prototype = {
	push : function(velocity,position) {
		if (velocity==127) {
			if (this.data[position].val == 0) this.data[position].val = 1
			else this.data[position].val = 0
			outlet(0,[this.keyname,this.data[position].colmun,this.data[position].row,this.data[position].val]) //data
			outlet(1,[position,this.colormap[this.data[position].val]]) //noteout
		}else{
			outlet(1,[position,this.colormap[this.data[position].val]]) //noteout
		}
	},
	flash : function() {
			this.data.forEach(
				function(value,index,arr){
					outlet(0,[this.keyname,value.colmun,value.row,value.val]) //data
					outlet(1,[index,this.colormap[value.val]]) //noteout
			},this
		)
	},
	set : function(data) {
		//data = [colmun,row,data]
		var pos = (this.position[0]+data[1])*16+(this.position[1]+data[0])
		if(Page==this.thisLPpage.pagenum) {
			if (this.data[pos].val == 0) this.data[pos].val = 1
			else this.data[pos].val = 0
			outlet(0,[this.keyname,this.data[pos].colmun,this.data[pos].row,this.data[pos].val]) //data
			outlet(1,[pos,this.colormap[this.data[pos].val]]) //noteout
		}else{
			this.data[pos].val = data[2]
		}
	}
}

//matrix_display
var matrix_displayKeys = function(keyname,position,colormap,thisLPpage) {
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	this.thisLPpage = thisLPpage
	this.data = [] //access: data[position]
	for (var r=0; r<this.position[2]; r++) {
		for (var c=0; c<this.position[3]; c++) {
			this.data[(this.position[0]+r)*16+(this.position[1]+c)] = {val:0, colmun:c, row:r}
		}
	}
}
matrix_displayKeys.prototype = {
	push : function(velocity,position) {},
	flash : function() {
			this.data.forEach(
				function(value,index,arr){
					outlet(1,[index,this.colormap[value.val]]) //noteout
			},this
		)
	},
	set : function(data) {
		//data = [colmun,row,data]
		var pos = (this.position[0]+data[1])*16+(this.position[1]+data[0])
		if(Page==this.thisLPpage.pagenum) {
			if (this.data[pos].val == 0) this.data[pos].val = 1
			else this.data[pos].val = 0
			outlet(0,[this.keyname,this.data[pos].colmun,this.data[pos].row,this.data[pos].val]) //data
			outlet(1,[pos,this.colormap[this.data[pos].val]]) //noteout
		}else{
			this.data[pos].val = data[2]
		}
	}
}


//-----common-----

function loadbang() {
	mapping()
}

function bang() {}
function msg_int() {}
function msg_float() {}

function reset() {
	mapping()
}

function anything() {
	if (inlet==0) { //notein
		var position = arguments[0]
		var velocity = arguments[1]
		LP[Page].push(position,velocity)
	}else if (inlet==1) { //midiin(CC)
		var position = arguments[0]
		var velocity = arguments[1]
		Page = position-104
		if (Page<0 || 7<Page) {
			Page = 0
			post("ERR : invalid pagenumber\n")
		}
		if (velocity==127) {			
			//hard reset
			outlet(2,[176,0,0])
			
			//pagetab lighting
			for (var i=0; i<8; i++) {
				outlet(2,[176,104+i,0])
			}
			outlet(2,[176,position,50])
			
			//all flash
			LP[Page].flash()
			
			post("Page set "+Page+"\n")
		}
	}else if (inlet==2) { // set
		//keyname,[data]
		var data = [arguments[1],arguments[2],arguments[3]]
		var keyname = String(arguments[0])
		if (arguments[0] in Namemap) {
			LP[Namemap[arguments[0]]].set(arguments[0],data)
		}else{
			post("ERR : invalid keyname "+arguments[0]+" \n")
		}
	}
}
	
