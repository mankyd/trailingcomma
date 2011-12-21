
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var middleware = require('./middleware');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(middleware.rawBodyParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/static'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.post('/check', routes.check);
app.get('/donated', routes.donated);
app.post('/donated', routes.donated);


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

