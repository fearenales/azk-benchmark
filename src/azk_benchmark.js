import BB from 'bluebird';
import os from 'os';
import osName from 'os-name';
import merge from 'lodash.merge';
import fsAsync from 'file-async';
import which from 'which';
import spawnAsync from './utils/spawn_async';
import SendData from './send_data';
import { matchFirstRegex } from './utils/regex_helper';
import chalk from 'chalk';

export default class AzkBenchmark {
  constructor(opts) {
    this._opts = merge({}, opts);
    this.AZK_DEFAULT_PATH = '/usr/lib/azk/bin/azk';
    this.sendData = new SendData(/*this._opts*/);

  }

  initialize() {
    return this._getAzkPath()
    .then((azk_bin_path) => {
      this._azk_bin_path = azk_bin_path;
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
    let azk_version = '';

    // get azk version
    return this._spawnCommand(['version'], this._opts.verbose_level - 1)
    .then((version_result) => {
      azk_version = matchFirstRegex(version_result.message, /(\d+\.\d+\.\d+)/)[1];

      // run each azk command
      return BB.Promise.mapSeries([
        [ ['docker'], ['version'] ],
        [ ['docker'], ['info'] ],
        [ ['version'] ],
        [ ['agent'], ['start'] ],
        [ ['info'] ],
        [ ['start'] ],
        [ ['status'] ],
        [ ['stop'] ],
        [ ['agent'], ['stop'] ],
      ], (params) => {
        let start = this._startTimer();
        return this._spawnCommand(params, this._opts.verbose_level)
        .then((result) => {
          let final_result = {
            command: 'azk ' + params.join(' '),
            result: result,
            azk_version: azk_version,
            time: this._stopTimer(start)
          };
          process.stdout.write(' ' + chalk.green(final_result.time.toString() + 'ms') + '\n\n');
          return final_result;
        })
        .then((final_result) => {

          // send result to Keen.IO
          return this.sendData.send('profiling', final_result);
        });
      }).then((results) => {
        // check if all data was sent to Keen.IO
        let success_results = results.filter((item) => {
          return (item.created === true);
        });
        if (success_results.length === results.length) {
          console.log('\n' + chalk.green('all data sent to Keen.IO') + '\n');
        } else {
          console.log('\n' + chalk.red('some data was not sent to Keen.IO;') + '\n');
          console.log(results);
        }
      });
    });
  }

  _startTimer() {
    var start = new Date().getTime();
    return start;
  }

  _stopTimer(start) {
    var end = new Date().getTime();
    var time = end - start;
    return time;
  }

  _spawnCommand(params, verbose_level) {
    return spawnAsync({
      executable   : this._azk_bin_path,
      params_array : params,
      verbose_level: verbose_level
    });
  }

}
