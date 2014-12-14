/*
This is setting file for launchpad.js

#usage
1.add keyobj to LP
LP.add(page,keyname,type,position,colormap)

keyname:    unique name.
            if you want access keyobj, send [set (keyname) (data0,data1...)] to launchpad.js inlet 0.
            and if button was pushed, launchpad.js out data [(keyname), (data0,data1...)] at outlet 0 (data out).
type:	    function. read keyobj.js
position:   position data(value or array)


#type
    button)
    position:   position
    colormap:	[off,on]

    toggle)
    position:   position
    colormap:	[off,on]

    selector)
    position:	[button0,button1,...]
    colormap:	[off,on]
	
    counter)
    selector, but display only
	
    fader)
    position:   [zero_button,position_gap,length]
    colormap:	[off,on]
	
    matrix)
    position:   [upper_left_button_row,upper_left_button_column,width,height]
    colormap:	[off,on]
	
    matrix_display)
    matrix, but display only

    message_display)
    position:   0
    colormap:   [off,on]


#colormap
    the bigger, the brighter. 0 is OFF. 

    Red:	0,1,2,3 
    Green:	0,16,32,48
    Value = Red + Green

    example:
        Green   48, 32, 16
        Yerrow  49, 17, 33
        Orange  51, 35, 19
        Reg     3, 2, 1
*/

LP.add(0, "b1", button, 0, [1, 51])
LP.add(0, "t1", toggle, 1, [1, 51])
LP.add(0, "t2", toggle, 2, [1, 51], {ignore_push:1})
LP.add(0, "s1", selector, [17, 18, 19], [1, 51])
LP.add(0, "c1", counter, [112, 113, 114, 115, 116, 117, 118, 119], 32)
LP.add(1, "f1", fader, [112, -16, 8], [16, 51])
LP.add(1, "f2", fader, [113, -16, 8], [16, 51])
LP.add(2, "m1", matrix, [0, 0, 8, 8], [0, 3])
//LP.add(2, "lc1", linecounter, [0, 0, 8, 8], [0, 16])

LP.add(0, "c2", counter, [0,1,2,3,4,5,6,7], 32)

post("setting.js included.\n")