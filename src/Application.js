// TODO: lvl.animate
import animate;

var ANIM_TIME = 2500;
var PI = Math.PI;
// TODO: lvl.random API, random seeds etc.
var random = Math.random;

exports = Class(GC.Application, function () {
  this.initUI = function () {
    // TODO: move to lvl
    import .lvl;
    lvl.initializeWithView(this.view);

    // Sound API Tests
    // var sfx = lvl.resources.loadSound('resources/sounds/v_fever_a.mp3');
    // var music = lvl.resources.loadMusic('resources/sounds/game.mp3');
    // lvl.sounds.playSound(sfx, { volume: 0.5 + 0.5 * Math.random() });
    // lvl.sounds.playMusic(music);

    // Parallax API Tests
    var parallax = lvl.resources.loadParallaxFromJSON('resources/config/spaceParallax.json');
    lvl.bg.add(parallax);

    // lvl.addParallax(forest);
    // lvl.bg.add(forest); // by default get section name 'background'
    // lvl.fg.add(forest); /// by default get section name 'foreground'
    // lvl.fg.add(mist, {sectionName: 'scaryMist'})
    // lvl.bg.autoScrollBy(0, 250); // MAYBE ?


    // Input
    // lvl.input.on("touchstart", function () {});
    // lvl.input.on("touchend", function () {});
    // lvl.input.on("touchmove", function () {});
    // lvl.getActorsAtScreenPosition(x,y) { -- ordered by zIndex, top-most first

    // Actor API Tests
    var dragonSprite = lvl.resources.loadSpriteFromJSON('resources/sprites/serpent/config.json');
    function spawnDragon (i) {
      var dragon = lvl.addActor(dragonSprite);
      dragon.x = lvl.camera.centerX;
      dragon.y = lvl.camera.centerY;
      lvl.setInterval(bind(this, function () {
        var roll = random();
        if (roll < 0.25) {
          lvl.animate(dragon).now({ vx: -500, vy: 0 }, ANIM_TIME, lvl.animate.easeInOut);
          lvl.animate(dragon.view).now({ r: 0 }, ANIM_TIME, lvl.animate.easeInOut);
        } else if (roll < 0.5) {
          lvl.animate(dragon).now({ vx: 500, vy: 0 }, ANIM_TIME, lvl.animate.easeInOut);
          lvl.animate(dragon.view).now({ r: PI }, ANIM_TIME, lvl.animate.easeInOut);
        } else if (roll < 0.75) {
          lvl.animate(dragon).now({ vx: 0, vy: -500 }, ANIM_TIME, lvl.animate.easeInOut);
          lvl.animate(dragon.view).now({ r: PI / 2 }, ANIM_TIME, lvl.animate.easeInOut);
        } else {
          lvl.animate(dragon).now({ vx: 0, vy: 500 }, ANIM_TIME, lvl.animate.easeInOut);
          lvl.animate(dragon.view).now({ r: 3 * PI / 2 }, ANIM_TIME, lvl.animate.easeInOut);
        }
      }), ANIM_TIME);

      // Camera API Tests
      lvl.camera.follow(dragon);
    };

    var dragonCount = 200;
    for (var i = 0; i < dragonCount; i++) {
      spawnDragon(i);
    }

    lvl.camera.followPaddingTop = 25;
    lvl.camera.followPaddingBottom = 25;
    lvl.camera.followPaddingLeft = 50;
    lvl.camera.followPaddingRight = 50;
    lvl.camera.minZoom = 0.01;
    lvl.camera.maxZoom = 1;
  };

  this.launchUI = function () {};

});


// TODO: COLLISION NOTES
// endless runner, you better stay on the screen

// var bounds lvl.addActor(new lvl.Shape({x1,y1,x2,y2}));

// bounds.vx = 400
// bounds.ax = 50
// bounds.fixed = true

// player.collidesWith = function(bounds, collisionResolverCb)

// function(o1, o2) {
//   o1.resolveCollision(o2);
// })



// bounds.defaultCollides = [true] / false

// bounds.removeCollidesWith(...)
// bounds.addCollidesWith(...)

// player.collidesWith([bounds, platforms, dragons, fire]);

// player.onCollision([dragon, fire], function(player, object) {
//   collison.resolve();
// })


// camera.follow(bounds);


// bounds.onBorderCollision(player, function() {
//   resolve(bounds, player);
//   // move player back in box.
// })

// TODO : world / camera / etc bounding rects
