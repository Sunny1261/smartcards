
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var deck = require('./routes/deck');
var card = require('./routes/card');
var http = require('http');
var path = require('path');

var app = express();

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/smartcards", {native_parser:true});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Basic Gets
app.get('/', user.loggedInCheck(db));
app.get('/logout', user.logout(db));
app.get('/home', routes.index(db));
app.get('/users', user.list);
app.get('/viewdeck/:id', deck.deckview(db));
app.get('/rundeck/:id', deck.rundeck(db));

// Delete
app.get('/deletedeck/:id', deck.deletedeck(db));
app.get('/deletecard/:deckname/:id', card.deletecard(db));

// Post Forms
app.post('/adddeck', deck.adddeck(db));
app.post('/addcard', card.addcard(db));
app.post('/editcard', card.editcard(db));
app.post('/answercard', card.answercard(db));
app.post('/adduser', user.adduser(db));
app.post('/loginuser', user.login(db));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
