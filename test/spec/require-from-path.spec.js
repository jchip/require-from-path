const Path = require("path");
const requireFromPath = require("../..");
const chai = require("chai");

describe("require-from-path", function() {
  it("should be able to require at another dir as relative dir", () => {
    const appRequire = requireFromPath("test/fixtures/app");
    const foo = appRequire("foo");
    chai.expect(foo).to.equal("foo");
  });

  it("should be able to require at another dir as absolute dir", () => {
    const appRequire = requireFromPath(Path.resolve("test/fixtures/app"));
    const foo = appRequire("foo");
    chai.expect(foo).to.equal("foo");
  });

  it("should throw if directory doesn't exist", () => {
    chai.expect(() => requireFromPath("foo/fixtures/app")).to.throw();
  });

  it("should require a file directly if passed", () => {
    const foo = requireFromPath("test/fixtures/app", "foo");
    chai.expect(foo).to.equal("foo");
  });
});
