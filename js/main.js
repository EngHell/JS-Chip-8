/*******************************************************************************
 * initial setup
 *******************************************************************************/
var c8 = chip8();
var ctx;
var control = {
	fps : 120,
	intervalId: 0
};


/*******************************************************************************
 * Keystrokes functions
 *******************************************************************************/
// key map
// Keypad                   Keyboard
// +-+-+-+-+                +-+-+-+-+
// |1|2|3|C|                |1|2|3|4|
// +-+-+-+-+                +-+-+-+-+
// |4|5|6|D|                |Q|W|E|R|
// +-+-+-+-+       =>       +-+-+-+-+
// |7|8|9|E|                |A|S|D|F|
// +-+-+-+-+                +-+-+-+-+
// |A|0|B|F|                |Z|X|C|V|
// +-+-+-+-+                +-+-+-+-+
var keyMap = {
	49:0x1, 50:0x2, 51:0x3, 52:0xc,
	81:0x4, 87:0x5, 69:0x6, 82:0xd,
	65:0x7, 83:0x8, 68:0x9, 70:0xe,
	90:0xa, 88:0x0, 67:0xb, 86:0xf
};

var keyDown = function(e){
	var keycode = keyMap[e.keyCode];
	if (typeof keycode !== 'undefined') {
		c8.key[keycode] = 1;
	}
	
};

var keyUp = function(e){
	var keycode = keyMap[e.keyCode];
	if (typeof keycode !== 'undefined') {
		c8.key[keycode] = 0;
	}
	
};

window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);


/*******************************************************************************
 * Emulation loop functions
 *******************************************************************************/
var tick = function(){
	// the keys are event bounded so no need for special code there
	// look for window.addEventListener("keydown", keyDown, false);
	
	c8.emulateCycle();

	debugger8.updateRegisters();
	debugger8.updateI();
	debugger8.updatePC();
	debugger8.updateDelay();
	debugger8.updateSound();
	
	if(c8.dFlags.d)
		requestAnimationFrame(draw.draw);
	
	if(c8.pc > (c8.romSize + 0x200)){
		console.log("exiting execution since theres no thing to be accesed outside of rom memory");
		pauseEmulation();
	}
};


/*******************************************************************************
 * Emulation control functions
 *******************************************************************************/
var pauseEmulation = function() {
    clearInterval(control.intervalId);
    control.intervalId = 0;
};

var startEmulation = function() {
    control.intervalId = setInterval(tick, 100/ control.fps);
};


/*******************************************************************************
 * GFX functions
 *******************************************************************************/
/**
 * Initializes our canvas context
 */
var initGFX = function() {
	var c = document.getElementById("screen");
	ctx = c.getContext("2d");
	draw.clearScren();
};

// Canvas abstraction
var draw = {};
// draws a point
draw.point = function(x, y, color){
	var scaleFactor = 4;
	
	ctx.fillStyle = color;
	// in this case 4 cuz ive set the scale of the screen to 4x
	ctx.fillRect(x * scaleFactor,y * scaleFactor, scaleFactor, scaleFactor);
};

// clear the screen
draw.clearScren = function() {
	var scaleFactor = 4;
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, 64 * scaleFactor, 32 * scaleFactor)
};

// this is run everytime the draw flag is activated
draw.draw = function() {
	var x = s.dFlags.x;
	var y = s.dFlags.y;
	var w = s.dFlags.w;
	var h = s.dFlags.h;
	var color;
	for(var i = 0; i < w; i++){
		for(var j = 0; j < h; j++){
			var offset = x + i +((y + j) * 64);
			if(c8.gfx[offset] === 1){
				color = "#000";
			} else {
				color = "#fff";
			}
			draw.point(x + i, y + j, color);
		}
	}
	s.dFlags.d = false;
};


/*******************************************************************************
 * Button bindings
 *******************************************************************************/
document.getElementById("stop").onclick = function(){
    pauseEmulation();
    draw.clearScren();
    c8.initialized = false;
};

var postLoadRomFunction = function() {
    if(control.intervalId === 0){
        startEmulation();
    } else {
        alert("The emulation is already running");
    }
};

// load the room and starts the emulation
document.getElementById("load").onclick = function(){
    console.clear();
    //Set up render system and register input callbacks
    initGFX();

    // initialize things
    c8.initialize();
    debugger8.initialize(c8, "v#", "PC", "I", "delay", "sound");

    var element = document.getElementById("rom");
    c8.loadRom(element, postLoadRomFunction);

};

document.getElementById("continue").onclick = function() {
	if(c8.initialized && control.intervalId === 0){
		startEmulation();
	}
};

document.getElementById("pause").onclick = function() {
	if(c8.initialized && control.intervalId !== 0){
		pauseEmulation();
	}
};

document.getElementById("next").onclick = function() {
	tick();
};


/*******************************************************************************
 * Utility functions
 *******************************************************************************/
//translates to uint into an opcode number
var t2Uint = function(a, b){
	return (a << 8) | b;
};

//checks the opcode at certain memory spot
var g2mUint = function(start){
	return t2Uint(c8.memory[start], c8.memory[start + 1]);
};

//gets the uint at certain memoery spot
var g1mUint = function(start){
	return c8.memory[start];
};

//checks the sprite at certain memory spot
var gsprite = function(start, height){
	for(var i = 0; i < height; i++){
		console.log( g1mUint(start + (i*2) ).toString(2) );
	}
};