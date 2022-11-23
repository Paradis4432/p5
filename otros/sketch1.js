var player;
var enemy;
var bullets = [];
var score = 0;
function setup(){
  createCanvas(600,600);
  player = new Player();
  enemy = new Enemy();
  textSize(20);
}
function draw(){
  clear();
  background(51);
  enemy.show();
  enemy.moveToPlayer(player.x, player.y);
  player.show();
  player.MovePlayer();

  let keepbullets = []
  let anyhit = false;
  for (let i=0; i < bullets.length; ++ i) {
      bullets[i].toMouse();
      let hit = dist(bullets[i].x, bullets[i].y, enemy.x, enemy.y) <= enemy.r;
      anyhit = anyhit || hit
      if (!hit && bullets[i].onScreen()) {
          keepbullets.push(bullets[i]);
          bullets[i].show();
      }
  }
  bullets = keepbullets;
  if (anyhit) {
      enemy = new Enemy();
      score += 100;
  }
  
  fill(255);
  text(score,500,500,100,100)
}

function mousePressed(){
    if (mouseX != player.x || mouseY != player.y ) {
        bullets.push( new Bullet(mouseX,mouseY,player.x,player.y) )
    }
}

function Bullet(X,Y,PX,PY){
    this.speed = 2;
    this.x = PX;
    this.y = PY;
    this.dir = createVector(X-PX, Y-PY).normalize()
    this.r = 5;
    
    this.show = function(){
      fill(255,255,0);
      stroke(128,128,0);
      circle(this.x,this.y,this.r);
    }
    this.toMouse = function() {
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
    }
    this.onScreen = function() {
      return this.x > -this.r && this.x < width+this.r &&
              this.y > -this.r && this.y < height+this.r;
    }
}

function Enemy(){
  this.r = 25;
  this.x = 0+this.r;
  this.y = 0+this.r;
  this.chance = random(0,1);
  console.log(this.chance);
  if (this.chance <= 0.10){
    this.speed = 3;
    this.r = 15;
    this.red = 0;
    this.green = 0;
    this.blue = 255;
  } else {
    this.speed = 2;
    this.red = 255;
    this.green = 0;
    this.blue = 0;
  }
  this.show = function(){
    fill(this.red,this.green,this.blue);
    stroke(128,0,0);
    circle(this.x,this.y,this.r);
  }
  this.moveToPlayer = function(playerX,playerY){
    if (playerY < this.y){
      this.y += -1*this.speed;
    } else if (playerY > this.y) {
      this.y += 1*this.speed;
    }
    if (playerX < this.x){
      this.x += -1*this.speed;
    } else if (playerX > this.x){
      this.x += 1*this.speed;
    }
  }
  /*
  this.clicked = function(mX,mY){
    if (dist(mX,mY,this.x,this.y) <= this.r){
      return true;
    }
    return false;
  }
  */
}

function Player(){
  this.x = width/2;
  this.y = height/2;
  this.r = 20;
  this.speed = 4;
  this.show = function(){
    fill(0,255,0);
    stroke(0,128,0);
    circle(this.x,this.y,this.r);
  }
  this.moveY = function(number){
    this.y += (number*this.speed);
  }
  this.moveX = function(number){
    this.x += (number*this.speed);
  }
  this.MovePlayer = function(){
    if (keyIsDown(UP_ARROW)){
      if (this.y + (-1*20) > 0)
        this.moveY(-1);
    }
    if (keyIsDown(DOWN_ARROW)){
      if (this.y + (1*20) < height)
        this.moveY(1);
    }
    if (keyIsDown(LEFT_ARROW)){
      if (this.x + (-1*20) > 0)
        this.moveX(-1);
    }
    if (keyIsDown(RIGHT_ARROW)){
      if (this.x + (1*20) < width)
        this.moveX(1);
    }
  }
}