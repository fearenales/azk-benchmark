import h from '../spec_helper';
import whichHelper from '../../src/utils/which_helper';

describe('whichHelper:', () => {

  it("should whichHelper get full path", () => {
    return h.expect(whichHelper('sudo')).eventually.match(/sudo/);
  });

  it("should whichHelper get full path", () => {
    return h.expect(whichHelper('NOT-EXISTING-PATH')).eventually.be.rejected;
  });

});
