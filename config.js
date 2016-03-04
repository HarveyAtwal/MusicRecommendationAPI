var config = {};

config.env = process.env.NODE_ENV || 'development'

switch(config.env) {
  case 'test':
    config.db = 'mongodb://localhost/test_musicdb';
    break;
  default:
    config.db = 'mongodb://localhost/musicdb';
    break;
}

config.loggerMode = 'dev'
config.port = 3000;

module.exports = config;