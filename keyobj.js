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
			LP.out(0,[this.keyname,this.position]) //data
			LP.out(1,[this.position,this.colormap[1]]) //noteout
		}else{
			LP.out(1,[this.position,this.colormap[0]]) //noteout
		}
	},
	flash : function(){}
}

//button
var button = function(map,page,keyname,position,colormap,option) {
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
			LP.out(0,[this.keyname,1]) //data
			LP.out(1,[this.position,this.colormap[1]]) //noteout
		}else{
			LP.out(1,[this.position,this.colormap[0]]) //noteout
		}
	},
	flash : function() {
		LP.out(1,[this.position,this.colormap[0]]) //noteout
	},
	set : function(data) {}
}

//toggle
var toggle = function(map,page,keyname,position,colormap,option) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	this.data = 0
	this.ignore_push = (function(){if(option){return (option.ignore_push||0)}else{return 0}})()
	map.objList[keyname] = this
	map.posList[page][position] = this
}
toggle.prototype = {
	push : function(velocity) {
		if(this.ignore_push==0) {
			if (velocity==127) {
				if (this.data==0) this.data = 1
				else this.data = 0
				LP.out(0,[this.keyname,this.data]) //data
				LP.out(1,[this.position,this.colormap[this.data]]) //noteout
			}else{
				LP.out(1,[this.position,this.colormap[this.data]]) //noteout
			}
		}
	},
	flash : function() {
		LP.out(0,[this.keyname,this.data]) //data
		LP.out(1,[this.position,this.colormap[this.data]]) //noteout
	},
	set : function(data) {
		if(data[0]!=0 && data[0]!=1) {
			post("ERR "+this.keyname+" invalid data" +data[0]+ "\n")
			data[0]=1
		}
		this.data = data[0]
		if(Page==this.page) {this.flash();}
	}
}

//selector
var selector = function(map,page,keyname,position,colormap,option) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	this.data = 0
	this.ignore_push = (function(){if(option){return (option.ignore_push||0)}else{return 0}})()
	map.objList[keyname] = this
	for (var i=0; i<position.length; i++) {
		map.posList[page][position[i]] = this
	}
}
selector.prototype = {
	push : function(velocity,position) {
		if(this.ignore_push==0) {
			if (velocity==127) {
				LP.out(1,[this.position[this.data],this.colormap[0]]) //noteout	
				for (var i=0; i<this.position.length; i++) {
					if (this.position[i]==position) {
						this.data = i
						LP.out(0,[this.keyname,this.data]) //data
						LP.out(1,[position,this.colormap[1]]) //noteout
					}
				}
			}
		}
	},
	flash : function() {
		for (var i=0; i<this.position.length; i++) {
			if (this.data==i) {
				LP.out(0,[this.keyname,this.data]) //data
				LP.out(1,[this.position[i],this.colormap[1]]) //noteout
			}else{
				LP.out(1,[this.position[i],this.colormap[0]]) //noteout
			}
		}
	},
	set : function(data) {
		if(data[0]>=this.position.length) {
			post("ERR "+this.keyname+" invalid data" +data[0]+ "\n")
			data[0]=0
		}
		if(Page==this.page) {
			LP.out(1,[this.position[this.data],this.colormap[0]]) //noteout
			this.data = data[0]
			LP.out(1,[this.position[this.data],this.colormap[1]]) //noteout
		}else{
			this.data = data[0]
		}
	}
}

//counter
var counter = function(map,page,keyname,position,colormap,option) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.position = position
	this.colormap = colormap
	this.bufcolor = 0
	this.data = 0
	map.objList[keyname] = this
}
counter.prototype = {
	flash : function() {
		for (var i=0; i<this.position.length; i++) {
			if (this.data==i) {
				this.bufcolor = LP.getcolor(this.position[i]) //buf
				LP.out(0,[this.keyname,this.data]) //data
				LP.out(1,[this.position[i],this.colormap]) //noteout
			}
		}
	},
	set : function(data){
		if(data[0]>=this.position.length) {
			post("ERR "+this.keyname+" invalid data" +data[0]+ "\n")
			data[0]=0
		}
		if(Page==this.page) {
			LP.out(1,[this.position[this.data],this.bufcolor]) //noteout
			this.data = data[0]
			this.bufcolor = LP.getcolor(this.position[this.data]) //buf
			LP.out(1,[this.position[this.data],this.colormap]) //noteout
		}else{
			this.data = data[0]
		}
	}
}

//line_counter
var line_counter = function(map,page,keyname,position,colormap,option) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.position = position
	this.upper_leftc = position[0]
	this.upper_leftr = position[1]
	this.width = position[2]
	this.height = position[3]
	this.colormap = colormap
	this.bufcolor = new Array(8)
	this.data = 0
	map.objList[keyname] = this
}
line_counter.prototype = {
	flash : function() {
		for (var i=0; i<this.width; i++) {
			if (this.data==i) {
				LP.out(0,[this.keyname,this.data]) //data
				for (var r=0; r<this.height; r++) {
					var pos = (r+this.upper_leftr)*16 + (i+this.upper_leftc)
					this.bufcolor[r] = LP.getcolor(pos) //buf
					LP.out(1,[pos,this.colormap]) //noteout
				}
			}
		}
	},
	set : function(data){
		if(Page==this.page) {
			for (var r=0; r<this.height; r++) {
				var pos = (r+this.upper_leftr)*16 + (this.data+this.upper_leftc)
				if (LP.getcolor(pos)==this.colormap) {
					LP.out(1,[pos,this.bufcolor[r]]) //noteout
				}
			}
			this.data = data[0]
			for (var r=0; r<this.height; r++) {
				var pos = (r+this.upper_leftr)*16 + (this.data+this.upper_leftc)
				this.bufcolor[r] = LP.getcolor(pos) //buf
				LP.out(1,[pos,this.colormap]) //noteout
			}
		}else{
			this.data = data[0]
		}
	}
}



//fader
var fader = function(map,page,keyname,position,colormap,option) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.colormap = colormap
	this.data = 0
	this.ignore_push = (function(){if(option){return (option.ignore_push||0)}else{return 0}})()
	this.max_value = (function(){if(option){return (option.max_value||1.0)}else{return 1.0}})()
	
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
		if(this.ignore_push==0) {
			if (velocity==127) {
				var match = 0
				for (var i=0; i<this.position.length; i++) {
					if (this.position[i]==position) {
						match = 1
						this.data = i
						LP.out(0,[this.keyname, this.data*(this.max_value/(this.position.length-1)) ]) //data
						LP.out(1,[this.position[i],this.colormap[1]]) //noteout
					}else if (match==0) {
						LP.out(1,[this.position[i],this.colormap[1]])
					}else{
						LP.out(1,[this.position[i],this.colormap[0]]) //noteout
					}
				}
			}
		}
	},
	flash : function() {
		var match = 0
		for (var i=0; i<this.position.length; i++) {
			if (i==this.data) {
				match = 1
				LP.out(0,[this.keyname, this.data*(this.max_value/(this.position.length-1)) ]) //data
				LP.out(1,[this.position[i],this.colormap[1]]) //noteout
			}else if (match==0) {
				LP.out(1,[this.position[i],this.colormap[1]])
			}else{
				LP.out(1,[this.position[i],this.colormap[0]]) //noteout
			}
		}
	},
	set : function(data) {
		var d = Math.round(data[0] / (this.max_value/(this.position.length-1)))
		this.data = d
		if(Page==this.page) {this.flash()}
	}
}

//matrix
var matrix = function(map,page,keyname,position,colormap,option) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.position = position
	this.upper_leftc = position[0]
	this.upper_leftr = position[1]
	this.width = position[2]
	this.height = position[3]
	this.colormap = colormap
	this.data = []
	this.ignore_push = (function(){if(option){return (option.ignore_push||0)}else{return 0}})()
	
	for (var r=0; r<this.height; r++) {
		for (var c=0; c<this.width; c++) {
			this.data[(this.upper_leftr+r)*16+(this.upper_leftc+c)] = {val:0, colmun:c, row:r}
		}
	}
	map.objList[keyname] = this
	for (var r=0; r<this.height; r++) {
		for (var c=0; c<this.width; c++) {
			map.posList[page][(this.upper_leftr+r)*16+(this.upper_leftc+c)] = this
		}
	}
}
matrix.prototype = {
	push : function(velocity,position) {
		if(this.ignore_push==0) {
			if (velocity==127) {
				if (this.data[position].val == 0) this.data[position].val = 1
				else this.data[position].val = 0
				LP.out(0,[this.keyname,this.data[position].colmun,this.data[position].row,this.data[position].val]) //data
				LP.out(1,[position,this.colormap[this.data[position].val]]) //noteout
			}else{
				LP.out(1,[position,this.colormap[this.data[position].val]]) //noteout
			}
		}
	},
	flash : function() {
			this.data.forEach(
				function(value,index,arr){
					LP.out(0,[this.keyname,value.colmun,value.row,value.val]) //data
					LP.out(1,[index,this.colormap[value.val]]) //noteout
			},this
		)
	},
	set : function(data) {
		//data = [colmun,row,data]
		var pos = (this.upper_leftr+data[1])*16+(this.upper_leftc+data[0])
		if(Page==this.page) {
			if (this.data[pos].val == 0) this.data[pos].val = 1
			else this.data[pos].val = 0
			LP.out(0,[this.keyname,this.data[pos].colmun,this.data[pos].row,this.data[pos].val]) //data
			LP.out(1,[pos,this.colormap[this.data[pos].val]]) //noteout
		}else{
			this.data[pos].val = data[2]
		}
	}
}

post("keyobj.js compiled.")