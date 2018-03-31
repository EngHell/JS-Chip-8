var debugger8 = (function(){
    var debugger8 = {
        domContainers: [],
        c8 : {}
    };

    var self = debugger8;

    debugger8.initialize = function(chip8, registerSelectorPattern) {
        self.c8 = chip8;

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

    return debugger8;
})();