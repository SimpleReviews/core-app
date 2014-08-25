var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var categories = require('./routes/categories');
var products = require('./routes/products');
var reviews = require('./routes/reviews');
var semantics3 = require('./routes/semantics3');
var youtube = require('./routes/youtube');
var instagram = require('./routes/instagram');
var users = require('./routes/users');
var session = require('./routes/session');
var twitter = require('./routes/twitter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
});

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/categories/', categories);
app.use('/products/', products);
app.use('/reviews/', reviews);
app.use('/semantics3/', semantics3);
app.use('/youtube/', youtube);
app.use('/instagram/', instagram);
app.use('/twitter/', twitter);
app.use('/users', users);
app.use('/', session);

app.use('/', function(req, res) {
  res.sendfile('public/index.html');
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
