process.env.NODE_ENV = 'test'

var mongoose = require('mongoose');
var config = require('../config');

// Clear the database before each test
// http://www.scotchmedia.com/tutorials/express/authentication/1/06
beforeEach(function(done) {  
  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return done();
  }
  
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.db, function (err) {
      return clearDB();
    });
  } else {
    return clearDB();
  }
});

afterEach(function (done) {
  mongoose.disconnect();
  return done();
}); 
