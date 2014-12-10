//-----key objects-----
//empty
var empty = function(position) {
	this.keyname = "(none)"
	this.position = position
	this.colormap = [0,16]
}
empty.prototype = {
	push : function(velocity) {
		if (velocity==127) {
			outlet(0,[this.keyname,this.position]) //data
			outlet(1,[this.position,this.colormap[1]]) //noteout
		}else{
			outlet(1,[this.position,this.colormap[0]]) //noteout
		}
	},
	flash : function(){}
}

//button
var button = function(map,page,keyname,position,colormap) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	map.objList[keyname] = this
	map.posList[page][position] = this
}
button.prototype = {
	push : function(velocity) {
		if (velocity==127) {
			outlet(0,[this.keyname,1]) //data
			outlet(1,[this.position,this.colormap[1]]) //noteout
		}else{
			outlet(1,[this.position,this.colormap[0]]) //noteout
		}
	},
	flash : function() {
		outlet(1,[this.position,this.colormap[0]]) //noteout
	},
	set : function(data) {}
}

//toggle
var toggle = function(map,page,keyname,position,colormap) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	this.data = 0
	map.objList[keyname] = this
	map.posList[page][position] = this
}
toggle.prototype = {
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
		if(Page==this.Page) {this.flash();}
	}
}

//selector
var selector = function(map,page,keyname,position,colormap) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	this.data = 0
	map.objList[keyname] = this
	for (var i=0; i<position.length; i++) {
		map.posList[page][position[i]] = this
	}
}
selector.prototype = {
	push : function(velocity,position) {
		if (velocity==127) {
			outlet(1,[this.position[this.data],this.colormap[0]]) //noteout	
			for (var i=0; i<this.position.length; i++) {
				if (this.position[i]==position) {
					this.data = i
					outlet(0,[this.keyname,this.data]) //data
					outlet(1,[position,this.colormap[1]]) //noteout
				}
			}
		}
	},
	flash : function() {
		for (var i=0; i<this.position.length; i++) {
			if (this.data==i) {
				outlet(0,[this.keyname,this.data]) //data
				outlet(1,[this.position[i],this.colormap[1]]) //noteout
			}else{
				outlet(1,[this.position[i],this.colormap[0]]) //noteout
			}
		}
	},
	set : function(data) {
		if(Page==this.Page) {
			outlet(1,[this.position[this.data],this.colormap[0]]) //noteout
			this.data = data[0]
			outlet(1,[this.position[this.data],this.colormap[1]]) //noteout
		}else{
			this.data = data[0]
		}
	}
}

//counter
var counter = function(map,page,keyname,position,colormap) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	this.data = 0
	map.objList[keyname] = this
}
counter.prototype = {
	flash : selector.prototype.flash,
	set : selector.prototype.set
}

//fader
var fader = function(map,page,keyname,position,colormap) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.colormap = colormap
	this.data = 0
	
	this.position = new Array()
	for (var i=0; i<position[2]; i++) {
		this.position[i] = position[0]+position[1]*i
	}
	map.objList[keyname] = this
	for (var i=0; i<this.position.length; i++) {
		map.posList[page][this.position[i]] = this
	}
}
fader.prototype = {
	push : function(velocity,position) {
		if (velocity==127) {
			var match = 0
			for (var i=0; i<this.position.length; i++) {
				if (this.position[i]==position) {
					match = 1
					this.data = i
					outlet(0,[this.keyname, this.data*(1.0/(this.position.length-1)) ]) //data
					outlet(1,[this.position[i],this.colormap[1]]) //noteout
				}else if (match==0) {
					outlet(1,[this.position[i],this.colormap[1]])
				}else{
					outlet(1,[this.position[i],this.colormap[0]]) //noteout
				}
			}
		}
	},
	flash : function() {
		var match = 0
		for (var i=0; i<this.position.length; i++) {
			if (i==this.data) {
				match = 1
				outlet(0,[this.keyname, this.data*(1.0/(this.position.length-1)) ]) //data
				outlet(1,[this.position[i],this.colormap[1]]) //noteout
			}else if (match==0) {
				outlet(1,[this.position[i],this.colormap[1]])
			}else{
				outlet(1,[this.position[i],this.colormap[0]]) //noteout
			}
		}
	},
	set : function(data) {
		var d = Math.round(data[0] / (1.0/(this.position.length-1)))
		this.data = d
		if(Page==this.Page) {this.flash()}
	}
}

//matrix
var matrix = function(map,page,keyname,position,colormap) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	this.data = []
	for (var r=0; r<position[2]; r++) {
		for (var c=0; c<position[3]; c++) {
			this.data[(position[0]+r)*16+(position[1]+c)] = {val:0, colmun:c, row:r}
		}
	}
	map.objList[keyname] = this
	for (var r=0; r<position[2]; r++) {
		for (var c=0; c<position[3]; c++) {
			map.posList[page][(position[0]+r)*16+(position[1]+c)] = this
		}
	}
}
matrix.prototype = {
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
		if(Page==this.Page) {
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
var matrix_display = function(map,page,keyname,position,colormap) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	this.data = [] //access: data[position]
	for (var r=0; r<this.position[2]; r++) {
		for (var c=0; c<this.position[3]; c++) {
			this.data[(this.position[0]+r)*16+(this.position[1]+c)] = {val:0, colmun:c, row:r}
		}
	}
	map.objList[keyname] = this
}
matrix_display.prototype = {
	flash : matrix.prototype.flash,
	set : matrix.prototype.set
}
post("keyobj.js compiled.")