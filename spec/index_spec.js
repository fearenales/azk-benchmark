import h from './spec_helper';
import Index from '../../index';

describe('Index:', () => {
  it("should can be called", () => {
    var index = new Index();
    h.expect(index).to.not.be.undefined;
  });
});
