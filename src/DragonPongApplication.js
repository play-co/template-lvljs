// TODO: clean up GC.Application / lvl imports situation
var lvl;
exports = Class(GC.Application, function () {
  this.initUI = function () { lvl = jsio('import .lvl'); };
  this.launchUI = function () { startGame(); };
});



var PI = Math.PI;
var min = Math.min;
var max = Math.max;
var floor = Math.floor;
var random = Math.random;

var BG_WIDTH = 576;
var BG_HEIGHT = 1024;
var PLAYER_VX = 280;
var PLAYER_JUMP_VY = -600;
var GRAVITY = 1500;
var SPEAR_SLOTS = 7;
var SPEAR_MARGIN = 150;
var SPEAR_SPACING = (BG_HEIGHT - SPEAR_MARGIN * 2) / (SPEAR_SLOTS - 1);
var SPEAR_LENGTH = 90;
var DIFFICULTY_STEP = 0.05;
var DIFFICULTY_MAX = 1;
var PARALLAX_URL = 'resources/config/dragonpong/parallax.json';
var PLAYER_URL = 'resources/config/dragonpong/player.json';
var SPEAR_URL = 'resources/config/dragonpong/spear.json';
var SCORE_URL = 'resources/config/dragonpong/score.json';
var GAME_OVER_URL = 'resources/config/dragonpong/gameOver.json';

function startGame () {
  // set letter-boxed viewport; TODO: get 3:4 aspect ratio art
  lvl.camera.setCustomViewportDimensions(BG_WIDTH, BG_HEIGHT, true);

  // add background parallax
  var parallaxResource = lvl.resource.loadParallaxFromJSON(PARALLAX_URL);
  lvl.bg.add(parallaxResource);

  // add score text to our UI
  var scoreResource = lvl.resource.loadImageTextFromJSON(SCORE_URL);
  var scoreText = lvl.ui.add(scoreResource, { hAlign: 'center', vAlign: 'top' });
  var score = 0;
  scoreText.setText(score);

  // load sounds and music
  var music = lvl.resource.loadMusic('resources/sounds/bgm_fever.mp3');
  lvl.sound.playMusic(music, { volume: 0.5 });
  // TODO: support multi-source sfx (sound manifest JSON)
  var flapSFX1 = lvl.resource.loadSound('resources/sounds/flap_a.mp3');
  var flapSFX2 = lvl.resource.loadSound('resources/sounds/flap_b.mp3');
  var flapSFX3 = lvl.resource.loadSound('resources/sounds/flap_c.mp3');
  var flapSFX = [flapSFX1, flapSFX2, flapSFX3];
  var spearSFX1 = lvl.resource.loadSound('resources/sounds/hit_a.mp3');
  var spearSFX2 = lvl.resource.loadSound('resources/sounds/hit_b.mp3');
  var spearSFX3 = lvl.resource.loadSound('resources/sounds/hit_c.mp3');
  var spearSFX = [spearSFX1, spearSFX2, spearSFX3];

  // load game over art for later
  var gameOverResource = lvl.resource.loadImageFromJSON(GAME_OVER_URL);

  // subscribe to player touch events
  lvl.input.on('touchstart', onTouchStart);

  // add the player to the game
  var playerResource = lvl.resource.loadSpriteFromJSON(PLAYER_URL);
  var player = lvl.addActor(playerResource);

  // add obstacles to the game
  var spearResource = lvl.resource.loadImageFromJSON(SPEAR_URL);
  var spears = lvl.addGroup('spears');
  var difficulty = 0;
  var gameOver = false;

  // set up player collision handlers
  player.collidesWith('left', onPlayerHitWall);
  player.collidesWith('right', onPlayerHitWall);
  player.collidesWith('top', onGameOver);
  player.collidesWith('bottom', onGameOver);
  player.collidesWith(spears, onGameOver);

  function onTouchStart (touch) {
    if (gameOver) { return; }
    if (player.vx === 0) {
      player.vx = PLAYER_VX;
      player.ay = GRAVITY;
    }
    player.vy = PLAYER_JUMP_VY;
    player.startSprite("fly");
    lvl.sound.playSound(flapSFX[~~(random() * flapSFX.length)], { volume: 0.3 });
  };

  function onPlayerHitWall (player, wall) {
    var currDir = player.vx > 0 ? 1 : -1;
    var newDir = wall === lvl.bounds.screenRight ? -1 : 1;
    if (newDir === currDir) { return; }
    player.vx = newDir * PLAYER_VX;
    player.view.flipX = newDir > 0;
    difficulty = min(DIFFICULTY_MAX, difficulty + DIFFICULTY_STEP);
    hideSpears();
    spawnSpears(newDir);
    scoreText.setText(++score);
    lvl.effect.squish(scoreText, { duration: 350, magnitude: 2 });
  };

  function spawnSpears (direction) {
    var flipped = direction < 0;
    var spearPositions = [];
    var count = floor(difficulty * (SPEAR_SLOTS - 2)) + 1;
    for (var i = 0; i < SPEAR_SLOTS; i++) {
      spearPositions[i] = gameOver ? true : i < count;
    }
    lvl.util.shuffle(spearPositions);
    for (var i = 0; i < SPEAR_SLOTS; i++) {
      if (spearPositions[i]) {
        var spear = lvl.addActor(spearResource, { group: spears });
        spear.view.flipX = flipped;
        spear.view.anchorX *= flipped ? -1 : 1;
        spear.x = flipped
          ? lvl.camera.left - spear.view.width
          : lvl.camera.right;
        spear.y = SPEAR_MARGIN + i * SPEAR_SPACING;
        animateSpear(spear, false);
      }
    }
  };

  function hideSpears () {
    spears.forEach(function (spear) { animateSpear(spear, true); });
  };

  function animateSpear (spear, destroy) {
    var direction = (destroy ? -1 : 1) * (spear.view.flipX ? -1 : 1);
    var easing = destroy ? lvl.animate.easeIn : lvl.animate.easeOut;
    var length = gameOver ? spear.view.width : SPEAR_LENGTH;
    // shake the spear as if it's embedding into a wall
    if (!destroy) {
      lvl.sound.playSound(spearSFX[~~(random() * spearSFX.length)]);
      lvl.effect.quiver(spear, {
        magnitude: (0.175 + 0.075 * random()) * (random() < 0.5 ? 1 : -1),
        duration: 500 + 250 * random()
      });
    }
    // animate the spear onto the screen horizontally
    lvl.animate(spear)
      .now({ x: spear.x - length * direction }, 400, easing)
      .then(function () { destroy && spear.destroy(); });
  };

  function onGameOver () {
    if (gameOver) { return; }
    // TODO: death particle effect explosion
    gameOver = true;
    player.destroy();
    lvl.effect.shake(lvl.root);

    // show spears on all sides
    hideSpears();
    spawnSpears(-1);
    spawnSpears(1);

    // animate game over text and then reset the game
    var gameOverText = lvl.ui.add(gameOverResource, {
      scale: 0,
      hAlign: 'center',
      vAlign: 'center'
    });
    lvl.animate(gameOverText)
      .now({ scale: 1.4 }, 800, lvl.animate.easeOutBounce)
      .wait(1200)
      .then(hideSpears)
      .then({ scale: 0 }, 500, lvl.animate.easeOut)
      .then(function () {
        // TODO: startGame moves into lvl?
        lvl.reset();
        startGame();
      });
  };
};