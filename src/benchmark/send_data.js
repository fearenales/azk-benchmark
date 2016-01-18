import BB from 'bluebird';
import Keen from 'keen-js';
import os from 'os';
import osName from 'os-name';
import merge from 'lodash.merge';

export default class SendData {
  constructor(opts) {
    this._opts = merge({
      projectId: process.env.BENCHMARK_AZK_KEEN_IO_PROJECTID ||
        '5526968d672e6c5a0d0ebec6',
      writeKey : process.env.BENCHMARK_AZK_KEEN_IO_WRITEKEY ||
        '5dbce13e376070e36eec0c7dd1e7f42e49f39b4db041f208054' +
        '617863832309c14a797409e12d976630c3a4b479004f26b3625' +
        '06e82a46dd54df0c977a7378da280c05ae733c97abb445f58ab' +
        'b56ae15f561ac9ad774cea12c3ad8628d896c39f6e702f6b035541fc1a562997cb05768'
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
