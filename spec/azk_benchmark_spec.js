import h from './spec_helper';
import AzkBenchmark from '../src/benchmark/azk_benchmark';

describe('AzkBenchmark:', () => {

  it("should AzkBenchmark exists", () => {
    h.expect(AzkBenchmark).to.not.be.undefined;
  });

  describe('initialize():', () => {

    it("should _getAzkPath use azk_bin_path argument given", () => {
      let azkBenchmark = new AzkBenchmark({
        azk_bin_path: 'sudo'
      });

      return azkBenchmark._getAzkPath().then((azk_path) => {
        h.expect(azk_path).to.match(/sudo/);
      });
    });

    it("should _getAzkPath use default if argument is missing", () => {
      let azkBenchmark = new AzkBenchmark({
        azk_bin_path: undefined
      });

      return azkBenchmark._getAzkPath().then((azk_path) => {
        h.expect(azk_path).to.match(/^\/.*\/azk$/);
      });
    });

    it("should return erro ir azk not found", () => {
      let azkBenchmark = new AzkBenchmark({
        azk_bin_path: `foobarazk_not_found`,
      });

      let result = azkBenchmark._getAzkPath();
      return h.expect(result).to.rejectedWith(/not found in PATH/);
    });
  });

});
