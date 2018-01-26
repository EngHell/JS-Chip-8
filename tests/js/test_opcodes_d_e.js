describe("opcode D", function() {
    var c8;

    beforeEach(function () {
        c8 = chip8();
        c8.initialize();
    });


   it("DXYN: X:1,Y:0,N:3,V1:0,V0:0; then the gfx will be filled with the sprite at coords (0,0), check comments to see the sprite",function(){
       // those will start at pc 520
       // 00111100
       // 01100110
       // 00111100

       c8.memory[512] = 0xd1;
       c8.memory[513] = 0x03;

       c8.I = 520;
       c8.memory[520] = parseInt("00111100",2);
       c8.memory[521] = parseInt("01100110",2);
       c8.memory[522] = parseInt("00111100",2);

       c8.V[1] = 0;
       c8.V[0] = 0;

       c8.emulateCycle();

       var gfxOffset = 0;
       var xStart = 0;
       var yStart = 0;

       expect(c8.I).toEqual(520);

       expect(c8.V[0xf]).toEqual(0);

       for(var y = yStart; y < 3; y++){
           for(var x = xStart; x < 8; x++){
               gfxOffset = xStart + x + ((yStart + y) * 64);
               expect(c8.gfx[gfxOffset]).toEqual( (c8.memory[c8.I + y] & (128 >> x)) !== 0 ? 1 : 0 )
           }
       }

       c8.pc = 512;
       c8.memory[513] = 0x01;
       c8.memory[520] = parseInt("00111100",2);
       // those will start at pc 520
       // and now it will be
       // 00111100
       //
       // then
       // 00000000
       // 01100110
       // 00111100

       c8.emulateCycle();

       expect(c8.I).toEqual(520);

       expect(c8.V[0xf]).toEqual(1);

       c8.memory[520] = parseInt("00000000", 2);

       for(var y = yStart; y < 1; y++){
           for(var x = xStart; x < 8; x++){
               gfxOffset = xStart + x + ((yStart + y) * 64);
               expect(c8.gfx[gfxOffset]).toEqual( (c8.memory[c8.I + y] & (128 >> x)) !== 0 ? 1 : 0 )
           }
       }
   });
});

describe("opcodes EWWW", function(){
    var c8;

    beforeEach(function () {
        c8 = chip8();
        c8.initialize();
    });

   it("EX9E: V2:1, KEY PRESED: so skips pc to 516", function(){
      c8.memory[512] = 0xe2;
      c8.memory[513] = 0x9e;
      c8.V[2] = 1;
      c8.key[1] = 1;

      c8.emulateCycle();

      expect(c8.pc[516]);
   });

    it("EX9E: V2:1, KEY IS NOT PRESSED: so pc goes 514", function(){
        c8.memory[512] = 0xe2;
        c8.memory[513] = 0x9e;
        c8.V[2] = 1;
        c8.key[1] = 0;

        c8.emulateCycle();

        expect(c8.pc[514]);
    });

});
