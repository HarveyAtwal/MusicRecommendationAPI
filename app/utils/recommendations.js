var _ = require('underscore');
var async = require('async');

var genreUtils = require('./genre');

var MAX_RECOMMENDATIONS = 5;

// Retrieve music recommendations based on discovery and relevance
// also ensures that the maximum recommendations are fulfilled by continously
// travelling down the top genres until the recommendation length is greater
// than the maximum recommendations needed
//
// param: genreList - the list of genres to find recommendations from
// param: heardMusic - the list of music ids that have already been heard
// param: recommendationList - an array that allows you to join recommendations from different genre lists 
var getRecommendationsByGenres = function(recommendationList, genreList, heardMusic, callback) {
  var genreIndex = 0;
  async.whilst(
    // check if the recommendation length has been filled
    function() { return (recommendationList.length < MAX_RECOMMENDATIONS && genreIndex < genreList.length) },
    function(done) {
      // retrieve all musics related to the genre
      genreUtils.getMusicList(genreList[genreIndex], function(err, musicList) {
        if(err) {
          done(err);
        }
        // maximize for discover by elimating the users head music from the genre list of music
        recommendationList = _.uniq(_.union(recommendationList, _.difference(musicList, heardMusic)));
        genreIndex ++;
        done();
      }); 
    },
    function(err) {
      if(err) {
        callback(err);
      }
      callback(null, recommendationList.slice(0, MAX_RECOMMENDATIONS));
    }
  );
}
              
module.exports.getRecommendationsByGenres = getRecommendationsByGenres;
module.exports.MAX_RECOMMENDATIONS = MAX_RECOMMENDATIONS;