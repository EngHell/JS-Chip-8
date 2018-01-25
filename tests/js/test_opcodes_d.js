describe("opcode D", function() {
    var c8;

    beforeEach(function () {
        c8 = chip8();
        c8.initialize();
    });


   it("DXYN: X:1,Y:0,N:3,V1:0,V0:0; then the gfx will be filled with the sprite at coords (0,0), check comments to see the sprite",function(){
       // those will start at pc 550
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

       for(var y = yStart; y < 3; y++){
           for(var x = xStart; x < 8; x++){
               gfxOffset = xStart + x + ((yStart + y) * 64);
               expect(c8.gfx[gfxOffset]).toEqual( (c8.memory[c8.I + y] & (128 >> x)) !== 0 ? 1 : 0 )
           }
       }
   });
});