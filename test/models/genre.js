var clearDB = require('../clear_db');
var should = require('should');

var Music = require('../../app/models/music');
var Genre = require('../../app/models/genre');

describe('Genre', function() {
  describe('#addMusic()', function () {
    describe('add new music', function () {
      var music = new Music({_id: 'music'});
      var genre = new Genre({_id: 'jazz'});
      var beforeLength;

      beforeEach(function(done) {
        beforeLength = genre.musics.length;
        music.addGenre(genre, function(err) {
          done(err);
        });
      });

      it('should increase music length by one', function(done) {
        var expectedLength = music.genres.length;
        expectedLength.should.equal(beforeLength + 1);
        done();
      });
    });

    describe('add existing music', function () {
      var music = new Music({_id: 'music'});
      var genre = new Genre({_id: 'jazz'});
      var beforeLength;

      beforeEach(function(done) {
        genre.addMusic(music, function(err) {
          beforeLength = genre.musics.length;
          genre.addMusic(music, function(err) {
            done(err);
          });
        });
      });

      it('should not increase musics length by one', function(done) {
        var expectedLength = genre.musics.length;
        expectedLength.should.equal(beforeLength);
        done();
      });
    });

    describe('add invalid music', function () {
      var genre = new Genre({_id: 'genre'});
      var error;

      beforeEach(function(done) {
        genre.addMusic('invalid', function(err) {
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