
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var middleware = require('./middleware');
var settings = require('./settings');
var redis_store = require('connect-redis')(express);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(middleware.rawBodyParser());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: settings.session_secret, store: new redis_store}));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/static'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.enable('paypal_testing');
    app.disable('tracking');
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
    app.disable('paypal_testing');
    app.enable('tracking');
});

app.dynamicHelpers({
    tracking_enabled: function(req, res){
        return app.enabled('tracking');
    },
    paypal_testing: function(req, res){
        return app.enabled('paypal_testing');
    }
});

// Routes

app.get('/', routes.index);
app.post('/check', routes.check);
app.get('/donated', routes.donated);
app.post('/donated', routes.donated);


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

