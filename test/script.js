/**
 *  This test script is different from the others as it does not clear the database collections because
 *  this script relies on the server to load the default list of musics.
 *
 *  It should be executed independantly of the other scripts.
 */

var request = require('supertest');
var should = require('should');
var _ = require('underscore');
var async = require('async');

var Music = require('../app/models/music');
var User = require('../app/models/user');
var Genre = require('../app/models/genre');

var listenJson = require('../json/listen');
var followJson = require('../json/follows');

// Make certain that the test database will be used
process.env.NODE_ENV = 'test'
var app = require('../app');

function removeUsers(done) {
  User.remove({}, done);
}

function createUsers(done) {
  var followPairs = followJson.operations;
  var users = [];

  _.each(followPairs, function(followPair) {
    _.each(followPair, function(user) {
      users.push(user);
    });
  });

  users = _.uniq(users);
  async.each(users, function(userId, callback) {
    var user = new User({_id: userId});
    user.save(callback);
  }, function(err) {
    done(err);
  });
};

function feedFollowEndpoint(done) {
  var followPairs = followJson.operations;

  async.each(followPairs, function(followPair, callback) {
    var user = followPair[0];
    var followee = followPair[1];

    request(app)
      .post('/follow')
      .send({from: user, to: followee})
      .end(callback);
  }, function(err) {
    done(err);
  });
}

function feedListenEndpoint(done) {
  var userIds = listenJson.userIds;
  async.forEachOf(userIds, function(musics, userId, topCallback) {
    async.each(musics, function(music, bottomCallback) {
      request(app)
        .post('/listen')
        .send({user: userId, music: music})
        .end(bottomCallback);
    }, function(err) {
      topCallback(err);
    });
  }, function(err) {
    done(err);
  });
}

describe('Script', function() {
  beforeEach(function(done) {
    removeUsers(function() {
      createUsers(function(err) {
        if(err) {
          done(err);
        }

        feedFollowEndpoint(function(err) {
          if(err) {
            done(err);
          }

          feedListenEndpoint(function(err) {
            done(err);
          })
        });
      });
    })
  });

  it('should return music recommendations', function(done) {
    request(app)
      .get('/recommendations')
      .send({user: 'a'})
      .end(function(err, req) {
        if(err) {
          return done(err);
        }
        console.log("Recommended Music:")
        console.log(req.body.list);
        done();
      });
  });
});