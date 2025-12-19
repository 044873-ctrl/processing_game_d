let invaders = [];
let player;
let playerBullets = [];
let invaderBullets = [];
let score = 0;

function setup() {
  createCanvas(600, 400);
  
  player = new Player();
  
  for(let i=0; i<10; i++){
    invaders[i] = new Invader(i*60+60, 60);
  }
}

function draw() {
  background(0);
  
  player.show();
  player.move();
  
  for(let invader of invaders){
    invader.show();
    invader.move();
    
    if(invader.y >= height){
      invaders = [];
      for(let i=0; i<10; i++){
        invaders[i] = new Invader(i*60+60, 60);
      }
      score = 0;
    }
  }
  
  for(let i=playerBullets.length-1; i>=0; i--){
    playerBullets[i].show();
    playerBullets[i].move();
    
    for(let j=invaders.length-1; j>=0; j--){
      if(playerBullets[i].hits(invaders[j])){
        score++;
        invaders.splice(j, 1);
        playerBullets.splice(i, 1);
        break;
      }
    }
  }
  
  for(let i=invaderBullets.length-1; i>=0; i--){
    invaderBullets[i].show();
    invaderBullets[i].move();
    
    if(invaderBullets[i].hits(player)){
      invaderBullets.splice(i, 1);
      player = new Player();
    }
  }
  
  if(random(1) < 0.001){
    invaderBullets.push(new InvaderBullet(random(invaders).x, random(invaders).y));
  }
  
  text(`Score: ${score}`, width-100, 50);
}

function keyPressed(){
  if(keyCode === RIGHT_ARROW){
    player.setDir(1);
  } else if(keyCode === LEFT_ARROW){
    player.setDir(-1);
  } else if(key === ' '){
    playerBullets.push(new PlayerBullet(player.x, height));
  }
}

function keyReleased(){
  if(keyCode !== ' '){
    player.setDir(0);
  }
}

class Player{
  constructor(){
    this.x = width/2;
    this.y = height-20;
    this.xdir = 0;
  }
  
  show(){
    fill(255);
    rectMode(CENTER);
    rect(this.x, this.y, 20, 60);
  }
  
  setDir(dir){
    this.xdir = dir;
  }
  
  move(){
    this.x += this.xdir*5;
  }
}

class PlayerBullet{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  
  show(){
    fill(50, 0, 200);
    ellipse(this.x, this.y, 16, 16);
  }
  
  move(){
    this.y -= 5;
  }
  
  hits(invader){
    let d = dist(this.x, this.y, invader.x, invader.y);
    return (d < invader.r);
  }
}

class Invader{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.r = 30;
    this.xdir = 1;
    this.ydir = 0;
  }
  
  grow(){
    this.r = this.r + 2;
  }
  
  show(){
    fill(255, 0, 200);
    ellipse(this.x, this.y, this.r*2, this.r*2);
  }
  
  move(){
    this.x = this.x + this.xdir;
    this.y = this.y + this.ydir;
    
    if(this.y > height-60 || this.y < 60){
      this.ydir = -this.ydir;
    }
    
    if(this.x > width-this.r || this.x < this.r){
      this.xdir = -this.xdir;
      this.y = this.y + this.r;
    }
  }
}

class InvaderBullet{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  
  show(){
    fill(255, 0, 0);
    ellipse(this.x, this.y, 16, 16);
  }
  
  move(){
    this.y += 3;
  }
  
  hits(player){
    let d = dist(this.x, this.y, player.x, player.y);
    return (d < player.r);
  }
}
