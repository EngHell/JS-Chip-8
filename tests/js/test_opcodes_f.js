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


});
