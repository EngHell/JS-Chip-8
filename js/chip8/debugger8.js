var debugger8 = (function(){
    var debugger8 = {
        domContainers: [],
        PC : {},
        I : {},
        c8 : {},
        delay : {},
        sound : {},
        address : {}
    };

    var self = debugger8;

    debugger8.initialize = function(chip8, registerSelectorPattern, pcSelector, iSelector, delaySelector, soundSelector, addressSelector) {
        self.c8 = chip8;

        self.PC = document.getElementById(pcSelector);
        self.address = document.getElementById(addressSelector);
        self.I = document.getElementById(iSelector);
        self.delay = document.getElementById(delaySelector);
        self.sound = document.getElementById(soundSelector);

        for(var i = 0; i < 0xf; i++){
            var el = document.getElementById(registerSelectorPattern.replace("#",i.toString(16)));
            self.domContainers.push(el);
        }
    };

    debugger8.updateRegisters = function() {
        for(var i = 0; i < 0xf; i++){
            self.domContainers[i].innerHTML = c8.V[i];
        }
    };

    debugger8.updatePC = function() {
        self.PC.innerHTML = c8.pc;
    };

    debugger8.updateI = function() {
        self.I.innerHTML = c8.I;
    };

    debugger8.updateDelay = function() {
        self.delay.innerHTML = c8.delay_timer;
    };

    debugger8.updateSound = function() {
        self.sound.innerHTML = c8.sound_timer;
    };

    debugger8.updateOpCode = function () {
        self.address.innerHTML = ((c8.memory[c8.pc] << 8) | c8.memory[c8.pc +1]).toString(16);
    };

    return debugger8;
})();