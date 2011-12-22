
/*
 * GET home page.
 */

var ipn = require('paypal-ipn');
var redis = require("redis");
var rclient = redis.createClient(null,  null, {no_ready_check: true});

rclient.on("error", function (err) {
    console.log("Redis Error " + err);
});

exports.rclient = rclient;

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
    if (!req.param('key')) {
        res.statusCode = 403;
        res.json('No API key specified');
    }
    else if (!req.raw_body) {
        res.statusCode = 400;
        res.json('No code error')
    }
    else {
        rclient.sismember('api_keys', req.param('key'), function (err, reply) {
            if (!reply) {
                res.statusCode = 403;
                res.json('Invalid API key');
            }
            else {
                res.json(find(req.raw_body));
            }
        });
    }
};

exports.donated = function(req, res) {
    var verify = function(num_tries) {
        if (num_tries <= 0) {
            res.redirect('home');
        }
        if (!req.app.enabled('paypal_testing') && req.body.test_ipn === '1') {
            res.redirect('home');
        }
        ipn.verify(req.body, function(err, msg) {
            if (err && num_tries > 0) {
                verify(num_tries-1);
            }
            else {
                if (!req.session.api_key) {
                    req.session.api_key = markov.generate(markov.BASE_ANALYSIS, 16, 16);
                    rclient.sadd('api_keys', req.session.api_key);
                    res.redirect('/donated');
                }
            }
        });
    };

    if (req.method == 'POST') {
        if (req.body.custom == req.session.session_id) {
            verify(1);
        }
        else {
            res.redirect('home');
        }
    }
    else if (!req.session.api_key) {
        res.redirect('home');
    }
    else {
        res.render('donated.jade', {
            title: 'Thanks for the donation!',
            api_key: req.session.api_key
        });
    }
};