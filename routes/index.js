/*
 * GET home page.
 */

var find = require('../lib/finder').find;
var markov = require('../lib/markov');

exports.index = function(req, res){
    if (!req.session.session_id) {
        req.session.session_id = markov.generate(markov.BASE_ANALYSIS, 16, 16);
    }
    res.render('index.jade', {
        title: 'Trailing Comma,',
        session_id: req.session.session_id
    });
};

exports.check = function(req, res) {
    if (!req.raw_body) {
        res.statusCode = 400;
        res.json('No code error')
    }
    else {
      res.json(find(req.raw_body));
    }
};