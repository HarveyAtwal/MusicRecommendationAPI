var express = require('express');
var router = express.Router();
var paramParser = require('../utils/parameter-parser');

function validateParameters(req, res, next) {
  var userParam = req.body.user;

  if(!userParam) {
    var err = new Error('Parameter missing - parameters "user" is needed.');
    err.status = 400;
    return next(err);
  }
  next();
}

function getRecommendations(req, res, next) {
  var user = req.user;
  user.getRecommendations(function(err, recommendationList) {
    if(err) {
      err.status = 400;
      return next(err);
    }
    res.status(200).json({list: recommendationList});
  });
}

router.get('/recommendations', validateParameters,
  paramParser.getUserModel('user'),
  getRecommendations);

module.exports = router;