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

    // 0x8XY1: sets VX to (VX or VY)
    it("0x8XY1: X = 1, Y = 0, VX = 00010001, VY = 00000010, so VX = 00010011", function () {
        c8.memory[512] = 0x81;
        c8.memory[513] = 0x01;
        c8.V[1] = parseInt("00010001", 2);
        c8.V[0] = parseInt("00000010", 2);

        c8.emulateCycle();

        expect(c8.V[1]).toEqual(parseInt("00010011",2));
    });

    // 0x8XY2: VX = (VX and VY)
    it("0x8XY2: X = 1, Y = 0, VX = 10010001, VY = 10000010, so VX = 10010011", function () {
        c8.memory[512] = 0x81;
        c8.memory[513] = 0x02;
        c8.V[1] = parseInt("10010001", 2);
        c8.V[0] = parseInt("10000010", 2);

        c8.emulateCycle();

        expect(c8.V[1]).toEqual(parseInt("10000000",2));
    });

    // 0x8XY3: VX = (VX xor VY)
    it("0x8XY2: X = 1, Y = 0, VX = 10010001, VY = 10000010, so VX = 10010011", function () {
        c8.memory[512] = 0x81;
        c8.memory[513] = 0x03;
        c8.V[1] = parseInt("10010001", 2);
        c8.V[0] = parseInt("10000010", 2);

        c8.emulateCycle();

        expect(c8.V[1]).toEqual(parseInt("00010011",2));
    });
});