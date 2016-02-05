import BB from 'bluebird';
import merge from 'lodash.merge';
import spawnAsync from '../utils/spawn_async';
import SendData from './send_data';
import { matchFirstRegex } from '../utils/regex_helper';
import chalk from 'chalk';
import dotenv from 'dotenv';
import actions from './actions';
import Table from 'cli-table';

export default class AzkBenchmark {
  constructor(opts) {
    this.opts = merge({}, opts);
    dotenv.load({ silent: true });

    this._validade(this.opts);

    // load senddata
    this.sendData = new SendData(this.opts);

    // load actions
    this.pre_actions = actions.pre_actions;
    this.pre_actions_prefix = (
      chalk.gray('[') +
      chalk.blue('provision') +
      chalk.gray(']') +
      chalk.white(' $> ')
    );

    this.main_actions = actions.main_actions;
    this.main_actions_prefix = (
      chalk.gray('[') +
      chalk.blue('benchmarking') +
      chalk.gray(']') +
      chalk.white(' $> ')
    );

    this.get_version_prefix = (
      chalk.gray('[') +
      chalk.blue('azk version') +
      chalk.gray(']') +
      chalk.white(' $> ')
    );
  }

  _validade(opts) {
    if (!opts.azk_bin_path) {
      throw new Error(`azk_bin_path (${opts.azk_bin_path}) cannot be null/undefined`);
    }
  }

  start() {
    return this._runPreActions()
    .then(this._getAzkVersion.bind(this))
    .then(this._runMainActions.bind(this))
    .then(this._processResults.bind(this))
    .catch((err) => {
      console.error(err);
      return 1;
    });
  }

  _runPreActions() {
    return BB.Promise.mapSeries(this.pre_actions, (params) => {
      let start = this._startTimer();
      let params_result = params(this.opts);
      return this._spawnCommand(
        params_result,
        this.pre_actions_prefix,
        this.opts.verbose_level
      )
      .then((result) => {
        let result_to_send = {
          command: 'azk ' + params_result.join(' '),
          result: result,
          time: this._stopTimer(start)
        };
        if (this.opts.verbose_level > 0) {
          process.stdout.write(' ' + chalk.green(result_to_send.time.toString() + 'ms') + '\n\n');
        }
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
      cwd          : this.opts.dest_path,
      executable   : this.opts.azk_bin_path,
      params_array : params,
      prefix       : prefix,
      verbose_level: verbose_level - 1,
    });
  }

  _getAzkVersion() {
    return this._spawnCommand(['version'], this.get_version_prefix, this.opts.verbose_level - 1)
    .then((version_result) => {
      this.azk_version = matchFirstRegex(version_result.message, /(\d+\.\d+\.\d+)/)[1];
    });
  }

  _runMainActions() {
    return BB.Promise.mapSeries(this.main_actions, (params) => {
      let start = this._startTimer();
      return this._spawnCommand(params, this.main_actions_prefix, this.opts.verbose_level)
      .then((result) => {
        let result_to_send = {
          command: 'azk ' + params.join(' '),
          result: result,
          azk_version: this.azk_version,
          time: this._stopTimer(start)
        };
        if (this.opts.verbose_level > 0) {
          process.stdout.write(' ' + chalk.green(result_to_send.time.toString() + 'ms') + '\n\n');
        }
        return result_to_send;
      });
    });
  }

  _processResults(final_results) {
    let table_args = (this.opts.plain) ? {
      chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
       'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
       'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '',
       'right': '' , 'right-mid': '' , 'middle': ' ' },
      style: { 'padding-left': 0, 'padding-right': 0 }
    } : {
      style: {head: ['white'], border: ['grey']}
    };

    var table = new Table(table_args);

    // each result
    final_results.forEach((item) => {
      let row = {};
      row[item.command] = item.time;
      table.push(row);
    });

    // total
    let total_time = final_results.reduce((r, c) => {
      return r + c.time;
    }, 0);

    table.push({total: total_time});

    console.log(chalk.white.bold('Benchmark Results:'));
    console.log(table.toString());

    if (this.opts.send) {
      if (this.opts.verbose_level > 0) {
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
          console.log(chalk.green('Benchmark finished. All data sent to Keen.IO.'));
          return 0;
        } else {
          console.log(chalk.red('Benchmark finished. Some data was not sent to Keen.IO:'));
          console.log(results);
          return 1;
        }
      });
    } else {
      console.error(chalk.green('Benchmark finished. No data was sent.'));
      return 0;
    }
  }
}
