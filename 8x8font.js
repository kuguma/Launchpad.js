var message_display = function(map,page,keyname,position,colormap,option) {
	this.map = map
	this.page = page
	this.keyname = keyname
	this.colormap = colormap
	map.objList[keyname] = this
	this.Str = "null"
	this.Pos = 0
	this.B_Matrix = new Array()
	this.D_Matrix = new Array()
	for (var i=0; i<8; i++){
		this.B_Matrix[i] = new Array()
		this.D_Matrix[i] = new Array()
		for (var j=0; j<8; j++){
			this.B_Matrix[i][j] = this.colormap[0]
			this.D_Matrix[i][j] = this.colormap[0]
		}
	}
}

message_display.prototype = {
	fontdata : [
		0x00000000, 0x00000000, 0x18181818, 0x00180018, 0x00003636, 0x00000000, 0x367F3636, 0x0036367F, 
		0x3C067C18, 0x00183E60, 0x1B356600, 0x0033566C, 0x6E16361C, 0x00DE733B, 0x000C1818, 0x00000000, 
		0x0C0C1830, 0x0030180C, 0x3030180C, 0x000C1830, 0xFF3C6600, 0x0000663C, 0x7E181800, 0x00001818, 
		0x00000000, 0x0C181800, 0x7E000000, 0x00000000, 0x00000000, 0x00181800, 0x183060C0, 0x0003060C, 
		0x7E76663C, 0x003C666E, 0x181E1C18, 0x00181818, 0x3060663C, 0x007E0C18, 0x3860663C, 0x003C6660, 
		0x33363C38, 0x0030307F, 0x603E067E, 0x003C6660, 0x3E060C38, 0x003C6666, 0x3060607E, 0x00181818, 
		0x3C66663C, 0x003C6666, 0x7C66663C, 0x001C3060, 0x00181800, 0x00181800, 0x00181800, 0x0C181800, 
		0x06186000, 0x00006018, 0x007E0000, 0x0000007E, 0x60180600, 0x00000618, 0x3060663C, 0x00180018, 

		0x5A5A663C, 0x003C067A, 0x7E66663C, 0x00666666, 0x3E66663E, 0x003E6666, 0x06060C78, 0x00780C06, 
		0x6666361E, 0x001E3666, 0x1E06067E, 0x007E0606, 0x1E06067E, 0x00060606, 0x7606663C, 0x007C6666, 
		0x7E666666, 0x00666666, 0x1818183C, 0x003C1818, 0x60606060, 0x003C6660, 0x0F1B3363, 0x0063331B, 
		0x06060606, 0x007E0606, 0x6B7F7763, 0x00636363, 0x7B6F6763, 0x00636373, 0x6666663C, 0x003C6666, 
		0x3E66663E, 0x00060606, 0x3333331E, 0x007E3B33, 0x3E66663E, 0x00666636, 0x3C0E663C, 0x003C6670, 
		0x1818187E, 0x00181818, 0x66666666, 0x003C6666, 0x66666666, 0x00183C3C, 0x6B636363, 0x0063777F, 
		0x183C66C3, 0x00C3663C, 0x183C66C3, 0x00181818, 0x0C18307F, 0x007F0306, 0x0C0C0C3C, 0x003C0C0C, 
		0x180C0603, 0x00C06030, 0x3030303C, 0x003C3030, 0x00663C18, 0x00000000, 0x00000000, 0x003F0000, 

		0x00301818, 0x00000000, 0x603C0000, 0x007C667C, 0x663E0606, 0x003E6666, 0x063C0000, 0x003C0606, 
		0x667C6060, 0x007C6666, 0x663C0000, 0x003C067E, 0x0C3E0C38, 0x000C0C0C, 0x667C0000, 0x3C607C66, 
		0x663E0606, 0x00666666, 0x18180018, 0x00301818, 0x30300030, 0x1E303030, 0x36660606, 0x0066361E,
		0x18181818, 0x00301818, 0x7F370000, 0x0063636B, 0x663E0000, 0x00666666, 0x663C0000, 0x003C6666, 
		0x663E0000, 0x06063E66, 0x667C0000, 0x60607C66, 0x663E0000, 0x00060606, 0x063C0000, 0x003E603C, 
		0x0C3E0C0C, 0x00380C0C, 0x66660000, 0x007C6666, 0x66660000, 0x00183C66, 0x63630000, 0x00367F6B, 
		0x36630000, 0x0063361C, 0x66660000, 0x0C183C66, 0x307E0000, 0x007E0C18, 0x0C181830, 0x00301818, 
		0x18181818, 0x00181818, 0x3018180C, 0x000C1818, 0x003B6E00, 0x00000000, 0x00000000, 0x00000000
	],
	char2code : function(charactor) {
		var code
		switch (charactor) {
			case " ": code = 0; break;
			case "!": code = 1; break;
			case '"': code = 2; break;
			case "#": code = 3; break;
			case "$": code = 4; break;
			case "%": code = 5; break;
			case "&": code = 6; break;
			case "'": code = 7; break;
			case "(": code = 8; break;
			case ")": code = 9; break;
			case "*": code = 10; break;
			case "+": code = 11; break;
			case ",": code = 12; break;
			case "-": code = 13; break;
			case ".": code = 14; break;
			case "/": code = 15; break;
			
			case "0": code = 16; break;
			case "1": code = 17; break;
			case '2': code = 18; break;
			case "3": code = 19; break;
			case "4": code = 20; break;
			case "5": code = 21; break;
			case "6": code = 22; break;
			case "7": code = 23; break;
			case "8": code = 24; break;
			case "9": code = 25; break;
			case ":": code = 26; break;
			case ";": code = 27; break;
			case "<": code = 28; break;
			case "=": code = 29; break;
			case ">": code = 30; break;
			case "?": code = 31; break;
			
			case "@": code = 32; break;
			case "A": code = 33; break;
			case 'B': code = 34; break;
			case "C": code = 35; break;
			case "D": code = 36; break;
			case "E": code = 37; break;
			case "F": code = 38; break;
			case "G": code = 39; break;
			case "H": code = 40; break;
			case "I": code = 41; break;
			case "J": code = 42; break;
			case "K": code = 43; break;
			case "L": code = 44; break;
			case "M": code = 45; break;
			case "N": code = 46; break;
			case "O": code = 47; break;

			case "P": code = 48; break;
			case "Q": code = 49; break;
			case 'R': code = 50; break;
			case "S": code = 51; break;
			case "T": code = 52; break;
			case "U": code = 53; break;
			case "V": code = 54; break;
			case "W": code = 55; break;
			case "X": code = 56; break;
			case "Y": code = 57; break;
			case "Z": code = 58; break;
			case "[": code = 59; break;
			case "\\": code = 60; break;
			case "]": code = 61; break;
			case "^": code = 62; break;
			case "_": code = 63; break;
			
			case "'": code = 64; break;
			case "a": code = 65; break;
			case 'b': code = 66; break;
			case "c": code = 67; break;
			case "d": code = 68; break;
			case "e": code = 69; break;
			case "f": code = 70; break;
			case "g": code = 71; break;
			case "h": code = 72; break;
			case "i": code = 73; break;
			case "j": code = 74; break;
			case "k": code = 75; break;
			case "l": code = 76; break;
			case "m": code = 77; break;
			case "n": code = 78; break;
			case "o": code = 79; break;
			
			case "p": code = 80; break;
			case "q": code = 81; break;
			case 'r': code = 82; break;
			case "s": code = 83; break;
			case "t": code = 84; break;
			case "u": code = 85; break;
			case "v": code = 86; break;
			case "w": code = 87; break;
			case "x": code = 88; break;
			case "y": code = 89; break;
			case "z": code = 90; break;
			case "{": code = 91; break;
			case "|": code = 92; break;
			case "}": code = 93; break;
			case "~": code = 94; break;
			//case " ": code = 95; break;
			
			default : code = 0;
		}
		return code
	},
	displayChar : function(charactor,row,column) {
		var code = this.char2code(charactor)
		var fmatrix = new Array(8)
		for (var i=0; i<8; i++){
			fmatrix[i] = [0,0,0,0,0,0,0,0]
		}
		var fontU = this.fontdata[code*2]
		var fontD = this.fontdata[code*2+1]
		
		for (var r=0; r<4; r++){
			for (var c=0; c<8; c++){
				fmatrix[c][r] = (fontU & 0x1<<(c+r*8)) >> (c+r*8)
				fmatrix[c][r+4] = (fontD & 0x1<<(c+(r+4)*8)) >> (c+(r+4)*8)
			}
		}
		
		for (var r=0; r<8; r++){
			for (var c=0; c<8; c++){
				var r2 = r-row
				var c2 = c-column
				if (0<=r2 && r2<=7 && 0<=c2 && c2<=7) {
					//double buffering
					this.D_Matrix[c2][r2] = this.colormap[fmatrix[c][r]]
				}
			}
		}
	},
	flash : function(data) {
		for (var r=0; r<8; r++){
			for (var c=0; c<8; c++){
				var pos = r*16+c
				if (Page==this.page) LP.out(1,[pos,this.colormap[0]])
			}
		}
	},
	set : function(data) {
		var s = data[0]
		//taskが無名関数を指定した時バグるので直るまでコレで対応
		if (s=="update") {
			this.update()
		}else{
			this.Str = " "+s+" "
			this.Pos = [0,0] //mozi,bit
			post("set "+this.Str+"\n")
			
			//reset
			var r,c,pos
			for (var r=0; r<8; r++){
				for (var c=0; c<8; c++){
					this.B_Matrix[c][r] = this.colormap[0]
					this.D_Matrix[c][r] = this.colormap[0]
					var pos = r*16+c
					if (Page==this.page) LP.out(1,[pos,this.colormap[0]])
				}
			}
		}
	},
	update : function(){
		//Buffer erace
		for (var r=0; r<8; r++){
			for (var c=0; c<8; c++){
				this.B_Matrix[c][r] = this.D_Matrix[c][r]
				this.D_Matrix[c][r] = this.colormap[0]
			}
		}
		
		//draw to Buffer
		this.displayChar(this.Str.charAt(this.Pos[0]),0,this.Pos[1])
		if (this.Pos[1]!=0) {
			this.displayChar(this.Str.charAt(this.Pos[0]+1),0,this.Pos[1]-8)
		}
		
		//smart draw
		var r,c,pos
		for (var r=0; r<8; r++){
			for (var c=0; c<8; c++){
				if(this.B_Matrix[c][r]!==this.D_Matrix[c][r]) {
					var pos = r*16+c;
					if (Page==this.page) LP.out(1,[pos,this.D_Matrix[c][r]])
				}
			}
		}
		
		//counter++ and check
		if(this.Pos[1]==7) {
			this.Pos[0]++
			this.Pos[1]=0
		}else{
			this.Pos[1]++
		}
		if (this.Str.length <= this.Pos[0]) {
			this.Pos = [0,0]
			post("message_display done\n")
			LP.out(0,[this.keyname,0])
		}
	}
}

post("8x8font.js compiled.")