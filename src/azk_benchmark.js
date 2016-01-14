import BB from 'bluebird';
import os from 'os';
import osName from 'os-name';
import merge from 'lodash.merge';
import dotenv from 'dotenv';
import fsAsync from 'file-async';
import path from 'path';
import which from 'which';
// import { spawn } from 'child_process';
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
    this.AZK_DEFAULT_PATH = '/usr/lib/azk/bin/azk';
  }

  initialize() {
    return this._getAzkPath()
    .then((azk_bin_path) => {
      /**/console.log('\n>>---------\n azk_bin_path:\n', azk_bin_path, '\n>>---------\n');/*-debug-*/
    });
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

  _which(command) {
    return new BB.Promise((resolve, reject) => {
      which(command, function (er, resolvedPath) {
        if (er) {
          // er is returned if no "command" is found on the PATH
          reject(er);
        } else {
          // if it is found, then the absolute path to the exec is returned
          resolve(resolvedPath);
        }
      });
    });
  }

  _getAzkPath() {
    let azk_current_path = this._opts.azk_bin_path || this.AZK_DEFAULT_PATH;

    return this._which(azk_current_path)
    .then((full_path) => {
      return fsAsync.stat(full_path)
      .then((stats) => {
        if (stats.isFile()) {
          return full_path;
        } else {
          throw new Error(azk_current_path + ' must be a file');
        }
      });
    });
  }

  start() {
    return new BB.Promise((resolve) => {
      resolve('TODO: started');
    });
  }
}
