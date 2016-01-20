import { CliController } from 'cli-router';
import AzkBenchmark from '../../benchmark/azk_benchmark';
import chalk from 'chalk';

class Version extends CliController {
  index(params) {
    let azkBenchmark = new AzkBenchmark({
      azk_bin_path: params.azk_bin_path,
      git_repo: params['git-repo']   || 'azukiapp/azkdemo',
      dest_path: params['dest-path'] || '/tmp/azkdemo_benchmark',
      git_ref: params['git-ref']     || 'benchmark',
      send: params.send,
      verbose_level: params.verbose,
      projectId: process.env.BENCHMARK_AZK_KEEN_IO_PROJECTID ||
        '5526968d672e6c5a0d0ebec6',
      writeKey : process.env.BENCHMARK_AZK_KEEN_IO_WRITEKEY ||
        '5dbce13e376070e36eec0c7dd1e7f42e49f39b4db041f208054' +
        '617863832309c14a797409e12d976630c3a4b479004f26b3625' +
        '06e82a46dd54df0c977a7378da280c05ae733c97abb445f58ab' +
        'b56ae15f561ac9ad774cea12c3ad8628d896c39f6e702f6b035541fc1a562997cb05768'
    });

    return azkBenchmark.initialize()
      .then(() => {
        console.log(chalk.blue(' -----------------------------------'));
        console.log(chalk.cyan('  Starting azk\'s benchmarking tool'));
        console.log(chalk.blue(' -----------------------------------'));
        console.log(chalk.white.italic('   azk_bin_path:'), chalk.bold(azkBenchmark._azk_bin_path));
        console.log(chalk.white.italic('       git-repo:'), chalk.bold(azkBenchmark._opts.git_repo));
        console.log(chalk.white.italic('      dest-path:'), chalk.bold(azkBenchmark._opts.dest_path));
        console.log(chalk.white.italic('        git-ref:'), chalk.bold(azkBenchmark._opts.git_ref));
        console.log(chalk.white.italic('        verbose:'), chalk.bold(azkBenchmark._opts.verbose_level));
        console.log(chalk.white.italic('           send:'), chalk.bold(azkBenchmark._opts.send));

        if (azkBenchmark._opts.send) {
          console.log(chalk.white.italic('keen project id:'), chalk.bold(azkBenchmark._opts.projectId));
        }

        console.log('');
      })
      .then(azkBenchmark.start.bind(azkBenchmark));
  }
}

module.exports = Version;
