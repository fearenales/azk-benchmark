require('azk-dev/lib/gulp')({
  cwd  : __dirname
});

// Load envs from .env files
var dotenv = require('dotenv');
dotenv.load({ silent: true });
