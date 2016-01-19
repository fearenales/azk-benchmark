import BB from 'bluebird';
import { spawn } from 'child_process';
import chalk from 'chalk';
import fsAsync from 'file-async';

export default function spawnAsync(opts) {
  return new BB.Promise(function (resolve, reject) {
    return fsAsync.exists(opts.cwd).then((exists) => {
      // check if opts.cwd exists
      // only run in destination folder if it exists
      let spawn_options = { cwd: undefined, env: process.env };
      if (exists) {
        spawn_options.cwd = opts.cwd;
      }

      var spawn_cmd = spawn(opts.executable, opts.params_array, spawn_options)
      .on('error', function(err) {
        console.error('opts.cwd:', opts.cwd);
        throw err;
      });

      var outputs = [];

      // print header
      var full_command = opts.prefix +
        chalk.gray(opts.executable + ' ') +
        chalk.bold(opts.params_array.join(' ') +
        '\n');

      let printOutput = (verbose_level, data, color) => {
        // exit if verbose is zero
        if (verbose_level === 0 || !data) {
          return;
        }
        process.stdout.write(color(data.toString()));
      };

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
  });
}
