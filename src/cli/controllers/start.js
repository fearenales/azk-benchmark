import { CliController } from 'cli-router';
import AzkBenchmark from '../../azk_benchmark';

class Version extends CliController {
  index(params) {
    let azkBenchmark = new AzkBenchmark({
      send: params.send,
      azk_bin_path: params.azk_bin_path,
      verbose_level: params.verbose,
    });
    return azkBenchmark.initialize()
      .then(azkBenchmark.start.bind(azkBenchmark))
      .then(() => 'finished');
  }
}

module.exports = Version;
