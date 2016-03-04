var mongoose = require('mongoose');
var _ = require('underscore');
var async = require('async');

var recommendationsUtils = require('../utils/recommendations');
var genreUtils = require('../utils/genre');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  _id: String,
  followees: [{
    type: String,
    ref: 'User'
  }],
  heardMusic: [{
    type: String,
    ref: 'Music'
  }]
});

UserSchema.methods.addFollowee = function (user, callback) {
  var User = mongoose.model('User');
  if(!user || !(user instanceof User)) {
    var err = new Error('invalid "user" type');
    return callback(err);
  }

  // Only add followees if they aren't already followees
  if(this.followees.indexOf(user._id) === -1)  {
    this.followees.push(user._id);
    this.save(callback);
  } else {
    // Followee already added
    return callback();
  }
};

UserSchema.methods.addMusic = function (music, callback) {
  var Music = mongoose.model('Music');
  if(!music || !(music instanceof Music)) {
    var err = new Error('invalid "music" type');
    return callback(err);
  }

  // add music to list of heard music
  // duplicate musics are allowed
  this.heardMusic.push(music._id);
  this.save(callback);
};

// Get music recommendations based on this users heard music and followees heard music 
UserSchema.methods.getRecommendations = function (callback) {
  var user = this;

  // get this users list of favorite genres
  user.getGenreScore(function(err, userFavoriteGenres) {
    if(err) {
      callback(err);
    }

    // get this users followees list of favorite genres
    user.getFolloweeGenreScore(function(err, favoritefolloweesGenreScore) {
      if(err) {
        callback(err);
      }

      // merge this users favorite genres with the followees favorite genres
      var topGenreScores = genreUtils.mergeGenres(userFavoriteGenres, favoritefolloweesGenreScore);
      topGenreScores = _.map(topGenreScores, function(value, key) {
          return [key, value];
      });

      // sort by relevance
      topGenreScores = _.chain(topGenreScores)
        .sortBy(function(item) {
          return -item[1];
        })
        .value();

      // remove scores from the genres
      var topGenres = [];
      _.each(topGenreScores, function(genreScore) {
        topGenres.push(genreScore[0]);
      });


      var maxRecommendations = recommendationsUtils.MAX_RECOMMENDATIONS;
      recommendationsUtils.getRecommendationsByGenres([], topGenres, user.heardMusic, function(err, recommendations) {
        if(err) {
          callback(err);
        }

        // a fresh user might not have listened to any musics or follow anyone
        // randomly select genre until recommendations are filled
        if(recommendations.length < maxRecommendations) {
          genreUtils.getAllGenres(function(err, genres) {
            var genreList = _.difference(genres, topGenres);

            // we reached the maximum recommendations return the results
            recommendationsUtils.getRecommendationsByGenres(recommendations, genreList, user.heardMusic, function(err, completeRecommendationList) {
              if(err) {
                callback(err);
              }
              callback(null, completeRecommendationList.slice(0, maxRecommendations));
            });
          });

        // we reached the maximum recommendations return the results
        } else if(recommendations.length >= maxRecommendations) {
          callback(null, recommendations.slice(0, maxRecommendations));
        }
      });
    });
  });
};

// Retrieves a list of favorite genres from this users followees
UserSchema.methods.getFolloweeGenreScore = function (callback) {
  var User = mongoose.model('User');
  var followeesGenreScore = {};
  User
    .findOne({_id: this._id})
    .populate('followees')
    .exec(function(err, user) {

      // loop through each followee and get list of genre scores per followee
      async.each(user.followees, function(followee, done) {
        followee.getGenreScore(function(err, followeeGenreScore) {
          if(err) {
            done(err);
          }

          // halve the score for followees
          // followees heard music become less relevant as the recommendations travel down followees of followees
          _.each(followeeGenreScore, function(value, key) {
            followeeGenreScore[key] = value / 2;
          });

          // merge followee genre scores with other followees
          // to find the most popular genre among all followees
          followeesGenreScore = genreUtils.mergeGenres(followeesGenreScore, followeeGenreScore);
          done();
        });
      }, function(err) {
        callback(err, followeesGenreScore);
      });
    });
};

// Retrieves the count of each genre based on the users heard music
UserSchema.methods.getGenreScore = function (callback) {
  var User = mongoose.model('User');
  var genres = [];
  User
    .findOne({_id: this._id})
    .populate('heardMusic')
    .exec(function(err, user) {
      if(err) {
        callback(err);
      }

      // populate list of genre
      _.each(user.heardMusic, function(music) {
        _.each(music.genres, function(genre) {
          genres.push(genre);
        }); 
      });

      // sort by relevance
      genres = _.chain(genres)
        .countBy()
        .pairs()
        .sortBy(function(item) {
          return -item[1];
        })
        .value();

      genres = _.object(_.map(genres, function(item) {
         return [item[0], item[1]]
      }));
      callback(null, genres);
    });
};

var getUser = function(userId, callback) {    
  var User = mongoose.model('User');
  User.findOne({_id: userId}, function(err, user) {
    if(err) {
      callback(err);
    }
    if(!user) {
      var err = new Error('Unable to find user with the following id: ' + userId);
      return callback(err);
    }
    callback(null, user);
  });
};

module.exports = mongoose.model('User', UserSchema);
module.exports.getUser = getUser;