var config = {
    type: Phaser.AUTO,
    width: 320,
    height: 480,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Is Character Attacking
var alice_attack = false;

// Input Holders
var cursors;
var keyW;
var keyS;

// Last Direction Trakers
var direction1;
var direction2;

// Score Holders
alice_score = 0;
reimu_score = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('background', 'assets/black.jpg');
    this.load.image('pongbar', 'assets/reimu.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('alice_score', 'assets/alice_doll.png');

    // Alice Animation Spritesheets
    this.load.spritesheet('alice_dashL', 'assets/alice_dash_left.png', {frameWidth: 76, frameHeight: 91});
    this.load.spritesheet('alice_dashR', 'assets/alice_dash_right.png', {frameWidth: 76, frameHeight: 91});
    this.load.spritesheet('alice_idleL', 'assets/alice_idleL.png', {frameWidth: 50, frameHeight: 97});
    this.load.spritesheet('alice_idleR', 'assets/alice_idleR.png', {frameWidth: 50, frameHeight: 96});
    this.load.spritesheet('alice_walkL', 'assets/alice_walk_left.png', {frameWidth: 60, frameHeight: 94});
    this.load.spritesheet('alice_walkR', 'assets/alice_walk_right.png', {frameWidth: 60, frameHeight: 95});
    this.load.spritesheet('alice_attackR', 'assets/alice_attack_right.png', {frameWidth: 90, frameHeight: 94});
}

function randVelocity() {
    which = Math.random();
    positive = Math.floor(Math.random() * (250 - 100) ) + 100;
    negative = Math.floor(Math.random() * (-100 + 250) ) - 100;
    if (which < 0.5) return positive;
    else return negative;
}

function whenAliceAttack(alice_box, ball) {
    alice_attack = true;
    alice_box.destroy();
    alice.anims.play('alice_attackR');
}

function scoreReimu(top_goal, ball) {
    alice_score_sprites[4 - reimu_score].destroy();
    reimu_score++;
    console.log(reimu_score);
    ball.x = 160;
    ball.y = 240;
    ball.setVelocityX(randVelocity());
    ball.setVelocityY(randVelocity());
}

function create ()
{
    // Background
    this.add.image(256, 144, 'background');

    // Render Score Sprites
    alice_score_sprites = [];
    for (y = 50; y < 200; y += 30) {
        alice_score_sprites.push(this.add.sprite(20, y, 'alice_score').setScale(0.5));
    }

    // ALice Animations
    this.anims.create({
        key: 'alice_dashL',
        frames: this.anims.generateFrameNumbers('alice_dashL', {start: 6, end: 0}),
        frameRate: 15
    });
    this.anims.create({
        key: 'alice_dashR',
        frames: this.anims.generateFrameNumbers('alice_dashR', {start: 0, end: 6}),
        frameRate: 15
    });
    this.anims.create({
        key: 'alice_idleL',
        frames: this.anims.generateFrameNumbers('alice_idleL', {start: 0, end: 15}),
        frameRate: 15,
        repeat: -1
    });
    this.anims.create({
        key: 'alice_idleR',
        frames: this.anims.generateFrameNumbers('alice_idleR', {start: 0, end: 15}),
        frameRate: 15,
        repeat: -1
    });
    this.anims.create({
        key: 'alice_walkL',
        frames: this.anims.generateFrameNumbers('alice_walkL', {start: 9, end: 0}),
        frameRate: 15,
        repeat: -1
    });
    this.anims.create({
        key: 'alice_walkR',
        frames: this.anims.generateFrameNumbers('alice_walkR', {start: 0, end: 9}),
        frameRate: 15,
        repeat: -1
    });
    this.anims.create({
        key: 'alice_attackR',
        frames: this.anims.generateFrameNumbers('alice_attackR', {start: 0, end: 6}),
        frameRate: 10,
    });

    // Score box
    top_goal = this.add.rectangle(160, 0, 320, 25, 0xFF2D00);
    this.physics.add.existing(top_goal);

    // Pong bar left (Alice)
    alice = this.physics.add.sprite(160, 50, 'alice_idleL').setScale(0.5);
    alice.body.setSize(200, 50);
    alice.setCollideWorldBounds(true);
    alice.setImmovable(true);

    // Overlap Box for Alice
    alice_box = this.add.rectangle(alice.x, alice.y, 100, 75);
    this.physics.add.existing(alice_box);

    // Pong bar Right (Reimu)
    bar2 = this.physics.add.sprite(160, 430, 'pongbar');
    bar2.setCollideWorldBounds(true);
    bar2.setImmovable(true);

    // Overlap Box for Reimu

    // Ball
    ball = this.physics.add.sprite(160, 240, 'ball');
    ball.setCollideWorldBounds(true, 1, 1);
    ball.setBounce(1, 1);
    ball.setVelocityX(randVelocity());
    ball.setVelocityY(randVelocity());

    // Colisions
    this.physics.add.collider(alice, ball);
    this.physics.add.collider(bar2, ball);
    this.physics.add.overlap(alice_box, ball, whenAliceAttack);
    this.physics.add.overlap(top_goal, ball, scoreReimu);

    // Cursor Inputs
    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    // Animation Events
    alice.on('animationstart', function(animation, frame) {
        if (animation.key === 'alice_dashL') {
            console.log('dashed left');
        }
        else if (animation.key === 'alice_dashR') {
            console.log('dashed right');
        }
    }, this);
    alice.on('animationcomplete', function(animation, frame) {
        if (animation.key === 'alice_attackR') {
            alice_attack = false;
            alice_box = this.add.rectangle(alice.x, alice.y, 100, 75);
            this.physics.add.existing(alice_box);
            this.physics.add.overlap(alice_box, ball, whenAliceAttack);
        }
        else if (animation.key === 'alice_dashL') {
            alice.setVelocityX(-100);
            alice.anims.play('alice_walkL', true);
        }
        else if (animation.key === 'alice_dashR') {
            alice.setVelocityX(100);
            alice.anims.play('alice_walkR', true);
        }
    }, this);
}

function update ()
{
    alice_box.x = alice.x;
    alice_box.y = alice.y;
    if (ball.body.velocity.x > 250) ball.setVelocityX(250);
    if (ball.body.velocity.x < -250) ball.setVelocityX(-250);
    if (ball.body.velocity.y > 250) ball.setVelocityY(250);
    if (ball.body.velocity.x < -250) ball.setVelocityX(-250);

    if (reimu_score === 1 || alice_score === 5) {
        this.physics.pause();
        const restartButton = this.add.text(125, 190, 'Restart', { fill: '#0f0' }).setInteractive().on('pointerdown', () => {
            this.scene.stop();
            this.scene.start();
            reimu_score = 0;
            alice_score = 0;
        });
    }

    if (cursors.left.isDown) {
        direction1 = 'left';
        if (Phaser.Input.Keyboard.JustDown(shift)) {
            alice.setVelocityX(-500);
            alice.anims.play('alice_dashL');
        }
        else if (!cursors.shift.isDown) {
            alice.setVelocityX(-100);
            alice.anims.play('alice_walkL', true);
        }
    }
    else if (cursors.right.isDown) {
        direction1 = 'right';
        if (Phaser.Input.Keyboard.JustDown(shift)) {
            alice.setVelocityX(500);
            alice.anims.play('alice_dashR');
        }
        else if (!cursors.shift.isDown) {
            alice.setVelocityX(100);
            alice.anims.play('alice_walkR', true);
        }
    }
    else {
        alice.setVelocityX(0);
        if (!alice_attack) {
            if (direction1 === 'left') alice.anims.play('alice_idleL', true);
            else alice.anims.play('alice_idleR', true);
        }
    }

    if (keyA.isDown) {
        bar2.setVelocityX(-100);
    }
    else if (keyD.isDown) {
        bar2.setVelocityX(100);
    }
    else {
        bar2.setVelocityX(0);
    }
}
