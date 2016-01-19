import BB from 'bluebird';
import Keen from 'keen-js';
import os from 'os';
import osName from 'os-name';
import merge from 'lodash.merge';

export default class SendData {
  constructor(opts) {
    this._opts = merge({}, opts);
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
    data.keen = { timestamp: new Date().toISOString() };

    return new BB.Promise( (resolve, reject) => {
      client.addEvent(event_name, data, (err, res) => {
        if (err) {
          reject(err);
        } else {
          if (this._opts.verbose_level > 0) {
            console.log(res);
          }
          resolve(res);
        }
      });
    });
  }
}
