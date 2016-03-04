var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MusicSchema = new Schema({
  _id: String,
  genres: [{
    type: String,
    ref : 'Genre'
  }]
});

MusicSchema.methods.addGenre = function (genres, callback) {
  var Genre = mongoose.model('Genre');
  if(!genres || !(genres instanceof Genre)) {
    var err = new Error('invalid "genres" type');
    return callback(err);
  }

  // only add genres if it doesn't exist
  if(this.genres.indexOf(genres._id) === -1) {
    this.genres.push(genres._id);
    this.save(callback);
  } else {
    return callback();
  }
}

var getMusic = function(musicId, callback) {    
  var Music = mongoose.model('Music');
  Music.findOne({_id: musicId}, function(err, music) {
    if(err) {
      callback(err);
    }
    if(!music) {
      var err = new Error('Unable to find music with the following id: ' + musicId);
      return callback(err);
    }
    callback(null, music);
  });
}

module.exports = mongoose.model('Music', MusicSchema);
module.exports.getMusic = getMusic;