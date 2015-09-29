
var Resource = exports = Class("Resource", function () {
  this.init = function (fullPath, type, opts) {
    this._fullPath = fullPath || '';
    this._type = type || '';
    this._opts = opts || {};
  };

  this.getOpts = function () {
    return this._opts;
  };

  this.getShapeConfig = function () {
    if (this._type === 'parallax') {
      throw new Error("Resources of type parallax cannot have a shape!");
    } else {
      return this._opts.shape;
    }
  };

  this.getViewConfig = function () {
    if (this._type === 'parallax') {
      return this._opts;
    } else {
      return this._opts.view;
    }
  };

  this.loadOptsFromJSONFullPath = function () {
    var newOpts = backend.readJSON(this._fullPath);
    merge(this._opts, newOpts);
  };

  this.getFullPath = function () {
    return this._fullPath;
  };

  this.getType = function () {
    return this._type;
  };
});