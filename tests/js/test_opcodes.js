describe("opcodes", function () {
    var c8;

    beforeEach(function () {
       c8 = chip8();
       c8.initialize();
    });

    it("0x00e0 should clear gfx to all zeros", function () {
        c8 = chip8();
        c8.initialize();
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
});