$(function() {
    $('form.find-commas').submit(function(evt) {
        evt.preventDefault();
        _gaq.push(['_trackEvent', 'comma_finding', 'find_commas', 'home_page', 1]);
        var form = $(evt.target);

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
            //es5       : true,
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

        var result = JSLINT(form.find('textarea').val(), options);
        var commas = [];
        var parse_error = false;

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
                else if (error === null) {
                    parse_error = true;
                }
            }
        }
        found_commas(commas, parse_error);
    });
});

var found_commas = function(commas, parse_error) {
    var i;
    var comma_list = $('.commas dl');
    var alert_found = $('#alert_found');
    var alert_not_found = $('#alert_not_found');
    var alert_parse_error = $('#alert_parse_error');

    if (commas.length) {
        _gaq.push(['_trackEvent', 'comma_finding', 'commas_found', 'home_page', commas.length]);

        comma_list.empty();
        for (i = 0; i < commas.length; i++) {
            add_comma(comma_list, commas[i]);
        }
        $('.commas').fadeIn();
        if (!alert_found.is(':visible')) {
            alert_found.fadeIn();
        }
        alert_not_found.hide();
    }
    else {
        _gaq.push(['_trackEvent', 'comma_finding', 'code_ok', 'home_page', 1]);

        $('.commas').slideUp();
        if (!parse_error && !alert_not_found.is(':visible')) {
            alert_not_found.fadeIn();
        }
        alert_found.hide();
    }
    if (parse_error) {
        _gaq.push(['_trackEvent', 'comma_finding', 'parser_error', 'home_page', 1]);
        alert_parse_error.fadeIn();
    }
    else {
        alert_parse_error.hide();
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
