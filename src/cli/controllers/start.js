import { CliController } from 'cli-router';
import AzkBenchmark from '../../azk_benchmark';

class Version extends CliController {
  index(params) {
    let azkBenchmark = new AzkBenchmark({
      send: params.send,
      azk_bin_path: params.azk_bin_path,
    });

    return azkBenchmark.initialize()
      .then(azkBenchmark.start);
  }
}

module.exports = Version;
