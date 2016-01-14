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
  constructor(opts) {
    this._opts = merge({}, opts);
  }

  initialize() {
    this._getPaths();
  }

  _getHostInfo() {
    return {
      os           : osName(),
      proc_arch    : os.arch(),
      total_memory : Math.floor(os.totalmem() / 1024 / 1024),
      cpu_info     : os.cpus()[0].model,
      cpu_count    : os.cpus().length,
      host         : os.hostname(),
      argv         : process.argv.concat(),
      pid          : process.pid
    };
  }

  _getEnv(envName, defaultValue) {
    let env_value = process.env[envName];

    if (typeof env_value !== 'undefined') {
      return env_value;
    } else {
      return defaultValue;
    }
  }

  _getPaths() {
    this.azk_bin_path = this._getEnv('AZK_BIN_PATH', '/usr/bin/azk');
    // let profiling_dir = '';
    // let benchmarks_results_path = '';
    // let azk_bin = '';
    // let adocker_bin = '';
  }
}
