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
    var i;
    var comma_list = $('.commas dl');
    var alert_found = $('#alert_found');
    var alert_notfound = $('#alert_notfound');

    if (commas.length) {    
        comma_list.empty();
        for (i = 0; i < commas.length; i++) {
            add_comma(comma_list, commas[i]);
        }
        $('.commas').fadeIn();
        if (!alert_found.is(':visible')) {
            alert_found.fadeIn();
        }
        alert_notfound.hide();
    }
    else {
        $('.commas').slideUp();
        if (!alert_notfound.is(':visible')) {
            alert_notfound.fadeIn();
        }
        alert_found.hide();
    }

};

var add_comma = function(list, comma) {
    var padding_chars = 20;
    var loc = comma.code;
    var append_hellip = loc.length > comma.character+padding_chars;
    loc = loc.substr(Math.max(0, comma.character - padding_chars - 1), padding_chars + 1);
    if (comma.character > padding_chars + 1) {
        loc = '&hellip;' + loc;
    }
    if (append_hellip) {
        loc += '&hellip;';
    }
    var dt = $('<dt><span class="line">'+comma.line+'</span><span class="char">'+comma.character+'</span></dt>');
    var dd = $('<dd>'+loc+'</ld>');
    list.append(dt);
    list.append(dd);
};