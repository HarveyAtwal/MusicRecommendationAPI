var clearDB = require('../clear_db');
var should = require('should');

var Music = require('../../app/models/music');
var User = require('../../app/models/user');
var Genre = require('../../app/models/genre');

describe('User', function() {
  describe('#addMusic()', function () {
    describe('add new music', function () {
      var user = new User({_id: 'user'});
      var music = new Music({_id: 'music'});
      var genre = new Genre({_id: 'jazz'});
      var beforeLength;

      beforeEach(function(done) {
        beforeLength = user.heardMusic.length;
        music.addGenre(genre, function(err) {
          user.addMusic(music, function(err) {
            done(err);
          });
        });
      });

      it('should increase heard music length by one', function(done) {
        var expectedLength = user.heardMusic.length;
        expectedLength.should.equal(beforeLength + 1);
        done();
      });
    });

    describe('add existing music', function () {
      var user = new User({_id: 'user'});
      var music = new Music({_id: 'music'});
      var genre = new Genre({_id: 'jazz'});
      var beforeLength;

      beforeEach(function(done) {
        music.addGenre(genre, function(err) {
          user.addMusic(music, function(err) {
            beforeLength = user.heardMusic.length;
            user.addMusic(music, function(err) {
              done(err);
            });
          });
        });
      });

      it('should increase heard music length by one', function(done) {
        var expectedLength = user.heardMusic.length;
        expectedLength.should.equal(beforeLength + 1);
        done();
      });
    });

    describe('add invalid music', function () {
      var user = new User({_id: 'user'});
      var error;

      beforeEach(function(done) {
        user.addMusic('invalid', function(err) {
          error = err;
          done();
        });
      });

      it('should break', function(done) {
        should.exist(error);
        done();
      });
    });
  });

  describe('#addFollowee()', function () {
    describe('add new followee', function () {
      var user = new User({_id: 'user'});
      var followee = new User({_id: 'followee'});
      var beforeLength;

      beforeEach(function(done) {
        beforeLength = user.followees.length;
        user.addFollowee(followee, function(err) {
          done(err);
        });
      });

      it('should increase followee length by one', function(done) {
        var userFolloweeLength = user.followees.length;
        var expectedLength = beforeLength + 1;
        userFolloweeLength.should.equal(expectedLength);
        done();
      });
    });

    describe('add existing followee', function () {
      var user = new User({_id: 'user'});
      var followee = new User({_id: 'followee'});
      var beforeLength;

      beforeEach(function(done) {
        user.addFollowee(followee, function(err) {
          beforeLength = user.followees.length;
          user.addFollowee(followee, function(err) {
            done(err);
          });
        });
      });

      it('should not increase followee length', function(done) {
        var userFolloweeLength = user.followees.length;
        userFolloweeLength.should.equal(beforeLength);
        done();
      });
    });

  describe('add invalid followee', function () {
      var user = new User({_id: 'user'});
      var error;

      beforeEach(function(done) {
        user.addFollowee('invalid', function(err) {
          error = err;
          done();
        });
      });

      it('should break', function(done) {
        should.exist(error);
        done();
      });
    });
  });
});