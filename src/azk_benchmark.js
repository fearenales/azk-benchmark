// import BB from 'bluebird';
import os from 'os';
import osName from 'os-name';
import merge from 'lodash.merge';
// import uuid from 'node-uuid';
// import { spawn } from 'child_process';
// import path from 'path';
// import Keen from 'keen-js';
// import os from 'os';
// import fs from promisifyAll(require("fs");
// import glob from 'glob';
// var globAsync = BB.promisify(glob);
// import getMac from 'getmac').getMa;
// var getMacAsync = BB.promisify(getMac);

export default class AzkBenchmark {
  constructor(opt) {
    this._opts = merge({}, {
      os           : osName(),
      proc_arch    : os.arch(),
      total_memory : Math.floor(os.totalmem() / 1024 / 1024),
      cpu_info     : os.cpus()[0].model,
      cpu_count    : os.cpus().length,
      host         : os.hostname(),
      argv         : process.argv.concat(),
      pid          : process.pid
    }, opt);
  }
}
