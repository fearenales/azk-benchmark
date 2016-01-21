import BB from 'bluebird';
import { spawn } from 'child_process';
import chalk from 'chalk';
import fsAsync from 'file-async';

let spawnAsync = ({cwd, executable, prefix, params_array, verbose_level}) => {
  return new BB.Promise((resolve, reject) => {
    return fsAsync.exists(cwd).then((exists) => {
      // check if cwd exists
      // only run in destination folder if it exists
      let spawn_options = { cwd: undefined, env: process.env };
      if (exists) {
        spawn_options.cwd = cwd;
      }

      var spawn_cmd = spawn(executable, params_array, spawn_options)
      .on('error', (err) => {
        console.error('cwd:', cwd);
        throw err;
      });

      var outputs = [];

      // print header
      var full_command = prefix +
        chalk.gray(executable + ' ') +
        chalk.bold(params_array.join(' ') +
        '\n');

      let printOutput = (verbose_level, data, color) => {
        // exit if verbose is zero
        if (verbose_level <= 0 || !data) {
          return;
        }
        process.stdout.write(color(data.toString()));
      };

      printOutput(
        verbose_level + 1,
        full_command,
        chalk.white
      );

      spawn_cmd.stdout.on('data', (data) => {
        outputs.push(data);

        // print output
        printOutput(
          verbose_level,
          data,
          chalk.gray);
      });

      spawn_cmd.stderr.on('data', (data) => {
        outputs.push(data);

        // print output
        printOutput(
          verbose_level,
          data,
          chalk.gray.bold);
      });

      spawn_cmd.on('close', (code) => {
        var result_object = {
          executable,
          params_array,
          cwd: spawn_options.cwd,
          code,
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
};

export default spawnAsync;
