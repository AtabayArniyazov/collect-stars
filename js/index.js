
const game = new Phaser.Game(1200, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });


function preload() {
	game.load.image('sky', 'img/bgMain.png');
	game.load.image('ground', 'img/ground.png');
	game.load.image('star', 'img/star.png');
	game.load.atlas('dude', 'img/dude_sprite.png', 'img/dude_sprite.json');
}

let player;
let playerWay = false;	//false == right, true == left
let platforms;
let cursors;
let stars;
let score = 0;
let scoreText;

function create() {
	// ------------------------
	game.add.tileSprite(0, 0, 10000, 600, 'sky');
	game.world.setBounds(0, 0, 10000, 600);
	// ------------------------
	game.physics.startSystem(Phaser.Physics.ARCADE);

	platforms = game.add.group();
	platforms.enableBody = true;

	for (var i = 0, j = 0; i < game.world.width/500; i++, j+=500) {	//500 - it is width of ground
		let ground = platforms.create(j, game.world.height - 40, 'ground');
		ground.body.immovable = true;
	}


	// let ledge = platforms.create(700, 400, 'ground');
	// ledge.scale.setTo(-0.08, 1)
	// ledge.body.immovable = true;

	// ledge = platforms.create(500, 430, 'ground');
	// ledge.scale.setTo(-0.08, 1)
	// ledge.body.immovable = true;

	// ledge = platforms.create(300, 430, 'ground');
	// ledge.scale.setTo(-0.08, 1)
	// ledge.body.immovable = true;

	// ledge = platforms.create(100, 430, 'ground');
	// ledge.scale.setTo(-0.08, 1)
	// ledge.body.immovable = true;

	// ledge = platforms.create(600, 200, 'ground');
	// ledge.scale.setTo(-0.08, 1)
	// ledge.body.immovable = true;

	// ledge = platforms.create(400, 200, 'ground');
	// ledge.scale.setTo(-0.08, 1)
	// ledge.body.immovable = true;

	// ledge = platforms.create(200, 200, 'ground');
	// ledge.scale.setTo(-0.08, 1)
	// ledge.body.immovable = true;

	// ledge = platforms.create(20, 200, 'ground');
	// ledge.scale.setTo(-0.08, 1)
	// ledge.body.immovable = true;

	// ledge = platforms.create(400, 100, 'ground');
	// ledge.body.immovable = true;


	player = game.add.sprite(15, game.world.height - 200, 'dude');
	player.scale.setTo(0.15, 0.15);
	game.physics.arcade.enable(player);

	// player.body.bounce.y = 0.2;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;

	player.animations.add('runLeft', Phaser.Animation.generateFrameNames('runL_', 1, 8), 10, true);
	player.animations.add('runRight', Phaser.Animation.generateFrameNames('runR_', 1, 8), 10, true);
	player.animations.add('idleRight', Phaser.Animation.generateFrameNames('idleR_', 1, 10), 15, true);
	player.animations.add('idleLeft', Phaser.Animation.generateFrameNames('idleL_', 1, 10), 15, true);
	player.animations.add('jumpRight', Phaser.Animation.generateFrameNames('jumpR_', 1, 10), 5, true);
	player.animations.add('jumpLeft', Phaser.Animation.generateFrameNames('jumpL_', 1, 10), 5, true);
	player.animations.add('meleeRight', Phaser.Animation.generateFrameNames('meleeR_', 1, 7), 5, true);
	player.animations.add('meleeLeft', Phaser.Animation.generateFrameNames('meleeL_', 1, 7), 5, true);
	player.animations.add('shootRight', Phaser.Animation.generateFrameNames('shootR_', 1, 3), 5, true);
	player.animations.add('shootLeft', Phaser.Animation.generateFrameNames('shootL_', 1, 3), 5, true);
	player.animations.add('deadRight', Phaser.Animation.generateFrameNames('deadR_', 1, 10), 5, true);
	player.animations.add('deadLeft', Phaser.Animation.generateFrameNames('deadL_', 1, 10), 5, true);


	stars = game.add.group();
	stars.enableBody = true;

	for (var i = 0; i < game.world.width/70; i++) {
		let star = stars.create(i * 70, 0, 'star');
		star.body.gravity.y = 300;
		star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}

	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

	cursors = game.input.keyboard.createCursorKeys();


	game.canvas.oncontextmenu = function (event) {
		event.preventDefault (); 
	}

	// --------------------
	game.camera.follow(player);
	// --------------------

}

function update() {
	let hitPlatform = game.physics.arcade.collide(player, platforms);

	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	
	player.body.velocity.x = 0;

	if (cursors.left.isDown) {
		player.body.velocity.x = -150;
		playerWay = true;

		if (cursors.up.isDown) {
			player.animations.play('jumpLeft');
		} else {
			player.animations.play('runLeft');
		}

	} else if (cursors.right.isDown) {
		player.body.velocity.x = 150;
		playerWay = false;

		if (cursors.up.isDown) {
			player.animations.play('jumpRight');
		} else {
			player.animations.play('runRight');
		}

	} else if (cursors.up.isDown) {

		if (playerWay) {
			player.animations.play('jumpLeft');
		} else {
			player.animations.play('jumpRight');
		}

	} else if (cursors.down.isDown) {

	} else {

		if (!player.body.touching.down && !hitPlatform) {

			if (playerWay) {
				player.animations.play('jumpLeft');
			} else {
				player.animations.play('jumpRight');
			}
		} else {

			if (playerWay) {
				player.animations.play('idleLeft');
			} else {
				player.animations.play('idleRight');
			}
		}
	}

	if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
		player.body.velocity.y = -250;
	}


}

function collectStar(player, star) {
	star.kill();
	score += 10;
	scoreText.text = 'Score: ' + score;
}


// -----------------------------
function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}
// -----------------------------