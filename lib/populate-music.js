var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');

var config = require('../config');
var Music = require('../app/models/music');
var Genre = require('../app/models/genre');

function populateMusic(done) {
  var musicList = require('../json/music');

  // Loop through each music
  async.each(Object.keys(musicList), function(musicId, callback) {
    Music.findOne({_id: musicId}, function(err, music) {
      if(err) {
        callback(err);
      }

      // No music found with that musicId
      if(!music) {
        console.log("Creating new music: " + musicId);
        var music = new Music({_id: musicId});
        var genres = musicList[musicId];

        _.each(genres, function(genreId) {
          var genre = new Genre({_id: genreId});
          music.addGenre(genre);

          // Use upsert to create genre if the genre does not exist while simultaneously pushing music ids to genres
          Genre.update({_id: genreId}, {$addToSet: {musics: musicId}}, {upsert: true}, function(err) {
            if(err) {
              callback(err);
            }
            callback();
          });
        });
      } else {
        callback();
      }
    });
  }, function(err) {
      if(err) {
        console.log('Error when adding music');
        throw err;
      }
      done(err);
    }
  );
}

mongoose.connect(config.db, function(err) {
  if(err) {
    throw err;
  }
  populateMusic(function() {
    mongoose.connection.close();
  });
});
