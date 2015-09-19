// XXX: TODO: FIXME: COMPILER BUG
jsio('import .Actor', { context: { backend: backend } });
jsio('import .Actor');
jsio('import .Scenery', { context: { backend: backend } });
jsio('import .Scenery');
jsio('import .UI', { context: { backend: backend } });
jsio('import .UI');
jsio('import .Camera', { context: { backend: backend } });
jsio('import .Camera');

var Level = Class("Level", function () {
  this.init = function () {
    this.bg = new Scenery('background');
    this.fg = new Scenery('foreground');
    this.ui = new UI();
    this.camera = new Camera();
  };

  // TODO: remove / fix this
  this.initializeWithView = function (view) {
    this._view = view;
  };

  this.addActor = function (resource, geometryOverrides) {
    var type = resource.getType();
    if (type === 'sprite' || type === 'image') {
      return new Actor(resource, geometryOverrides);
    } else {
      throw new Error("Invalid Resource Type for Actor:", type);
    }
  };

  this.addParallax = function (resource) {
    throw new Error("TODO");
  };

  this.setTimeout = function () {
    throw new Error("TODO");
  };

  this.setInterval = function () {
    throw new Error("TODO");
  };

  // TODO: move this concept / API to camera viewport
  this.setFullScreenDimensions = function (width, height) {
    backend.setFullScreenDimensions(width, height);
  };

  // TODO: move this concept / API to camera viewport
  this.setCustomDimensions = function (width, height, scale) {
    backend.setCustomDimensions(width, height, scale);
  };
});

// singleton Level API
exports = new Level();
