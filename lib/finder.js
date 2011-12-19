if (typeof(exports) != 'undefined') {
    var JSLINT = require('./jslint').JSLINT;
}
else {
    var exports = {};
}

var find = function(code) {
    var result = JSLINT(code);
    var commas = [];
    if (!result) {
        var i;
        var error;
        for (i = 0; i < JSLINT.errors.length; i++) {
            error = JSLINT.errors[i];
            if (error && error.reason == "Unexpected ','.") {
                commas[commas.length] = {
                    line: error.line,
                    character: error.character,
                    code: error.evidence
                };
            }
        }
    }
    return commas;
};

exports.find = find;