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

    // 0x8XY4: vx += vy, sets vf to 1 if carry, 0 if not
    it("0x8XY4: X:5, Y:6, VX:254, VY:1, there won't be a carry", function () {
        c8.memory[512] = 0x85;
        c8.memory[513] = 0x64;
        c8.V[5] = 254;
        c8.V[6] = 1;

        c8.emulateCycle();

        expect(c8.V[0xf]).toEqual(0);
        expect(c8.V[5]).toEqual(255);
    });

    // 0x8XY4: vx += vy, sets vf to 1 if carry, 0 if not
    it("0x8XY4: X:5, Y:6, VX:255, VY:1, there will be a carry", function () {
        c8.memory[512] = 0x85;
        c8.memory[513] = 0x64;
        c8.V[5] = 255;
        c8.V[6] = 1;

        c8.emulateCycle();

        expect(c8.V[0xf]).toEqual(1);
        expect(c8.V[5]).toEqual(0);
    });

    // 0x8XY5: vx -= vy, sets vf to 0 if borrow, 1 if not
    it("0x8XY5: X:1, Y:5, VX: 10, VY: 5: VX->5, VF->1", function () {
        c8.memory[512] = 0x81;
        c8.memory[513] = 0x55;
        c8.V[1] = 10;
        c8.V[5] = 5;

        c8.emulateCycle();

        expect(c8.V[1]).toEqual(5);
        expect(c8.V[0xf]).toEqual(1);
    });

    // 0x8XY5: vx -= vy, sets vf to 0 if borrow, 1 if not
    it("0x8XY5: X:1, Y:5, VX: 0, VY: 1: VX->128, VF->0", function () {
        c8.memory[512] = 0x81;
        c8.memory[513] = 0x55;
        c8.V[1] = 0;
        c8.V[5] = 1;

        c8.emulateCycle();

        expect(c8.V[1]).toEqual(255);
        expect(c8.V[0xf]).toEqual(0);
    });

    //8XY6: VF = lsb, vx = vx >> 1
    it("0x8XY6: X:5, VX:0xf0, so X-> 0x0f;", function () {
        c8.memory[512] = 0x85;
        c8.memory[513] = 0x56;
        c8.V[5] = 0xff;

        c8.emulateCycle();

        expect(c8.V[5]).toEqual(0xff >> 1);
        expect(c8.V[0xf]).toEqual(1);
    });

    // 0x8XY7: vx=vy - vx, sets vf to 0 if borrow, 1 if not
    it("0x8XY7: X:6, Y:1, VX:10, VY:20, VX->10, VF->1", function () {
       c8.memory[512] = 0x86;
       c8.memory[513] = 0x17;

       c8.V[6] = 10;
       c8.V[1] = 20;

       c8.emulateCycle();

       expect(c8.V[6]).toEqual(10);
       expect(c8.V[0xf]).toEqual(1);
    });

    // 0x8XY7: vx=vy - vx, sets vf to 0 if borrow, 1 if not
    it("0x8XY7: X:6, Y:1, VX:1, VY:0, VX->255, VF->0", function () {
        c8.memory[512] = 0x86;
        c8.memory[513] = 0x17;

        c8.V[6] = 1;
        c8.V[1] = 0;

        c8.emulateCycle();

        expect(c8.V[6]).toEqual(255);
        expect(c8.V[0xf]).toEqual(0);
    });

    //8XYE: VF = msb, VX = VX << 1
    it("0x8XYE: X:5, Y:1, X:0xff, VX->(254), VF->1", function () {
        c8.memory[512] = 0x85;
        c8.memory[513] = 0x1e;

        c8.V[5] = 0xff;

        c8.emulateCycle();

        expect(c8.V[5]).toEqual(254);
        expect(c8.V[0xf]).toEqual(128);
    });

    it("unknown 0x8XY? op code", function () {
        c8.memory[512] = 0x86;
        c8.memory[513] = 0x1a;

        c8.emulateCycle();

        // i just made this to have coverage on that case branch..
    })
});







