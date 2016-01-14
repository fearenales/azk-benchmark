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
      azkBenchmark.initialize();

      h.expect(azkBenchmark.azk_bin_path).to.equal('/usr/bin/azk');
    });

    it("should load env", () => {
      let azkBenchmark = new AzkBenchmark();

      process.env.AZK_BIN_PATH = 'blablabla';
      azkBenchmark.initialize();

      h.expect(azkBenchmark.azk_bin_path).to.equal('blablabla');
    });

  });

});
