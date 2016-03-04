
var Genre = require('../models/genre')
var _ = require('underscore');

// Merges two genre lists and tallies up each score for every distinct genre
//
// param: firstGenreList
// param: secondGenreList
var mergeGenres = function (firstGenreList, secondGenreList) {
  var genreList = {};
  var tallyGenreScores = function() {}
  for(var genre in firstGenreList) {
    var genreScore = firstGenreList[genre];
    genreList[genre] = genreList[genre] ? genreList[genre] + genreScore : genreScore;
  }
  for(var genre in secondGenreList) {
    var genreScore = secondGenreList[genre];
    genreList[genre] = genreList[genre] ? genreList[genre] + genreScore : genreScore;
  }
  return genreList;
};


// Returns a list of all musics from a specific genre
//
// param: genreId
// param: callback
var getMusicList = function(genreId, callback) {
  Genre.findOne({_id: genreId}, function(err, genre) {
    if(err) {
      return callback(err);
    }
    if(!genre) {
      var error = new Error("Unable to find genre");
      return callback(err);
    }
    callback(err, genre.musics);
  });
};

// Retrieve all genre ids in the database
//
// param: callback
var getAllGenres = function(callback) {
  Genre.find({}, function(err, genres) {
    if(err) {
      return callback(err);
    }
    var genreList = [];
    _.each(genres, function(genre) {
      genreList.push(genre._id);
    })
    callback(null, genreList);
  });
};


module.exports.mergeGenres = mergeGenres;
module.exports.getMusicList = getMusicList;
module.exports.getAllGenres = getAllGenres;