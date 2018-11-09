"use strict";

const Path = require("path");
const Module = require("module");
const Fs = require("fs");

/////

const orig_findPath = Module._findPath;
const contextExt = "._require_from_path_";
const contextFname = `._hook_${contextExt}`;

Module._findPath = function(request, paths, isMain) {
  return request.endsWith(contextFname)
    ? request
    : orig_findPath.call(Module, request, paths, isMain);
};

Module._extensions[contextExt] = function(module, filename) {
  module._compile("module.exports = require;", filename);
};

/////

const contextMap = new Map();

function requireFromPath(dir, request) {
  let xRequire;
  dir = Path.resolve(dir);
  if (!contextMap.has(dir)) {
    if (!Fs.existsSync(dir)) {
      throw new Error(`require-from-path: dir '${dir}' doesn't exist`);
    }
    xRequire = require(Path.join(dir, contextFname));
    contextMap.set(dir, xRequire);
  } else {
    xRequire = contextMap.get(dir);
  }

  return request ? xRequire(request) : xRequire;
}

module.exports = requireFromPath;