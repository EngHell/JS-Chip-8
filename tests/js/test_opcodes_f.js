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
       });
   });

});
