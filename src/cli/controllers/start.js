import { CliController } from 'cli-router';
import AzkBenchmark from '../../benchmark/azk_benchmark';

class Version extends CliController {
  index(params) {
    let azkBenchmark = new AzkBenchmark({
      azk_bin_path: params.azk_bin_path,
      git_repo: params['git-repo']   || 'azukiapp/azkdemo',
      dest_path: params['dest-path'] || '/tmp/azkdemo_benchmark',
      git_ref: params['git-ref']     || 'benchmark',
      send: params.send,
      verbose_level: params.verbose,
    });
    return azkBenchmark.initialize()
      .then(azkBenchmark.start.bind(azkBenchmark));
  }
}

module.exports = Version;
