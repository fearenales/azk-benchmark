import { CliController } from 'cli-router';
import AzkBenchmark from '../../azk_benchmark';

class Version extends CliController {
  index() {
    let azkBenchmark = new AzkBenchmark();
    azkBenchmark.initialize();
    return azkBenchmark.start();
  }
}

module.exports = Version;
