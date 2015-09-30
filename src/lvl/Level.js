import animate;

// XXX: TODO: FIXME: COMPILER BUG
jsio('import .resource', { context: { backend: backend } });
jsio('import .resource');
jsio('import .sound', { context: { backend: backend } });
jsio('import .sound');
jsio('import .shape', { context: { backend: backend } });
jsio('import .shape');
jsio('import .physics', { context: { backend: backend } });
jsio('import .physics');
jsio('import .Actor', { context: { backend: backend } });
jsio('import .Actor');
jsio('import .Scenery', { context: { backend: backend } });
jsio('import .Scenery');
jsio('import .UI', { context: { backend: backend } });
jsio('import .UI');
jsio('import .Camera', { context: { backend: backend } });
jsio('import .Camera');
jsio('import .Input', { context: { backend: backend } });
jsio('import .Input');
jsio('import .Input', { context: { backend: backend } });
jsio('import .Input');



// update timers each tick
var timerUID = 0;
var timers = {};
backend.onTick(function (dt) {
  for (var key in timers) {
    timers[key].tick(dt);
  }
});



var Level = Class("Level", function () {
  var lvl;

  this.init = function () {
    lvl = this;

    // attach library modules
    this.resource = resource;
    this.sound = sound;
    this.shape = shape;
    this.physics = physics;
    Actor.setPhysics(physics);

    // attach special class instances and singletons
    this.bg = new Scenery('background');
    this.fg = new Scenery('foreground');
    this.ui = UI;
    this.camera = Camera;
    this.input = Input;

    // collideable bounds that stick to the screen (camera viewport edges)
    this.bounds = {};
    this.bounds.screenTop = shape.createRect({ fixed: true });
    this.bounds.screenRight = shape.createRect({ fixed: true });
    this.bounds.screenBottom = shape.createRect({ fixed: true });
    this.bounds.screenLeft = shape.createRect({ fixed: true });
    updateScreenBounds();
    backend.onTick(updateScreenBounds);
    // add easy default shortcuts for screen bounds events
    this.physics.createEventHandlerShortcut('top', this.bounds.screenTop);
    this.physics.createEventHandlerShortcut('right', this.bounds.screenRight);
    this.physics.createEventHandlerShortcut('bottom', this.bounds.screenBottom);
    this.physics.createEventHandlerShortcut('left', this.bounds.screenLeft);
  };

  this.reset = function () {
    // TODO: reset backend first, then reset lvl API
    throw new Error("TODO");
  };

  this.addActor = function (resource, opts) {
    var type = resource.getType();
    if (type === 'sprite' || type === 'image') {
      return new Actor(resource, opts);
    } else {
      throw new Error("Invalid Resource Type for Actor:", type);
    }
  };

  this.addGroup = function () {
    throw new Error("TODO");
  };

  this.addParallax = function (resource) {
    throw new Error("TODO");
  };

  // TODO: devkit should limit global tick to ~100 ms max! BIG TICKS BREAK STUFF

  // TODO: track and clear all animations on reset?
  this.animate = animate;

  this.setTimeout = function (callback, duration) {
    var timer = new EventTimer(callback, duration, 'timeout');
    return timer.uid;
  };

  this.clearTimeout = function (id) {
    var timer = timers[id];
    timer && timer.unregister();
  };

  this.setInterval = function (callback, duration) {
    var timer = new EventTimer(callback, duration, 'interval');
    return timer.uid;
  };

  this.clearInterval = function (id) {
    var timer = timers[id];
    timer && timer.unregister();
  };

  // ordered by zIndex, top-most first
  this.getActorsAtScreenPosition = function (x, y) {
    throw new Error("TODO");
  };

  function updateScreenBounds () {
    var x = lvl.camera.getViewportX();
    var y = lvl.camera.getViewportY();
    var w = lvl.camera.getViewportWidth();
    var h = lvl.camera.getViewportHeight();

    lvl.bounds.screenTop.x = x - w;
    lvl.bounds.screenTop.y = y - h;
    lvl.bounds.screenTop.width = 3 * w;
    lvl.bounds.screenTop.height = h;

    lvl.bounds.screenRight.x = x + w;
    lvl.bounds.screenRight.y = y - h;
    lvl.bounds.screenRight.width = w;
    lvl.bounds.screenRight.height = 3 * h;

    lvl.bounds.screenBottom.x = x - w;
    lvl.bounds.screenBottom.y = y + h;
    lvl.bounds.screenBottom.width = 3 * w;
    lvl.bounds.screenBottom.height = h;

    lvl.bounds.screenLeft.x = x - w;
    lvl.bounds.screenLeft.y = y - h;
    lvl.bounds.screenLeft.width = w;
    lvl.bounds.screenLeft.height = 3 * h;
  };
});

// singleton Level API
exports = new Level();



// event timer class for tracking setTimeout, setInterval etc.
var EventTimer = Class("EventTimer", function () {
  this.init = function (callback, duration, type) {
    this.callback = callback;
    this.duration = duration;
    this.type = type;
    this.elapsed = 0;
    this.uid = timerUID++;
    this.register();
  };

  this.register = function () {
    timers[this.uid] = this;
    return this.uid;
  };

  this.unregister = function () {
    delete timers[this.uid];
  };

  this.tick = function (dt) {
    this.elapsed += dt;
    if (this.elapsed >= this.duration) {
      this.callback();
      if (this.type === 'interval') {
        this.elapsed -= this.duration;
      } else {
        this.unregister();
      }
    }
  };
});
