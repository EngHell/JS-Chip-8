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

    describe("FX1E: Sets I to I + VX",function(){

        it("V2=4 then I = 4", function(){

            c8.memory[512] = 0xf2;
            c8.memory[513] = 0x1e;
            c8.V[2] = 4;
            c8.I = 10;

            c8.emulateCycle();

            expect(c8.I).toEqual( 10 + 4);
            expect(c8.pc).toEqual(514);
        });
    });

    describe("FX29: sets I to the position of the font char specified at Vx", function(){
       for(var i = 0; i <= 0xf; i++){
           it("V4 = F, then I = 0xf * 5", function(){
               c8.memory[512] = 0xf4;
               c8.memory[513] = 0x29;
               c8.V[4] = 0xf;

               c8.emulateCycle();

               expect(c8.I).toEqual( 0xf * 5);
               expect(c8.pc).toEqual(514);
           })
       }
    });

    describe("FX33: decimal representation at I and I+1 then I+2 of Vx", function(){
        it("I = 200, V4=230, so I = 2, I+1 = 3, I+2 = 0", function(){
            c8.memory[512] = 0xf4;
            c8.memory[513] = 0x33;

            c8.V[4] = 230;
            c8.I = 520;

            c8.emulateCycle();

            expect(c8.I).toEqual(520);
            expect(c8.memory[c8.I]).toEqual(2);
            expect(c8.memory[c8.I+1]).toEqual(3);
            expect(c8.memory[c8.I+2]).toEqual(0);
        })
    });

    describe("FX55, sets starting at memory[I] all values from V0 to Vx", function() {
        it("I = 520, X = 5, V0 to V5 => 0 - 5, so memory[I] - memory[I+5] -> 0 - 5", function(){
            c8.memory[512] = 0xf5;
            c8.memory[513] = 0x55;

            for(var i = 0; i <= 5; i++){
                c8.V[i] = i;
            }

            c8.I = 520;

            c8.emulateCycle();

            // I should not change.
            expect(c8.I).toEqual(520);

            for(i = 0; i <= 5; i++){
                expect(c8.memory[c8.I + i]).toEqual(c8.V[i]);
            }
        })
    });

    describe("FX65: copys memory[I] - memory[I+X] to V0 - VX", function() {
        it("F565: memory from 0 to 5, v0 to v5", function(){
            c8.memory[512] = 0xf5;
            c8.memory[513] = 0x65;

            c8.I = 520;

            for(var i = 0; i <= 5; i++){
                c8.memory[c8.I + i] = i;
            }



            c8.emulateCycle();

            expect(c8.I).toEqual(520);

            for(i = 0; i <= 5; i++){
                expect(c8.V[i]).toEqual(c8.memory[c8.I + i]);
            }
        })
    })

});
