
/* global Vec2f, Phaser, GameData, */

window.addEventListener("load", function () {
    var canvasEl = document.getElementById("game-canvas");
    var hero;
    var indian;
    var cursors;

    var woldSize;
    var map;
    var layer;

    var fireButton;
    var arrow;

    // Sounds
    var walkAudio;
    var arrowFireAudio;
    var bgAudio;
    var indianDieAudio;
    var heroDieAudio;
    var gameOverDiv = document.getElementById('game-over');
    var currentScore;

    gameOverDiv.style.display = 'none';

    // Quando exibirmos a tela de game over vamos permitir reiniciar o jogo
    gameOverDiv.addEventListener('click', function () {
        restart();
        gameOverDiv.style.display = 'none';
    });

    function preload() {

//        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.startSystem(Phaser.Physics.P2JS);

        game.stage.backgroundColor = '#0072bc';

        //  Sprites
        game.load.image('hero', 'assets/images/sprites/hero.png');
        game.load.image('arrow', 'assets/images/sprites/arrow.png');
        game.load.image('indian', 'assets/images/sprites/indian.png');

        // Maps
        game.load.tilemap('desert', 'assets/images/maps/desert.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/images/maps/tmw_desert_spacing.png');

        // Sounds
        game.load.audio('walk', 'assets/audio/effects/hero-walk-2.mp3');
        game.load.audio('hero-die', 'assets/audio/effects/hero-die.mp3');
        game.load.audio('indian-die', 'assets/audio/effects/indian-die.mp3');
        game.load.audio('arrow-fire', 'assets/audio/effects/arrow-fire.mp3');
        game.load.audio('bg', 'assets/audio/loops/simple-bg-1.mp3');

//    game.load.text('html', 'http://phaser.io');
//    game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
//    game.load.audio('sfx', [ 'assets/audio/SoundEffects/squit.mp3', 'assets/audio/SoundEffects/squit.ogg' ]);

    }

    function create() {

        map = game.add.tilemap('desert');
        map.addTilesetImage('Desert', 'tiles');
        woldSize = {x: map.widthInPixels, y: map.heightInPixels};
        woldSize.w = woldSize.x;
        woldSize.h = woldSize.y;
        game.world.setBounds(0, 0, woldSize.w, woldSize.h);
        layer = map.createLayer('Ground');
        layer.resizeWorld();
        layer = map.createLayer('Terrenos');
        layer.resizeWorld();
        layer = map.createLayer('Plantas');
        layer.resizeWorld();

        currentScore = new CustomText(game, game.world.centerX, game.world.centerY, 'Score: '+GameData.instance.current);
        window.currentScore = currentScore;
        game.add.existing(currentScore);


//    //   Here we can check if they are in the cache or not

        //  Load different types of assets in ...
//        game.load.image('hero', 'assets/hero.png');
        window.hero = hero = game.add.sprite(game.world.centerX, game.world.centerY, 'hero');
        hero.anchor.setTo(0.5, 0.5);
        hero.scale.setTo(0.5, 0.5);
        game.physics.p2.enable(hero);
        hero.body._ltype = 'hero';

        createIndian();

//        hero.body.maxVelocity.setTo(200, 200);
        hero.body.collideWorldBounds = true;

        arrow = game.add.weapon(1, 'arrow');
//        arrow.scale.setTo(0.1,0.1);

        arrow._radious = 5;
        arrow.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        arrow.bulletLifespan = 2000;
        arrow.bulletSpeed = 400;
        arrow.trackSprite(hero, 50, 0);
        arrow.trackRotation = true;

        // Sound setup
        walkAudio = game.add.audio("walk");
        walkAudio.allowMultiple = false;

        arrowFireAudio = game.add.audio("arrow-fire");
        arrowFireAudio.allowMultiple = false;
        indianDieAudio = game.add.audio("indian-die");
        indianDieAudio.allowMultiple = false;
        heroDieAudio = game.add.audio("hero-die");
        heroDieAudio.allowMultiple = false;

        // Start bg sound
        bgAudio = game.add.audio('bg');
        bgAudio.allowMultiple = false;
        bgAudio.loopFull();
//    var text = game.cache.checkTextKey('html');
//    var tilemap = game.cache.checkTilemapKey('mario');
//    var audio = game.cache.checkSoundKey('sfx');
//
//    //  Here we'll check for a key that we know doesn't exist on purpose
//    var broken = game.cache.checkImageKey('playerHead');
//
//    game.add.text(40, 40, 'Check Image Key: ' + image, { fill: '#ffffff' });
//    game.add.text(40, 80, 'Check Text Key: ' + text, { fill: '#ffffff' });
//    game.add.text(40, 120, 'Check Tilemap Key: ' + tilemap, { fill: '#ffffff' });
//    game.add.text(40, 160, 'Check Audio Key: ' + audio, { fill: '#ffffff' });
//    game.add.text(40, 200, 'Check Image 2 Key: ' + broken, { fill: '#ffffff' });
        game.camera.follow(hero);
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        // weapon configuration
        arrow.onFire.add(function () {
            arrowFireAudio.play();
        }, this);

        hero.body.onBeginContact.add(heroCntcCallBack, this);


    }

    function heroCntcCallBack(body1, body2) {
        if (!heroDieAudio.isPlaying) {
            heroDieAudio.play();
            game.paused = true;
            document.getElementById('current').innerHTML = '' + GameData.instance.current;
            document.getElementById('record').innerHTML = '' + GameData.instance.record;
            gameOverDiv.style.display = 'block';
            GameData.instance.die();
        }
    }

    /**
     * 
     * @returns {Vec2f}
     */
    function randomPos() {
//        var p = new Vec2f();
//        p.x = hero.position.y + 300;
//        p.y = hero.position.x + 300;

        var p = new Vec2f();
        p.x = Math.floor((Math.random() * woldSize.x) + 1);
        p.y = Math.floor((Math.random() * woldSize.y) + 1);
        return p;
    }

    function randomDir() {
        var dir = Math.floor((Math.random() * 360) + 1);
        return dir;
    }


    function createIndian() {
        var p = randomPos();
        window.indian = indian = game.add.sprite(p.x, p.y, 'indian');

        game.physics.p2.enable(indian);
        indian._radious = 25;
        indian.anchor.setTo(0.5, 0.5);
        indian.scale.setTo(0.5, 0.5);

        indian.body.rotation = randomDir();
        indian.maxVelocity = 150;
        indian.body._ltype = 'indian';
//        indian

    }


    function update() {
        hero.body.setZeroVelocity();
        var walking = false;
//        
        if (cursors.left.isDown) {
//            hero.body.rotation -= Math.toRadians(15 * game.time.totalElapsedSeconds()); // Arcade
            walking = true;
            hero.body.rotateLeft(100); // p2
        } else if (cursors.right.isDown) {
//            hero.body.rotation += Math.toRadians(15 * game.time.totalElapsedSeconds());

            walking = true;
            hero.body.rotateRight(100); // p2
        } else {
            hero.body.setZeroRotation();
        }
//
        if (cursors.up.isDown) {
            walking = true;
            var v = new Vec2f.fromRad(hero.body.rotation);
            v.normalize();
            v.multiply(200);
            hero.body.velocity.x = v.x;
            hero.body.velocity.y = v.y;
//            game.physics.arcade.accelerationFromRotation(hero.rotation, 10000, hero.body.acceleration);
        } else if (cursors.down.isDown) {
            walking = true;
            var v = new Vec2f.fromRad(hero.body.rotation);
            v.normalize();
            v = v.negative();
            v.multiply(100);
            hero.body.velocity.x = v.x;
            hero.body.velocity.y = v.y;
//            game.physics.arcade.accelerationFromRotation(hero.rotation, -5000, hero.body.acceleration);
        } else {
//            hero.body.acceleration.set(0);
//            hero.body.velocity.set(0);
        }
        if (walking && !walkAudio.isPlaying) {
            walkAudio.loopFull(0.4);
//            walkAudio.isPlaying = true;
        } else if (!walking && walkAudio.isPlaying) {
            walkAudio.stop();
        }

        //     console.log(hero.body.velocity);
        if (fireButton.isDown) {
            //            arrow.body.rotation = heroSprite.body.rotation;
            arrow.fire();
        }
        checkArrowCollision();
        accelerateToObject(indian, hero);
        currentScore.position.x = game.camera.position.x + game.camera.view.width - 70;
        currentScore.position.y = game.camera.position.y + 30;
    }

    function checkArrowCollision() {

        if (indian && arrow.bullets.children.length > 0) {
            var bulletPos = arrow.bullets.children[0].position;
            bulletPos = new Vec2f(bulletPos.x, bulletPos.y);
            var indianPos = new Vec2f(indian.position.x, indian.position.y);
            if (indianPos.distance(bulletPos) <= (indian._radious + arrow._radious)) {
                if (!indianDieAudio.isPlaying) {
                    indianDieAudio.play();
                    game.physics.p2.removeBody(indian.body);
                    indian.destroy();
                    GameData.instance.increase();
                    currentScore.text = "Score: "+GameData.instance.current;
                    createIndian(indian);
                }
            }
        }
    }
    function accelerateToObject(obj1, obj2, speed, maxSpeed) {
        if (typeof speed === 'undefined') {
            speed = 60;
        }

        if (typeof maxSpeed === 'undefined') {
            maxSpeed = 120;
        }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + game.math.degToRad(0);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
        obj1.body.force.y = Math.sin(angle) * speed;
        var vel = new Vec2f(obj1.body.velocity.x, obj1.body.velocity.y);

        if (vel.length() > maxSpeed) {
            vel.normalize().multiply(maxSpeed);
        }
    }

    function render() {
        game.debug.spriteInfo(indian, 600, 500);
        game.debug.spriteInfo(hero, 32, 32);

    }

    function  restart() {
        bgAudio.stop();
        game.state.start('principal');
        game.paused = false;
    }

    var CustomText = function (game, x, y, text) {

        Phaser.Text.call(this, game, x, y, text, {font: "15px Arial", fill: "#ff0044", align: "center"});

        this.anchor.set(0.5);

        this.rotateSpeed = 1;

    };

    CustomText.prototype = Object.create(Phaser.Text.prototype);
    CustomText.prototype.constructor = CustomText;

    var principalState = {preload: preload, create: create, update: update, render: render};
    var game = new Phaser.Game(canvasEl.offsetWidth, canvasEl.offsetHeight, Phaser.CANVAS, 'game-canvas', null, false, true, {p2: true});
    window.game = game;
    game.state.add('principal', principalState);
    game.state.start('principal');

});