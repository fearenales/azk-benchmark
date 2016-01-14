import h from './spec_helper';
import AzkBenchmark from '../src/azk_benchmark';

describe('AzkBenchmark:', () => {

  it("should AzkBenchmark exists", () => {
    h.expect(AzkBenchmark).to.not.be.undefined;
  });

  describe('initialize():', () => {

    it("should load default value when env is not present", () => {
      let azkBenchmark = new AzkBenchmark();

      delete process.env.AZK_BIN_PATH;
      delete process.env.ADOCKER_BIN_PATH;
      return azkBenchmark.initialize()
      .then(() => {
        h.expect(azkBenchmark.azk_bin_path).to.equal('/usr/lib/azk/bin/azk');
        h.expect(azkBenchmark.adocker_bin_path).to.equal('/usr/lib/azk/bin/adocker');
      });
    });

    it("should load env", () => {
      let azkBenchmark = new AzkBenchmark();

      process.env.AZK_BIN_PATH     = 'blim';
      process.env.ADOCKER_BIN_PATH = 'blom';
      return azkBenchmark.initialize()
      .then(() => {
        h.expect(azkBenchmark.azk_bin_path).to.equal('blim');
        h.expect(azkBenchmark.adocker_bin_path).to.equal('blom');
      });
    });

    it("should be true if all exists", () => {
      let azkBenchmark = new AzkBenchmark();
      // this is not azk folder
      process.env.AZK_BIN_PATH = __filename;
      process.env.ADOCKER_BIN_PATH = __filename;

      return azkBenchmark.initialize()
      .then((results) => {
        h.expect(results).to.deep.equal(true);
      });
    });

    it("should be false if any is false", () => {

      let azkBenchmark = new AzkBenchmark();
      // this is not azk folder
      process.env.AZK_BIN_PATH = 'NOT EXISTS';
      process.env.ADOCKER_BIN_PATH = __filename;

      return azkBenchmark.initialize()
      .then((results) => {
        h.expect(results).to.deep.equal(false);
      });
    });

  });

});
