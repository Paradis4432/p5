var player;
var bullets = [];
var score = 0;
function setup() {
    createCanvas(600, 600);
    player = new Player();
    textSize(20);
}
function draw() {
    clear();
    background(51);
    player.show();
    player.MovePlayer();

    for (let i = 0; i < bullets.length; ++i) {
        bullets[i].toMouse();
        bullets[i].show();
    }

    fill(255);
    text(score, 500, 500, 100, 100)
}

function mousePressed() {
    bullets.push(new Bullet(mouseX, mouseY, player.x, player.y))
}

function Bullet(X, Y, PX, PY) {
    this.speed = 2;
    this.x = PX;
    this.y = PY;
    this.dir = createVector(X - PX, Y - PY).normalize()
    this.r = 5;

    this.show = function () {
        fill(255, 255, 0);
        stroke(128, 128, 0);
        circle(this.x, this.y, this.r);
    }
    this.toMouse = function () {
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
    }
    this.onScreen = function () {
        return this.x > -this.r && this.x < width + this.r &&
            this.y > -this.r && this.y < height + this.r;
    }
}

function Player() {
    this.x = width / 2;
    this.y = height / 2;
    this.r = 20;
    this.speed = 4;
    this.show = function () {
        fill(0, 255, 0);
        stroke(0, 128, 0);
        circle(this.x, this.y, this.r);
    }
    this.moveY = function (number) {
        this.y += (number * this.speed);
    }
    this.moveX = function (number) {
        this.x += (number * this.speed);
    }
    this.MovePlayer = function () {
        if (keyIsDown(UP_ARROW)) {
            if (this.y + (-1 * 20) > 0)
                this.moveY(-1);
        }
        if (keyIsDown(DOWN_ARROW)) {
            if (this.y + (1 * 20) < height)
                this.moveY(1);
        }
        if (keyIsDown(LEFT_ARROW)) {
            if (this.x + (-1 * 20) > 0)
                this.moveX(-1);
        }
        if (keyIsDown(RIGHT_ARROW)) {
            if (this.x + (1 * 20) < width)
                this.moveX(1);
        }
    }
}