const assert = require('node:assert/strict')
const { sum } = require('./Index.js')

describe("sum", () => {
  it("should add 1 + 2 to equal 3", () => {
    assert.equal(sum(1, 2), 3);
  });

  it("should add 0.1 + 0.2 to equal 0.3", () => {
    assert.equal(sum(0.1, 0.2), 0.3);
  });
});