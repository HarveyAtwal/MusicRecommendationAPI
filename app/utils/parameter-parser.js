var getUser = require('../models/user').getUser;
var getMusic = require('../models/music').getMusic;

// Returns middleware to parse a specific paramater and return that user model
//
// param: paramName
var getUserModel = function (paramName) {
  return function(req, res, next) {
    var param = req.body[paramName];

    getUser(param, function(err, user) {
      if(err) {
        err.status = 400;
        return next(err);
      }
      req[paramName] = user;
      next();
    })
  };
}; 

// Returns middleware to parse a specific paramater and return that music model
//
// param: paramName
var getMusicModel = function (paramName) {
  return function(req, res, next) {
    var param = req.body[paramName];

    getMusic(param, function(err, music) {
      if(err) {
        err.status = 400;
        return next(err);
      }
      req[paramName] = music;
      next();
    })
  };
}; 

module.exports.getMusicModel = getMusicModel;
module.exports.getUserModel = getUserModel;