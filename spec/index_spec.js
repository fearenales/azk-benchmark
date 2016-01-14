import h from './spec_helper';
import Index from '../../index';

describe('Index:', () => {
  it("should Index exists", () => {
    h.expect(Index).to.not.be.undefined;
  });
});
