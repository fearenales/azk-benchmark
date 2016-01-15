import BB from 'bluebird';
import Keen from 'keen-js';
import os from 'os';
import osName from 'os-name';
import merge from 'lodash.merge';

export default class SendData {
  constructor(opts) {
    this._opts = merge({
      projectId: '552818c790e4bd7f7bd8baba',
      writeKey : 'e2c70b3dd3ed3003a09a1bc7d8622ad9220fe33069d81' +
                 '164f0fafa13baf11458e48736f6cbcc995a8346183b29' +
                 '0597504feb4bef06f71350f4859df5eb271a1d845f7cf' +
                 'f5c9dfddf2f03de1e39760c6e51a06fb9e347c2e1fb98' +
                 'd3c6d370e6916e5db8810ddd9c0d5d83540386ccfe2e',
    }, opts);
  }

  send(event_name, data) {
    var client = new Keen({
      // prod
      projectId: this._opts.projectId,
      writeKey : this._opts.writeKey
    });

    // add host info
    data.device_info = {
      os           : osName(),
      proc_arch    : os.arch(),
      total_memory : Math.floor(os.totalmem() / 1024 / 1024),
      cpu_info     : os.cpus()[0].model,
      cpu_count    : os.cpus().length
    };
    data.git = require('git-repo-info')();
    data.keen = { timestamp: new Date().toISOString() };

    return new BB.Promise( (resolve, reject) => {
      client.addEvent(event_name, data, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}
