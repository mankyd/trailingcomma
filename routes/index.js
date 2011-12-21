
/*
 * GET home page.
 */

var redis = require("redis");
var rclient = redis.createClient(null,  null, {no_ready_check: true});

rclient.on("error", function (err) {
    console.log("Redis Error " + err);
});

//rclient.auth('devel');

var find = require('../lib/finder').find;
var markov = require('../lib/markov');

exports.index = function(req, res){
    res.render('index.jade', { title: 'Trailing Comma,' })
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
    var api_key = markov.generate(markov.BASE_ANALYSIS, 16, 16); 
    rclient.sadd('api_keys', api_key);
    res.render('donated.jade', {
        title: 'Thanks for the donation!',
        api_key: api_key
    })
};