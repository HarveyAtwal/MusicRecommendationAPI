var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
  _id: String,
  musics: [{
    type: String,
    ref : 'Music'
  }]
});

GenreSchema.methods.addMusic = function (music, callback) {
  var Music = mongoose.model('Music');
  if(!music || !(music instanceof Music)) {
    var err = new Error('invalid "music" type');
    return callback(err);
  }

  // only add music if it doesn't exist
  if(this.musics.indexOf(music._id) === -1) {
    this.musics.push(music._id);
    this.save(callback);
  } else {
    return callback();
  }
}


module.exports = mongoose.model('Genre', GenreSchema);