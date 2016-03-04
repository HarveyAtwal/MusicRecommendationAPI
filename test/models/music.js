var clearDB = require('../clear_db');
var should = require('should');

var Music = require('../../app/models/music');
var Genre = require('../../app/models/genre');

describe('Music', function() {
    describe('#addGenre()', function () {
      describe('add new genre', function () {
        var music = new Music({_id: 'music'});
        var genre = new Genre({_id: 'jazz'});
        var beforeLength;

        beforeEach(function(done) {
          beforeLength = music.genres.length;
          music.addGenre(genre, function(err) {
            done(err);
          });
        });

        it('should increase genre length by one', function(done) {
          var expectedLength = music.genres.length;
          expectedLength.should.equal(beforeLength + 1);
          done();
        });
      });

      describe('add existing genre', function () {
        var music = new Music({_id: 'music'});
        var genre = new Genre({_id: 'jazz'});
        var beforeLength;

        beforeEach(function(done) {
          music.addGenre(genre, function(err) {
            beforeLength = music.genres.length;
            music.addGenre(genre, function(err) {
              done(err);
            });
          });
        });

        it('should not increase genres length by one', function(done) {
          var expectedLength = music.genres.length;
          expectedLength.should.equal(beforeLength);
          done();
        });
      });

      describe('add invalid genre', function () {
        var music = new Music({_id: 'music'});
        var error;

        beforeEach(function(done) {
          music.addGenre('invalid', function(err) {
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