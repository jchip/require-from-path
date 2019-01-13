const Path = require("path");
const Fs = require("fs");
const requireFromPath = require("../..");
const chai = require("chai");

describe("require-from-path", function() {
  it("should be able to require at another dir as relative dir", () => {
    const appRequire = requireFromPath("test/fixtures/app");
    const foo = appRequire("foo");
    chai.expect(appRequire.resolve("foo")).contains("test/fixtures/app/node_modules/foo/index.js");
    chai.expect(foo).to.equal("foo");
    chai.expect(appRequire.resolve.paths("foo")).to.be.an.array;
  });

  it("should be able to require at another dir as absolute dir", () => {
    const appRequire = requireFromPath(Path.resolve("test/fixtures/app"));
    const foo = appRequire("foo");
    chai.expect(foo).to.equal("foo");
  });

  it("should throw if directory doesn't exist", () => {
    chai.expect(() => requireFromPath("foo/fixtures/app")).to.throw();
  });

  it("should throw if 2nd dir check is not a directory", () => {
    const ss = Fs.statSync;
    Fs.statSync = () => {
      return {
        isDirectory() {
          return false;
        }
      };
    };

    chai.expect(() => requireFromPath("foo/fixtures/app")).to.throw("not a directory");
    Fs.statSync = ss;
  });

  it("should require a file directly if passed", () => {
    const foo = requireFromPath("test/fixtures/app", "foo");
    chai.expect(foo).to.equal("foo");
  });

  it("should auto dirname on a file that's passed", () => {
    const foo = requireFromPath("test/fixtures/app/bar.js", "foo");
    chai.expect(foo).to.equal("foo");
  });
});
