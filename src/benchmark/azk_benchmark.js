import BB from 'bluebird';
import merge from 'lodash.merge';
import fsAsync from 'file-async';
import which from 'which';
import spawnAsync from '../utils/spawn_async';
import SendData from './send_data';
import { matchFirstRegex } from '../utils/regex_helper';
import chalk from 'chalk';
import dotenv from 'dotenv';
import actions from './actions';

export default class AzkBenchmark {
  constructor(opts) {
    this._opts = merge({}, opts);
    dotenv.load({ silent: true });

    this.AZK_DEFAULT_PATH = '/usr/lib/azk/bin/azk';

    // load senddata
    this.sendData = new SendData(this._opts);

    // load actions
    this.pre_actions = actions.pre_actions;
    this.pre_actions_prefix = chalk.gray('[') +
      chalk.blue('provision') +
      chalk.gray(']') +
      chalk.white(' $> ');

    this.main_actions = actions.main_actions;
    this.main_actions_prefix = chalk.gray('[') +
      chalk.blue('benchmarking') +
      chalk.gray(']') +
      chalk.white(' $> ');

    this.get_version_prefix = chalk.gray('[') +
      chalk.blue('azk version') +
      chalk.gray(']') +
      chalk.white(' $> ');
  }

  initialize() {
    return this._getAzkPath()
    .then((azk_bin_path) => {
      this._azk_bin_path = azk_bin_path;
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

  start() {
    return this._runPreActions()
    .then(this._getAzkVersion.bind(this))
    .then(this._runMainActions.bind(this))
    .then(this._processResults.bind(this));
  }

  _runPreActions() {
    return BB.Promise.mapSeries(this.pre_actions, (params) => {
      let start = this._startTimer();
      let params_result = params(this._opts);
      return this._spawnCommand(
        params_result,
        this.pre_actions_prefix,
        this._opts.verbose_level
      )
      .then((result) => {
        let result_to_send = {
          command: 'azk ' + params_result.join(' '),
          result: result,
          time: this._stopTimer(start)
        };
        process.stdout.write(' ' + chalk.green(result_to_send.time.toString() + 'ms') + '\n\n');
        return result_to_send;
      })
      .catch((err) => {
        console.error(err);
        console.error(params_result);
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

  _spawnCommand(params, prefix, verbose_level) {
    return spawnAsync({
      cwd          : this._opts.dest_path,
      executable   : this._azk_bin_path,
      params_array : params,
      prefix       : prefix,
      verbose_level: verbose_level,
    });
  }

  _getAzkVersion() {
    return this._spawnCommand(['version'], this.get_version_prefix, this._opts.verbose_level - 1)
    .then((version_result) => {
      this.azk_version = matchFirstRegex(version_result.message, /(\d+\.\d+\.\d+)/)[1];
    });
  }

  _runMainActions() {
    return BB.Promise.mapSeries(this.main_actions, (params) => {
      let start = this._startTimer();
      return this._spawnCommand(params, this.main_actions_prefix, this._opts.verbose_level)
      .then((result) => {
        let result_to_send = {
          command: 'azk ' + params.join(' '),
          result: result,
          azk_version: this.azk_version,
          time: this._stopTimer(start)
        };
        process.stdout.write(' ' + chalk.green(result_to_send.time.toString() + 'ms') + '\n\n');
        return result_to_send;
      });
    });
  }

  _processResults(final_results) {
    if (this._opts.send) {
      if (this._opts.verbose_level > 0) {
        console.log('Sending data to Keen.IO...');
      }
      return BB.Promise.mapSeries(final_results, (result) => {
        // send each result to Keen.IO
        return this.sendData.send('profiling', result);
      })
      .then((results) => {
        // check if all data was sent to Keen.IO
        let success_results = results.filter((item) => {
          return (item.created === true);
        });
        if (success_results.length === results.length) {
          console.log('\n' + chalk.green('Benchmark finished. All data sent to Keen.IO.') + '\n');
          return 0;
        } else {
          console.log('\n' + chalk.red('Benchmark finished. Some data was not sent to Keen.IO:') + '\n');
          console.log(results);
          return 1;
        }
      });
    } else {
      console.log('\n' + chalk.green('Benchmark finished. No data was sent.') + '\n');
      return 0;
    }
  }
}
