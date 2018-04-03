var chip8 = function(){
	var version = "1.0.0";

	var chip8_fontset = new Uint8Array(
		[
			0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
		  0x20, 0x60, 0x20, 0x20, 0x70, // 1
		  0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
		  0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
		  0x90, 0x90, 0xF0, 0x10, 0x10, // 4
		  0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
		  0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
		  0xF0, 0x10, 0x20, 0x40, 0x40, // 7
		  0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
		  0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
		  0xF0, 0x90, 0xF0, 0x90, 0x90, // A
		  0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
		  0xF0, 0x80, 0x80, 0x80, 0xF0, // C
		  0xE0, 0x90, 0x90, 0x90, 0xE0, // D
		  0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
		  0xF0, 0x80, 0xF0, 0x80, 0x80  // F
		]
	);

	var chip8 = {
		initialized: false,
		opcode :  0,
		memory :  0,
		V :  0,
		I :  0,
		pc :  0,
		gfx :  0,
		delay_timer :  0,
		sound_timer :  0,
		stack :  0,
		sp :  0,
		key :  0,
		romSize: 0,
		dFlags: {
			d: false,
			x: 0,
			y: 0,
			w: 0,
			h: 0
		},
		shouldRaisePC : true,
        version: version
	};
	var self = chip8;

	chip8.initialize = function() {
		self.memory = new Uint8Array(4096);
		self.V = new Uint8Array(16);
		self.pc = 0x200;
		self.opcode = 0;
		self.I = 0;
		self.sp = 0;
		self.gfx = new Uint8Array(64 * 32);
		self.stack = new Uint16Array(16);
		self.key = new Uint8Array(16);

		// Clear display
		// Clear stack
		// clear register V0-VF
		// clear memory
		// all those are not needed since we create new arrays for them :)

		// load fontset
		for(var i = 0; i < 80; i++){
			self.memory[i] = chip8_fontset[i];
		}

		self.initialized = true;
	};

	chip8.emulateCycle = function() {
        var s = self;
        var opcode = s.memory[s.pc] << 8 | s.memory[s.pc + 1];
        var i;
        var X = (opcode & 0x0f00) >> 8;
        var Y = (opcode & 0x00f0) >> 4;
        var NNN = opcode & 0x0fff;
        var NN = opcode & 0x00ff;
        var N = opcode & 0x000f;
        var VX = s.V[X];
        var VY = s.V[Y];
        var keycode;
        var keystate;

        if(s.delay_timer > 0)
            --s.delay_timer;

        if(s.sound_timer > 0)
            --s.sound_timer;
        
		console.log();

		switch(opcode & 0xF000){
			case 0x0000: // multiple things can happen there
				switch(opcode & 0x000F){
					case 0x0000: // 0x00e0: clears the screen
						// do something there
						logOpCode(opcode, "[sc]!!screen cleared!!");
						for(i = 0; i < s.gfx.length; i++){
							s.gfx[i] = 0;
						}
						s.dFlags.d = true;
						s.dFlags.x = 0;
						s.dFlags.y = 0;
						s.dFlags.w = 64;
						s.dFlags.h = 32;
						break;
					case 0x000e: // 0x00ee: returns from subroutine
						logOpCode(opcode, "[st]stack decrement!!");
						console.log("[st]old sp: " + s.sp + " old pc: " + s.pc);


						s.pc = s.stack[--s.sp];
						// I've commented this to stop an infinite loop of stack incremente and decrement
						//s.shouldRaisePC = false;

						console.log("[st]new sp: " + s.sp + " new pc " + s.pc);
						break;
					default:
						logUnknowOp(opcode, s.pc);
						break;
				}
				break;

			// 1NNN: jumps to adress NNN
			case 0x1000:
				logOpCode(opcode, "[cf]goto");

				s.pc = NNN;
				s.shouldRaisePC = false;

				console.log("[cf]Jumped to: " + s.pc);
				break;

			//0x2NNN: call subroutine at address NNN
			case 0x2000:
				logOpCode(opcode, "[st]stack increment!!");
				console.log("[st]Stack[" + s.sp +"] = " + s.pc);

				s.stack[s.sp++] = s.pc;
				s.pc = NNN;
				s.shouldRaisePC = false;


				console.log("[st]changed pc: " + s.pc);
				break;

			// 0x3XNN: skips next instruction if VX==NN
			case 0x3000:
				logOpCode(opcode, "[cf]skip VX==NN");
				console.log("[cf]VX: " + VX + " NN: "+ NN);

				if(VX === NN){
					s.pc+=4;
					s.shouldRaisePC = false;

					console.log("[cf]Skiped to pc: " + s.pc);
				}
				break;

			// 0x4XNN: skips next instruction if VX!=NN
			case 0x4000:
				logOpCode(opcode, "[cf]skip !=");
				console.log("[cf]VX: " + VX + " NN: "+ NN);

				if(VX !== NN){
					s.pc+=4;
					s.shouldRaisePC = false;

					console.log("[cf]Skiped to pc: " + s.pc);
				}
				break;

			// 0x5XY0: skips instruction if VX==VY
			case 0x5000:
				logOpCode(opcode, "[cf]skip VX==VY");
				console.log("[cf]VX: " + VX + " VY: "+ VY);

				if(VX === VY){
					s.pc+=4;
					s.shouldRaisePC = false;

					console.log("[cf]Skiped to pc: " + s.pc);
				}
				break;

			// 6XNN: sets VX to NN
			case 0x6000:
				logOpCode(opcode, "[va]vx=nn" );

				s.V[X] = NN;

				console.log("[va]V["+ X+"]="+ NN);
				break;

			// 7XNN: adds to VX NN
			case 0x7000:
				logOpCode(opcode, "[va]vx+=nn" );

				console.log("[va]V["+X+"]="+s.V[X]+" + " + NN);

				s.V[X] += NN;
				break;

			case 0x8000: // multiple thing there
				switch(opcode & 0x000f){

					// 0x8XY0: assing vx to the value of vy
					case 0x0000:
						logOpCode(opcode, "[mt]VX=VY");

						s.V[X] = VY;

						console.log("[mt]V["+ X +"]="+ VY);
						break;

					// 0x8XY1: sets VX to (VX or VY)
					case 0x0001:
						logOpCode(opcode, "[bo]VX=VX|VY");

						var OR = VX | VY;
						s.V[X] = OR;

						console.log("[bo]" + VX.toString(2));
						console.log("[bo]" + VY.toString(2));
						console.log("[bo]" + OR.toString(2));
						break;

					// 0x8XY2: VX = (VX and VY)
					case 0x0002:
						logOpCode(opcode, "[bo]VX=VX&VY");

						var AND = VX & VY;
						s.V[X] = AND;

						console.log("[bo]" + VX.toString(2));
						console.log("[bo]" + VY.toString(2));
						console.log("[bo]" + AND.toString(2));
						break;

					// 0x8XY2: VX = (VX xor VY)
					case 0x0003:
						logOpCode(opcode, "[bo]VX=VX^VY");

						var XOR = VX ^ VY;
						s.V[X] = XOR;

						console.log("[bo]" + VX.toString(2));
						console.log("[bo]" + VY.toString(2));
						console.log("[bo]" + XOR.toString(2));
						break;

					// 0x8XY4: vx += vy, sets vf to 1 if carry, 0 if not
					case 0x0004:
						logOpCode(opcode, "[mt]VX+=VY");
						if(VY > (0xff - VX)){
							s.V[0xf] = 1;
						} else {
							s.V[0xf] = 0;
						}
						s.V[X] += s.V[Y];
						break;

					// 0x8XY5: vx -= vy, sets vf to 0 if borrow, 1 if not
					case 0x0005:
						logOpCode(opcode, "[mt]VX-=VY");

						s.V[0xf] = 1;
						if(VY > VX)
							s.V[0xf] = 0;

						s.V[X] -= VY;
						console.log("[mt]VX: " + VX + " VY: " + VY);
						break;

					//8XY6: VF = lsb, vx = vx >> 1
					case 0x0006:
						logOpCode(opcode, "[bo]VX = VX>>1");

						var lsb = VY & 1;

						s.V[X] = VY >> 1;
						s.V[0xf]=lsb;

						console.log("[bo]VX:" + VY + ">>1: " + (VY >> 1).toString(2) + " lsb: " + lsb );
						break;

					// 0x8XY7: vx=vy - vx, sets vf to 0 if borrow, 1 if not
					case 0x0007:
						logOpCode(opcode, "[mt]VX=VY-VX");

						s.V[0xf] = 1;
						if(VX>VY)
							s.V[0xf] = 0;

						s.V[X] = VY - VX;
						console.log("[mt]VY: " + VY + " VX: " + VX);
						break;

						//8XYE: VF = msb, vx = VX << 1
						// GOTTA add a simulation for the quirksss
					case 0x000E:
						logOpCode(opcode, "[bo]VX = VX<<1");

						var msb = VX & 128;

						s.V[X] = VX << 1;
						s.V[0xf] = msb;

						console.log("[bo]VX:" + VX + "<<1: " + (VX << 1).toString(2) + " msb: " + msb );
						break;

					default:
						logUnknowOp(opcode, s.pc);
						break;
					}
				break;


			// 9XY0: skips iv VX!=VY
			case 0x9000:
				logOpCode(opcode, "[cf]skip VX!=VY");

				VX = s.V[X];
				VY = s.V[Y];

				if(VX !== VY){
					s.pc += 4;
					s.shouldRaisePC = false;

					console.log("[cf] pc skipped to: " + s.pc);
				}
				break;

			// ANNN: sets I to the address NNN
			case 0xa000:
				// Execute opcode
				logOpCode(opcode, "[mem]I=NNN");
				s.I = opcode & 0x0FFF;
				console.log("[mem]New I: " + s.I);
				break;

			// BNNN: jumps to NNN + V0
			case 0xb000:
				logOpCode(opcode, "[cf]pc=NNN + v0");

				s.pc =  s.V[0x0] + NNN;
				s.shouldRaisePC = false;

				console.log("[cf]new pc: " + s.pc);
				break;

			// CXNN: VX = rand & NN
			case 0xc000:
				logOpCode(opcode, "[rnd]VX = rand & NN");

				var rnd = Math.floor(Math.random() * 256) & NN;
				s.V[X] = rnd;

				console.log("V[" + X +"] = " +rnd);
				break;

			// DXYN draws sprite
			case 0xd000:
				logOpCode(opcode, "[gfx]!!!Fucking draw!!!");
				var xStart = s.V[X];
				var yStart = s.V[Y];
				console.log("[gfx]I: "+ s.I +" x: " + xStart + " y: " + yStart + " h: " + N);
				var pixel;

				s.V[0xF] = 0;
				for(var yline = 0; yline < N; yline++){
					pixel = s.memory[s.I + yline];

					for(var xline = 0; xline < 8; xline++){
						if((pixel & (128 >> xline)) !== 0) {
							var gfxOffset = xStart + xline +((yStart + yline) * 64);
                            s.gfx[gfxOffset] ^= 1;
							if(s.gfx[gfxOffset] === 0) s.V[0xf] = 1;
						}
					}
				}

				s.dFlags.d = true;
				s.dFlags.x = xStart;
				s.dFlags.y = yStart;
				s.dFlags.w = 8;
				s.dFlags.h = N;

				break;

			// keyboard things
			case 0xe000:
				switch(opcode & 0x00ff){
					// EX9E: Skips the next instruction
    				// if the key stored in VX is pressed
					case 0x009e:
						logOpCode(opcode, "[kb]skip if vx pressed");
						keycode = s.V[X];
						keystate = s.key[keycode];

						console.log("[kb]we are at pc: " + s.pc);
						console.log("[kb]key["+ keycode +"] : " + keystate);
						console.log("[kb]we should skip to:" + (s.pc+4));

						if(keystate!==0){
							s.pc += 4;
							s.shouldRaisePC = false;

							console.log("[kb]so we skiped to pc: " + s.pc);
						}
						break;

					// EXA1: Skips the next instruction
    				// if the key stored in VX is not pressed
					case 0x00a1:
						logOpCode(opcode, "[kb]skip if vx not pressed");
						keycode = s.V[X];
						keystate = s.key[keycode];

						console.log("[kb]key["+ keycode +"] : " + keystate);

						if(keystate===0){
							s.pc += 4;
							s.shouldRaisePC = false;

							console.log("[kb]so we skiped to pc: " + s.pc);
						}
						break;

					default:
						logUnknowOp(opcode, s.pc);
						break;
				}
				break;

			// multiple things
			case 0xf000:
				switch(opcode & 0x00ff){
					// FX07: VX = delay timer
					case 0x0007:
						logOpCode(opcode, "[tm]VX = delay");

						s.V[X] = s.delay_timer;

						console.log("[tm]V["+X+"] = " +s.delay_timer);
						break;

					// FX0A: wait for key press (blocking)
					case 0x000a:
						logOpCode(opcode, "[kb]wait for keypress");

						s.shouldRaisePC = false;
						for(i = 0; i < s.key.length; i++){
							if(s.key[i] === 1){
								s.shouldRaisePC = true;
								s.V[X] = i;

								console.log("[kb]found at: " + s.key[i]);
								break;
							}
						}
						break;

					// FX15: delay = VX
					case 0x0015:
						logOpCode(opcode, "[tm]delay = VX");

						VX = s.V[X];
						s.delay_timer = VX;

						console.log("[tm]delay = " + VX);
						break;

					// FX18: sound = VX
					case 0x0018:
						logOpCode(opcode, "[tm]sound = VX");

						VX = s.V[X];
						s.sound_timer = VX;

						console.log("[tm]sound = " + VX);
						break;

					// FX1E: I += VX
					case 0x001e:
						logOpCode(opcode, "[mem]I += VX");

						VX = s.V[X];
						s.I += VX;
						s.V[0xf] = 0;
						if(s.I > 0xfff)
							s.V[0xf] = 1;

						console.log("[mem]now I = " + s.I);
						break;

					// FX29: I = to font char of VX 0-f
					case 0x0029:
						logOpCode(opcode, "[mem]I = font char");

						VX = s.V[X];
						s.I = VX * 5;

						console.log("[mem]now I = " + s.I);
						break;

					// FX33: too long to be described there check the chip8
					// instruction set.
					case 0x0033:
						VX = s.V[X];
						logOpCode(opcode);
						s.memory[s.I] = Math.floor(VX / 100);
						s.memory[s.I+1] = Math.floor(VX / 10) % 10;
						s.memory[s.I+2] = (VX % 100) % 10;
						break;

					// FX55: starting at I = from V0 to VX
					case 0x0055:
						logOpCode(opcode, "[mem]starting at I = V0 to VX");

						for(i = 0; i<=X; i++){
							s.memory[s.I + i] = s.V[i];
						}
						break;

					// FX65: starting at V0 = from memory I to memory I + X
					case 0x0065:
						logOpCode(opcode, "[mem]V0 to VX = starting at I");

						for(i = 0; i<=X; i++){
							s.V[i] = s.memory[s.I + i];
						}
						break;

					default:
						logUnknowOp(opcode, s.pc);
						break;
				}
				break;

			default:
				logUnknowOp(opcode, s.pc);
				break;
		}

		console.log("old pc:" + s.pc);
		if(s.shouldRaisePC)
			s.pc += 2;
		s.shouldRaisePC = true;
		console.log("new pc:" + s.pc);
	};


	/**
	*
	*
	*/
	chip8.loadRom = function(element, callback) {
		s = self;
		if(!s.initialized) {
			alert("first initialize the instace of chip8");
			return;
		}
		var file = element.files;

        if(file.length < 1){
            alert("Plese load a rom file first.");
            return;
        }

		console.log("Rom name: " + file[0].name);
		var view;
		if(file.length < 1) {
			alert("Please select a rom file");
			return;
		}

		var reader = new FileReader();
		reader.onload = function(e){
			view = new DataView(e.target.result);
			s.romSize = view.byteLength;
			for(var i = 0; i < view.byteLength; i++){
				s.memory[0x200 + i] = view.getUint8(i);
			}
			console.log("finished rom load to memory, loaded: "+ view.byteLength + " bytes");
			callback();
		};
		reader.readAsArrayBuffer(file[0]);
	};

	var logOpCode = function(opcode, extra ){
		extra = (typeof extra !== 'undefined') ? extra : "";
		console.log("pc: " + self.pc + " know opcode: " + opcode.toString(16).toUpperCase() + extra);
	};

	var logUnknowOp = function(opcode, pc){
		console.log("Unknown opcode: " + opcode.toString(16).toUpperCase() + " at pc: "+ pc);
	};

	logOpCode = function() {};

	logUnknowOp = function(){};

	return chip8;

};