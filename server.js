// server.js

// New Relic application monitoring
require('newrelic');

// modules
var express        = require('express');
var app            = express();
var server         = require('http').Server(app);
var io             = require('socket.io')(server);

var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// config
var db = require('./config/db');
mongoose.connect(db.url);

var port = process.env.PORT || 8080;

app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./app/routes')(app);
require('./app/socketRoutes')(io);

// start app ===============================================
// startup our app at http://localhost:8080
server.listen(port);

// expose app
exports = module.exports = app;
