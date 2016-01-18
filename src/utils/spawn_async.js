import BB from 'bluebird';
import { spawn } from 'child_process';
// import { removeAllLinesByRegex } from './regex_helper';
import chalk from 'chalk';

export default function spawnAsync(opts) {

  let printOutput = (verbose_level, data, color) => {
    // exit if verbose is zero
    if (verbose_level === 0 || !data) {
      return;
    }
    process.stdout.write(color(data.toString()));
  };

  return new BB.Promise(function (resolve, reject) {
    var spawn_cmd = spawn(opts.executable, opts.params_array);
    var outputs = [];

    // print header
    var full_command = opts.prefix +
      chalk.gray(opts.executable + ' ') +
      chalk.bold(opts.params_array.join(' ') +
      '\n');

    printOutput(
      opts.verbose_level + 1,
      full_command,
      chalk.white
    );

    spawn_cmd.stdout.on('data', function (data) {
      outputs.push(data);

      // print output
      printOutput(
        opts.verbose_level,
        data,
        chalk.gray);
    });

    spawn_cmd.stderr.on('data', function (data) {
      outputs.push(data);

      // print output
      printOutput(
        opts.verbose_level,
        data,
        chalk.gray.bold);
    });

    spawn_cmd.on('close', function (code) {
      var result_object = {
        error_code: code,
        message: outputs.join('\n')
      };

      if (code !== 0) {
        reject(result_object);
      } else {
        resolve(result_object);
      }
    });
  });
}
