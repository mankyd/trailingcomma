if (typeof(exports) != 'undefined') {
    var JSLINT = require('./jslint').JSLINT;
}
else {
    var exports = {};
}

var find = function(code) {
    var options = {
        bitwise   : true,
        browser   : true,
        cap       : true,
        confusion : true,
        'continue': true,
        css       : true,
        debug     : true,
        devel     : true,
        eqeq      : true,
        es5       : true,
        evil      : true,
        forin     : true,
        fragment  : true,
        indent    :   10,
        maxerr    : 1000,
        maxlen    :  25600000,
        newcap    : true,
        node      : true,
        nomen     : true,
        on        : true,
        //passfail  : true,
        plusplus  : true,
        properties: true,
        regexp    : true,
        rhino     : true,
        undef     : true,
        unparam   : true,
        sloppy    : true,
        sub       : true,
        vars      : true,
        white     : true,
        widget    : true,
        windows   : true
    };

    var result = JSLINT(code, options);
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