/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var middleware = require('./middleware');
var settings = require('./settings');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(middleware.rawBodyParser());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: settings.session_secret}));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/static'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.disable('compressed_static');
    app.disable('tracking');
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
    app.enable('compressed_static');
    app.enable('tracking');
});

app.dynamicHelpers({
    compressed_static: function() {
        return app.enabled('compressed_static');
    },
    static_url: function(req, res) {
        return function(url) {
            if (app.disabled('compressed_static')) {
                return url;
            }
            return settings.static_url + url;
        };
    },
    tracking_enabled: function(req, res){
        return app.enabled('tracking');
    }
});

// Routes

app.get('/', routes.index);
app.post('/check', routes.check);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", 
            app.address().port, app.settings.env);
