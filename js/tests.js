(function () {
    var root = this;
    var tests = {
        c8 : 0
    };

    tests.opcode_0x00e0 = function () {
        c8 = chip8();
        c8.initialize();
        c8.memory.forEach(function (t, number, ts) {
            ts[number] = 1;
        });
        c8.memory[512] = 0x00;
        c8.memory[513] = 0xe0;
        c8.emulateCycle();

        c8.gfx.forEach(function (t) {
            if(t!==0){
                throw new EvalError("opcode 0x00e0");
            }
            console.log("Assert passed")
        })
    };

    test.opcode_0x00e0();

    root.tests = tests;
})();