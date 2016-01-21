import h from './spec_helper';
import AzkBenchmark from '../src/benchmark/azk_benchmark';

describe('AzkBenchmark:', () => {

  it('should azk_bin_path have a value', () => {
    let instantiate = () => {
      new AzkBenchmark({ azk_bin_path: 'something not null' });
    };
    return h.expect(instantiate).to.not.throw(Error);
  });

  it('should azk_bin_path throw if undefined/null', () => {
    let instantiate = () => {
      new AzkBenchmark({ azk_bin_path: null });
    };
    return h.expect(instantiate).to
      .throw(Error, /azk_bin_path \(.*?\) cannot be null\/undefined/);
  });

});
