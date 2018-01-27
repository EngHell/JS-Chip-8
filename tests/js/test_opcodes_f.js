describe("OPCodes FWWW",function(){
    var c8;
    beforeEach(function(){
        c8 = chip8();
        c8.initialize();
    });

   describe("FX07: SETS VX to delay timer", function(){

       it("Delay timer = 10 then V7 = 10",function(){
           c8.memory[512] = 0xf7;
           c8.memory[513] = 0x07;
           c8.delay_timer = 10;

           c8.emulateCycle();

           expect(c8.V[7]).toEqual(10);
       })
   }) ;

   describe("FX0A: Pauses operation til key press and VX = key", function(){

       it("Key(5) is pressed then pc = 514 and V7 = 5", function(){
          c8.memory[512] = 0xf7;
          c8.memory[513] = 0x0a;
          c8.key[5] = 1;

          c8.emulateCycle();

          expect(c8.V[7]).toEqual(5);
          expect(c8.pc).toEqual(514)
       });

       it("No key is pressed then pc = 512", function () {
           c8.memory[512] = 0xf7;
           c8.memory[513] = 0x0a;

           c8.emulateCycle();

           expect(c8.V[7]).toEqual(0);
           expect(c8.pc).toEqual(512);
       });
   });

   describe("FX15: Sets delay_timer to VX", function(){

       it("Va=10 then delay timer = 10", function(){
          c8.memory[512] = 0xfa;
          c8.memory[513] = 0x15;
          c8.V[0xa] = 10;

          c8.emulateCycle();

          expect(c8.delay_timer).toEqual(10);
          expect(c8.pc).toEqual(514);

          c8.emulateCycle();

          expect(c8.delay_timer).toEqual(9);
          expect(c8.pc).toEqual(516);
       });
   });

    describe("FX18: Sets sound_timer to VX", function(){

        it("V3=8 then sound_timer = 8", function(){
            c8.memory[512] = 0xf3;
            c8.memory[513] = 0x18;
            c8.V[3] = 8;

            c8.emulateCycle();

            expect(c8.sound_timer).toEqual(8);
            expect(c8.pc).toEqual(514);

            c8.emulateCycle();

            expect(c8.sound_timer).toEqual(7);
            expect(c8.pc).toEqual(516);
        });
    });

    describe("FX1E: Sets I to VX",function(){

        it("V2=4 then I = 4", function(){

            c8.memory[512] = 0xf2;
            c8.memory[513] = 0x1e;
            c8.V[2] = 4;

            c8.emulateCycle();

            expect(c8.I).toEqual(4);
            expect(c8.pc).toEqual(514);
        });
    });

});
