import { CliController } from 'cli-router';
import AzkBenchmark from '../../azk_benchmark';

class Version extends CliController {
  index(params) {
    let azkBenchmark = new AzkBenchmark();
    azkBenchmark.initialize();
    return azkBenchmark.start(params.send);
  }
}

module.exports = Version;
