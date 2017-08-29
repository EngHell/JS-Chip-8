describe("opcodes 0x8XXX", function () {
    var c8, X, Y, N, NN, NNN;

    beforeEach(function () {
        c8 = chip8();
        c8.initialize();
    });

    // 0x8XY0: assing vx to the value of vy
    it("0x8XY0: X = 2, Y = 15, VY = 20, so VX = 20", function () {
       c8.memory[512] = 0x82;
       c8.memory[513] = 0xf0;
       c8.V[15] = 20;

       c8.emulateCycle();

       expect(c8.V[2]).toEqual(20);
    });
});