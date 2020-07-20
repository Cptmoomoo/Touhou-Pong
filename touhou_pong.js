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
var reimu_attack = false;

// Ball Velocity Setters
var velocity;

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
    this.load.spritesheet('alice_idleL', 'assets/alice_idle_left.png', {frameWidth: 50, frameHeight: 97});
    this.load.spritesheet('alice_idleR', 'assets/alice_idle_right.png', {frameWidth: 50, frameHeight: 96});
    this.load.spritesheet('alice_walkL', 'assets/alice_walk_left.png', {frameWidth: 60, frameHeight: 94});
    this.load.spritesheet('alice_walkR', 'assets/alice_walk_right.png', {frameWidth: 60, frameHeight: 95});
    this.load.spritesheet('alice_attackL', 'assets/alice_attack_left.png', {frameWidth: 90, frameHeight: 94});
    this.load.spritesheet('alice_attackR', 'assets/alice_attack_right.png', {frameWidth: 90, frameHeight: 94});
    this.load.spritesheet('alice_lose', 'assets/alice_lose.png', {frameWidth: 100, frameHeight: 90});

    // Reimu Animation Sprites
    this.load.spritesheet('reimu_idleL', 'assets/reimu_idle_left.png', {frameWidth: 100, frameHeight: 103});
    this.load.spritesheet('reimu_idleR', 'assets/reimu_idle_right.png', {frameWidth: 100, frameHeight: 102});
    this.load.spritesheet('reimu_walkL', 'assets/reimu_walk_left.png', {frameWidth: 115, frameHeight: 111});
    this.load.spritesheet('reimu_walkR', 'assets/reimu_walk_right.png', {frameWidth: 110, frameHeight: 125});
    this.load.spritesheet('reimu_dashL', 'assets/reimu_dash_left.png', {frameWidth: 100, frameHeight: 109});
    this.load.spritesheet('reimu_dashR', 'assets/reimu_dash_right.png', {frameWidth: 120, frameHeight: 100});
}

function setBallVelocity(total_score) {
    var x_vel = [-25, 25, -50, 50, -75, 75]
    var y_vel = [-150, 150, -175, 175, -200, 200, -250, 250]
    var x_choice = Math.floor(Math.random() * 6);
    var y_choice;

    if (total_score < 5) {
        // Slower Ball
        y_choice = Math.floor(Math.random() * 4);
    }
    else {
        // Faster Ball
        y_choice = Math.floor(Math.random() * 4) + 4;
    }
    return [x_vel[x_choice], y_vel[y_choice]];
}

function whenAliceAttack(alice_box, ball) {
    alice_attack = true;
    alice_box.destroy();
    if (direction1 === 'left') alice.anims.play('alice_attackL');
    else alice.anims.play('alice_attackR');
}

function resetBall() {
    velocity = setBallVelocity(reimu_score + alice_score);
    ball.x = 160;
    ball.y = 240;
    ball.setVelocityX(velocity[0]);
    ball.setVelocityY(velocity[1]);
}

function scoreReimu(top_goal, ball) {
    alice_score_sprites[4 - reimu_score].destroy();
    reimu_score++;
    resetBall();
}

function scoreAlice(bottom_goal, ball) {
    reimu_score_sprites[alice_score].destroy();
    alice_score++;
    resetBall();
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
    reimu_score_sprites = [];
    for (y = 250; y < 400; y += 30) {
        reimu_score_sprites.push(this.add.sprite(300, y, 'alice_score').setScale(0.5));
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
    this.anims.create({
        key: 'alice_attackL',
        frames: this.anims.generateFrameNumbers('alice_attackL', {start: 0, end: 6}),
        frameRate: 10,
    });
    this.anims.create({
        key: 'alice_lose',
        frames: this.anims.generateFrameNumbers('alice_lose', {start: 0, end: 8}),
        frameRate: 10,
    });
    this.anims.create({
        key: 'alice_down',
        frames: [{key: 'alice_lose', frame: 8}],
        frameRate: 10,
    });

    // Reimu Animations
    this.anims.create({
        key: 'reimu_idleL',
        frames: this.anims.generateFrameNumbers('reimu_idleL', {start: 0, end: 10}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'reimu_idleR',
        frames: this.anims.generateFrameNumbers('reimu_idleR', {start: 10, end: 0}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'reimu_walkL',
        frames: this.anims.generateFrameNumbers('reimu_walkL', {start: 7, end: 0}),
        frameRate: 15,
        repeat: -1
    });
    this.anims.create({
        key: 'reimu_walkR',
        frames: this.anims.generateFrameNumbers('reimu_walkR', {start: 0, end: 7}),
        frameRate: 15,
        repeat: -1
    });
    this.anims.create({
        key: 'reimu_dashL',
        frames: this.anims.generateFrameNumbers('reimu_dashL', {start: 4, end: 0}),
        frameRate: 10
    });
    this.anims.create({
        key: 'reimu_dashR',
        frames: this.anims.generateFrameNumbers('reimu_dashR', {start: 0, end: 2}),
        frameRate: 7,
    });

    // Score box
    top_goal = this.add.rectangle(160, 5, 320, 10, 0xFF2D00);
    this.physics.add.existing(top_goal);
    bottom_goal = this.add.rectangle(160, 475, 320, 10, 0xFF2D00);
    this.physics.add.existing(bottom_goal);

    // Pong bar left (Alice)
    alice = this.physics.add.sprite(160, 50, 'alice_idleL').setScale(0.5);
    alice.body.setSize(100, 50);
    alice.setCollideWorldBounds(true);
    alice.setImmovable(true);

    // Overlap Box for Alice
    alice_box = this.add.rectangle(alice.x, alice.y, 50, 20).setOrigin(0.5, -0.65);
    this.physics.add.existing(alice_box);

    // Pong bar Right (Reimu)
    reimu = this.physics.add.sprite(160, 430, 'reimu_idleL').setScale(0.5);
    reimu.body.setSize(100, 50);
    reimu.setCollideWorldBounds(true);
    reimu.setImmovable(true);

    // Overlap Box for Reimu
    reimu_box = this.add.rectangle(reimu.x, reimu.y, 50, 20).setOrigin(0.5, 1.65);
    this.physics.add.existing(reimu_box);

    // Ball
    ball = this.physics.add.sprite(160, 240, 'ball');
    ball.setCollideWorldBounds(true, 1, 1);
    ball.setBounce(1, 1);
    velocity = setBallVelocity(reimu_score + alice_score);
    ball.setVelocityX(velocity[0]);
    ball.setVelocityY(velocity[1]);

    // Colisions
    this.physics.add.collider(alice, ball);
    this.physics.add.collider(reimu, ball);
    this.physics.add.overlap(alice_box, ball, whenAliceAttack);
    this.physics.add.overlap(top_goal, ball, scoreReimu);
    this.physics.add.overlap(bottom_goal, ball, scoreAlice);

    // Cursor Inputs
    cursors = this.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Animation Events
    // alice.on('animationstart', function(animation, frame) {
    // }, this);
    alice.on('animationcomplete', function(animation, frame) {
        // Alice animation events
        if (animation.key === 'alice_attackR' || animation.key === 'alice_attackL') {
            alice_attack = false;
            alice_box = this.add.rectangle(alice.x, alice.y, 50, 20).setOrigin(0.5, -0.65);
            this.physics.add.existing(alice_box);
            this.physics.add.overlap(alice_box, ball, whenAliceAttack);
        }
        else if (animation.key === 'alice_lose') {
            alice.anims.play('alice_down');
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

    reimu.on('animationcomplete', function(animation, frame) {
        // Reimu animation events
        if (animation.key === 'reimu_dashL') {
            reimu.setVelocityX(-100);
            reimu.anims.play('reimu_walkL', true);
        }
        else if (animation.key === 'reimu_dashR') {
            reimu.setVelocityX(100);
            reimu.anims.play('reimu_walkR', true);
        }
    }, this);
}

function update ()
{
    // Overlap Box follows player
    alice_box.x = alice.x;
    alice_box.y = alice.y;
    reimu_box.x = reimu.x;
    reimu_box.y = reimu.y;

    // Cap ball speed
    if (ball.body.velocity.x > 250) ball.setVelocityX(250);
    if (ball.body.velocity.x < -250) ball.setVelocityX(-250);
    if (ball.body.velocity.y > 250) ball.setVelocityY(250);
    if (ball.body.velocity.x < -250) ball.setVelocityX(-250);

    // If Reimu Wins
    if (reimu_score === 2) {
        reimu_score = 0;
        alice_score = 0;
        alice_attack = true;
        alice.anims.play('alice_lose');
        this.physics.pause();
        const restartButton = this.add.text(125, 190, 'Restart', { fill: '#0f0' }).setInteractive().on('pointerdown', () => {
            alice_attack = false;
            this.scene.restart();
        });
    }

    if (cursors.left.isDown) {
        direction1 = 'left';
        if (Phaser.Input.Keyboard.JustDown(shift)) {
            alice.setVelocityX(-300);
            if (!alice_attack) alice.anims.play('alice_dashL');
        }
        else if (!cursors.shift.isDown) {
            alice.setVelocityX(-100);
            if (!alice_attack) alice.anims.play('alice_walkL', true);
        }
    }
    else if (cursors.right.isDown) {
        direction1 = 'right';
        if (Phaser.Input.Keyboard.JustDown(shift)) {
            alice.setVelocityX(300);
            if (!alice_attack) alice.anims.play('alice_dashR');
        }
        else if (!cursors.shift.isDown) {
            alice.setVelocityX(100);
            if (!alice_attack) alice.anims.play('alice_walkR', true);
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
        direction2 = 'left';
        if (Phaser.Input.Keyboard.JustDown(space)) {
            reimu.setVelocityX(-300);
            if (!reimu_attack) reimu.anims.play('reimu_dashL');
        }
        else if (!cursors.space.isDown) {
            reimu.setVelocityX(-100);
            if (!reimu_attack) reimu.anims.play('reimu_walkL', true);
        }
    }
    else if (keyD.isDown) {
        direction2 = 'right';
        if (Phaser.Input.Keyboard.JustDown(space)) {
            reimu.setVelocityX(300);
            if (!reimu_attack) reimu.anims.play('reimu_dashR');
        }
        else if (!cursors.space.isDown) {
            reimu.setVelocityX(100);
            if (!reimu_attack) reimu.anims.play('reimu_walkR', true);
        }
    }
    else {
        reimu.setVelocityX(0);
        if (direction2 === 'left') reimu.anims.play('reimu_idleL', true);
        else reimu.anims.play('reimu_idleR', true);
    }
}
