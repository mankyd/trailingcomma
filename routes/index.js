
/*
 * GET home page.
 */

var redis = require("redis");
var rclient = redis.createClient(null,  null, {no_ready_check: true});
//rclient.auth('devel');

var find = require('../lib/finder').find;
var markov = require('../lib/markov');

exports.index = function(req, res){
    res.render('index.jade', { title: 'Trailing Comma,' })
};

exports.check = function(req, res) {
    if (!req.param('key')) {
        res.json(['no key error']);
    }
    if (!req.param('code') && !req.raw_body) {
        res.json(['no code error'])
    }
    else {
        rclient.sismember('api_keys', req.param('key'), function (err, reply) {
            if (!reply) {
                res.json(['invalid key error']);
            }
            else {
                res.json(find(req.param('code', req.raw_body)));
            }
        });
    }
};

exports.donated = function(req, res) {
    var api_key = markov.generate(markov.BASE_ANALYSIS, 16, 16); 
    rclient.sadd('api_keys', api_key);
    res.render('donated.jade', {
        title: 'Thanks for the donation!',
        api_key: api_key
    })
};