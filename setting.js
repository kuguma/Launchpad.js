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
    position:	[button0,button1,...]
    colormap:	on

    line_counter)
    position:	[upper_left_button_column,upper_left_button_row,width,height]
    colormap:	on
	
    fader)
    position:   [zero_button,position_gap,length]
    colormap:	[off,on]
	
    matrix)
    position:   [upper_left_button_column,upper_left_button_row,width,height]
    colormap:	[off,on]
	
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
        Red     3, 2, 1
*/

LP.add(0, "b1", button, 0, [1, 51])
LP.add(0, "t1", toggle, 1, [1, 51])
LP.add(0, "t2", toggle, 2, [1, 51], {ignore_push:1})
LP.add(0, "s1", selector, [17, 18, 19], [1, 51])
LP.add(0, "c1", counter, [112, 113, 114, 115, 116, 117, 118, 119], 32)
LP.add(1, "f1", fader, [112, -16, 8], [16, 51])
LP.add(1, "f2", fader, [113, -16, 8], [16, 51], {max_value:127})
LP.add(2, "m1", matrix, [0, 0, 8, 8], [0, 3])
LP.add(2, "lc1", line_counter, [0, 0, 8, 8], 16)
LP.add(3, "mes", message_display, 0, [0, 51])

post("setting.js included.\n")