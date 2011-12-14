$(function() {
    $('form.find-commas').submit(function(evt) {
        evt.preventDefault();
        var form = $(evt.target);
        var result = JSLINT(form.find('textarea').val());
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
        found_commas(commas);
    });
});

var found_commas = function(commas) {
    console.dir(commas);
    console.dir(JSLINT.errors);
    var i;
    var comma_list = $('.commas dl');
    comma_list.empty();
    for (i = 0; i < commas.length; i++) {
        add_comma(comma_list, commas[i]);
    }
};

var add_comma = function(list, comma) {
    var loc = comma.code;
    loc = loc.substr(Math.max(0, comma.character - 10), 21);
    var dt = $('<dt><span class="line">'+comma.line+'</span><span class="char">'+comma.character+'</span></dt>');
    var dd = $('<dd>'+loc+'</ld>');
    list.append(dt);
    list.append(dd);
};