import path from 'path';
import chalk from 'chalk';

module.exports = class AzkBenchmarkCli {
  createCli(opts) {
    var Cli = require('cli-router').Cli;

    opts.controllers_root = path.join(__dirname, "./controllers");
    var cli = new Cli(opts);

    cli
      .route('version', (p) => p.version || p['--version'])
      .route('start', (p, args) => args.length >= 0);

    var result = cli.run({ argv: process.argv.slice(2) });
    if (result.hasOwnProperty('_promise0')) {
      // promise result
      return result
      .then((promise_result) => process.exit(promise_result))
      .catch((err) => {
        console.error(chalk.bold.red('\n\nError has occurred. Stoping execution.\n'));
        console.error(chalk.red(err.stack));
        process.exit(err.code);
      });
    } else {
      // no promise
      process.exit(0);
    }
  }
};
