var lvl;

var BG_WIDTH = 576;
var BG_HEIGHT = 1024;
var PARALLAX_URL = 'resources/config/dragonPongParallax.json';
var PLAYER_URL = 'resources/config/dragonPongPlayer.json';

exports = Class(GC.Application, function () {
  this.initUI = function () {
    lvl = jsio('import .lvl');
    lvl.initializeWithView(this.view);
  };

  this.launchUI = function () {
    startGame();
  };
});

var PI = Math.PI;
var random = Math.random;

function startGame () {
  // set letter-boxed viewport; TODO: get 3:4 aspect ratio art
  lvl.camera.setCustomViewportDimensions(BG_WIDTH, BG_HEIGHT, true);

  // add background parallax
  var parallaxResource = lvl.resources.loadParallaxFromJSON(PARALLAX_URL);
  lvl.bg.add(parallaxResource);

  // subscribe to player touch events
  lvl.input.on('touchstart', onTouchStart);

  // add the player to the game
  var playerResource = lvl.resources.loadSpriteFromJSON(PLAYER_URL);
  lvl.addActor(playerResource);
};

function onTouchStart (touch) {
  logger.log('TOUCH START:', touch.x, touch.y, touch.id);
};
