var express = require('express');
var router = express.Router();
var paramParser = require('../utils/parameter-parser');

function validateParameters(req, res, next) {
  var userParam = req.body.user;
  var musicParam = req.body.music;

  if(!userParam || !musicParam) {
    var err = new Error('Parameter missing - both parameters "user" and "music" are needed.');
    err.status = 400;
    return next(err);
  }

  next();
}

function postListen(req, res, next) {
  var user = req.user;
  var music = req.music;

  user.addMusic(music, function(err) {
    if(err) {
      err.status = 400;
      return next(err);
    }
    res.sendStatus(200);
  });
}

router.post('/listen', validateParameters,
  paramParser.getUserModel('user'),
  paramParser.getMusicModel('music'),
  postListen);

module.exports = router;