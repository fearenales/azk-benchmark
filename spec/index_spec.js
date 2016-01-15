import h from './spec_helper';
import Index from '../../index';

describe('Index:', () => {
  it("should exist", () => {
    h.expect(Index).to.not.be.undefined;
  });

  it("should can be called", () => {
    var index = new Index();
    h.expect(index).to.not.be.undefined;
  });
});
