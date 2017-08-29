describe("opcodes", function () {
    var c8, X, Y, N, NN, NNN;

    beforeEach(function () {
       c8 = chip8();
       c8.initialize();
    });

    it("0x00e0: should clear gfx to all zeros", function () {
        c8.gfx.forEach(function (t, number, ts) {
            ts[number] = 1;
        });

        c8.memory[512] = 0x00;
        c8.memory[513] = 0xe0;
        c8.emulateCycle();

        // we can do this since this array is 0 filled.
        var testGFX = new Uint8Array(c8.gfx.length);

        expect(c8.gfx).toEqual(testGFX);

    });

    it("0x00ee: returns from subroutine sp, will decrement to 0 and pc will go to 522", function () {
        // since we have to go one instruction forward to avoid an infinite loop
        // its 520 + 2 where we will end
        c8.stack[0] = 520;
        c8.sp = 1;
        c8.memory[512] = 0x00;
        c8.memory[513] = 0xee;

        c8.emulateCycle();

        expect(c8.sp).toEqual(0);
        expect(c8.pc).toEqual(522);
    });

    it("1NNN: jumps to adress NNN, pc should end at 520", function () {
        c8.memory[512] = 0x12;
        c8.memory[513] = 0x08;

        c8.emulateCycle();

        expect(c8.pc).toEqual(520);
    });

    it("0x2NNN: call subroutine at address NNN, sp will increment to 1, stack[0] will be set to 520 and pc will move to 520", function () {
        c8.memory[512] = 0x22;
        c8.memory[513] = 0x08;

        c8.emulateCycle();

        expect(c8.sp).toEqual(1);
        expect(c8.stack[0]).toEqual(512);
        expect(c8.pc).toEqual(520);
    });

    //0x3XNN: skips next instruction if VX==NN
    it("0x3XNN: X is 1, VX will be 10 and NN 10, so it will skip, and pc will be 514+2", function () {
        c8.memory[512] = 0x31;
        c8.memory[513] = 0x0a; //0x0a : 10
        c8.V[1] = 10;

        c8.emulateCycle();

        expect(c8.pc).toEqual(516);
    });

    //0x3XNN: skips next instruction if VX==NN
    it("0x3XNN: X is 2, VX will be 20 and NN 10, so it won't skip, and pc will be 514", function () {
        c8.memory[512] = 0x32;
        c8.memory[513] = 0x0a; //0x0a : 10
        c8.V[2] = 20;

        c8.emulateCycle();

        expect(c8.pc).toEqual(514);
    });

    // 0x4XNN: skips next instruction if VX!=NN
    it("0x4XNN: X is 5, VX is 20, NN 10, it will skip, so pc will be 514+2", function () {
        c8.memory[512] = 0x45;
        c8.memory[513] = 0x0a;
        c8.V[5] = 20;

        c8.emulateCycle();

        expect(c8.pc).toEqual(516);
    });

    // 0x4XNN: skips next instruction if VX!=NN
    it("0x4XNN: X is 5, VX is 10, NN 10, it won't skip, so pc will be 514", function () {
        c8.memory[512] = 0x45;
        c8.memory[513] = 0x0a;
        c8.V[5] = 10;

        c8.emulateCycle();

        expect(c8.pc).toEqual(514);
    });

});