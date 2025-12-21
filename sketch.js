class Player{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.r=12;
    this.speed=5;
  }
  update(){
    if(keyIsDown(LEFT_ARROW)){
      this.x -= this.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      this.x += this.speed;
    }
    this.x = constrain(this.x,this.r,width-this.r);
  }
  show(){
    fill(0,200,255);
    noStroke();
    triangle(this.x, this.y-this.r, this.x-this.r, this.y+this.r, this.x+this.r, this.y+this.r);
  }
}
class Bullet{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.r=4;
    this.speed=15;
  }
  update(){
    this.y -= this.speed;
  }
  offscreen(){
    return this.y + this.r < 0;
  }
  show(){
    fill(255,255,0);
    noStroke();
    ellipse(this.x,this.y,this.r*2,this.r*2);
  }
}
class Enemy{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.r=12;
    this.speed=2;
  }
  update(){
    this.y += this.speed;
  }
  offscreen(){
    return this.y - this.r > height;
  }
  show(){
    fill(255,80,80);
    noStroke();
    ellipse(this.x,this.y,this.r*2,this.r*2);
  }
}
class Particle{
  constructor(x,y){
    this.x=x;
    this.y=y;
    this.r=3;
    this.life=20;
    var angle = random(0, TWO_PI);
    var s = random(1,3);
    this.vx = cos(angle)*s;
    this.vy = sin(angle)*s;
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 1;
  }
  done(){
    return this.life <= 0;
  }
  show(){
    fill(255,200,50, map(this.life,0,20,0,255));
    noStroke();
    ellipse(this.x,this.y,this.r*2,this.r*2);
  }
}
class Star{
  constructor(){
    this.x = random(0,400);
    this.y = random(0,600);
    this.r = random(1,3);
    this.speed = random(0.5,2);
  }
  update(){
    this.y += this.speed;
    if(this.y - this.r > height){
      this.y = random(-height*0.2,0);
      this.x = random(0,width);
    }
  }
  show(){
    fill(255);
    noStroke();
    ellipse(this.x,this.y,this.r*2,this.r*2);
  }
}
var player;
var bullets = [];
var enemies = [];
var particles = [];
var stars = [];
var score = 0;
var gameOver = false;
var lastShot = -999;
var shotCooldown = 10;
var spawnInterval = 60;
function setup(){
  createCanvas(400,600);
  player = new Player(width/2, height-40);
  for(var i=0;i<30;i++){
    stars.push(new Star());
  }
  score = 0;
  gameOver = false;
  bullets = [];
  enemies = [];
  particles = [];
  lastShot = -999;
}
function resetGame(){
  player = new Player(width/2, height-40);
  bullets = [];
  enemies = [];
  particles = [];
  score = 0;
  gameOver = false;
  lastShot = frameCount;
}
function draw(){
  background(0);
  for(var si=0;si<stars.length;si++){
    stars[si].update();
    stars[si].show();
  }
  if(!gameOver){
    player.update();
  }
  player.show();
  if(!gameOver && keyIsDown(32) && frameCount - lastShot >= shotCooldown){
    bullets.push(new Bullet(player.x, player.y - player.r));
    lastShot = frameCount;
  }
  if(!gameOver && frameCount % spawnInterval === 0){
    var ex = random(12, width-12);
    enemies.push(new Enemy(ex, -12));
  }
  for(var i=bullets.length-1;i>=0;i--){
    bullets[i].update();
    bullets[i].show();
    if(bullets[i].offscreen()){
      bullets.splice(i,1);
    }
  }
  for(var e=enemies.length-1;e>=0;e--){
    enemies[e].update();
    enemies[e].show();
    if(enemies[e].offscreen()){
      enemies.splice(e,1);
      continue;
    }
    if(!gameOver){
      var d = dist(enemies[e].x,enemies[e].y, player.x, player.y);
      if(d <= enemies[e].r + player.r){
        gameOver = true;
      }
    }
    for(var b=bullets.length-1;b>=0;b--){
      var dbe = dist(enemies[e].x,enemies[e].y, bullets[b].x, bullets[b].y);
      if(dbe <= enemies[e].r + bullets[b].r){
        for(var pcount=0;pcount<5;pcount++){
          particles.push(new Particle(enemies[e].x, enemies[e].y));
        }
        enemies.splice(e,1);
        bullets.splice(b,1);
        score += 1;
        break;
      }
    }
  }
  for(var pi=particles.length-1;pi>=0;pi--){
    particles[pi].update();
    particles[pi].show();
    if(particles[pi].done()){
      particles.splice(pi,1);
    }
  }
  fill(255);
  noStroke();
  textSize(18);
  textAlign(LEFT,TOP);
  text("Score: "+score,10,10);
  if(gameOver){
    fill(0,0,0,150);
    rect(0,0,width,height);
    fill(255);
    textSize(36);
    textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2 - 20);
    textSize(16);
    text("Press R to restart", width/2, height/2 + 20);
    if(keyIsDown(82)){
      resetGame();
    }
  }
}
