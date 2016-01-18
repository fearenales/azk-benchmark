import { CliController } from 'cli-router';

class Version extends CliController {
  index() {
    let version = require('root-require')('package.json').version;
    console.log('version: ' + version);
    return 0;
  }
}

module.exports = Version;
