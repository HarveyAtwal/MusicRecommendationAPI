// Module setup
// =============================
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var logger = require('morgan');
var _ = require('underscore');
var path = require('path');

var config = require('./config');
var router = express.Router();
var app = express();

function main() {
  app.use(logger(config.loggerMode));
  app.use(bodyParser.json());

  // Routing
  // =============================
  var recommendations = require('./app/routes/recommendations')
  var follow = require('./app/routes/follow')
  var listen = require('./app/routes/listen')

  router.use(recommendations);
  router.use(follow);
  router.use(listen);

  app.use(router);

  // Error handling
  // =============================
  app.use(function(req, res, next) {
    // catch 404 and forward to error handler
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (config.env === 'development') {
    // print stacktrace if running in development mode
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json({'message': err.message, 'err': err});
    });
  }

  app.use(function(err, req, res, next) {
    // prevent stacktrace from showing when in production mode
    res.status(err.status || 500);
    res.json({'message': err.message, 'err': err});
  });

  // Start Server
  // =============================
  app.listen(config.port);
}

// Database setup
// =============================
console.log(config.db);
mongoose.connect(config.db, function(err) {
  if(err) {
    throw err;
  }
  main();
});

module.exports = app;
