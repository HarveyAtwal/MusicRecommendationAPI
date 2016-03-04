var express = require('express');
var router = express.Router();
var paramParser = require('../utils/parameter-parser');

function validateParameters(req, res, next) {
  var fromParam = req.body.from;
  var toParam = req.body.to;

  if(!fromParam || !toParam) {
    var err = new Error('Parameter missing - both parameters "from" and "to" are needed.');
    err.status = 400;
    return next(err);
  }
  next();
}

function postFollowee(req, res, next) {
  var fromUser = req.from;
  var toUser = req.to;

  fromUser.addFollowee(toUser, function(err) {
    if(err) {
      err.status = 400;
      return next(err);
    }
    res.sendStatus(200);
  });
}

router.post('/follow', validateParameters, 
  paramParser.getUserModel('from'), 
  paramParser.getUserModel('to'), 
  postFollowee);

module.exports = router;