var play = 1;
var end = 0;
var pre = 2;
var gamestate;

var player, playerImg, player_jmp;

var ground , groundImg, invisibleGround;

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstacle7, obstaclesGroup;

var score, hiscore;

var lava, spawnlava, lavaImg, lavaGroup;

var restart, restartImg, gameOver, gameOverImg;

var cloudsGroup, cloudImg;

var jumpsound, collidesound, checkpointsound;

function preload(){
groundImg = loadImage('ground.png')

jumpsound = loadSound('jump.mp3')
collidesound = loadSound('death.mp3')
checkpointsound = loadSound('checkpoint.mp3')

playerImg = loadImage('player.png')
player_jmp = loadAnimation('playerjump1.png', 'playerjump2.png', 'playerjump3.png','playerjump4.png', 'playerjump5.png', 'playerjump6.png')

obstacle1 = loadImage('obstacle1.png')
obstacle2 = loadImage('obstacle2.png')
obstacle3 = loadImage('obstacle3.png')
obstacle4 = loadImage('obstacle4.png')
obstacle5 = loadImage('obstacle5.png')
obstacle6 = loadImage('obstacle6.png')
obstacle7 = loadImage('obstacle7.png')
obstacle4.scale = 4;
obstacle5.scale = 4;
obstacle6.scale = 4;
obstacle7.scale = 4;
obstacle1.scale = 2;
obstacle2.scale = 2;
obstacle3.scale = 2;

lavaImg = loadImage('cloud.png')
cloudImg = loadImage('cloud.png')
restartImg = loadImage('restart.png')
gameOverImg = loadImage("gameover.png");
}

function setup() {
createCanvas(windowWidth, windowHeight)
ground = createSprite(800, windowHeight/2 + 300, 10000, 500)
ground.addImage('ground',groundImg)
ground.scale = 2.8

player = createSprite(200, windowHeight/2 + 220 , 30, 30);
player.addAnimation('player', playerImg)
player.addAnimation('jumping', player_jmp)
player.scale = 1.25
player.setCollider('circle',-56, -150, 27)
//player.debug = true

invisibleGround = createSprite(0, windowHeight/2 + 120, 4000, 6)
invisibleGround.visible = false;
//invisibleGround.debug = true;

restart = createSprite(width/2,height/2 - 100, 300, 300);
restart.addImage(restartImg); 
restart.scale = 0.4
restart.visible = false;

score = 0;
hiscore = 0;

obstaclesGroup = new Group();
cloudsGroup = new Group();
lavaGroup = new Group();

gameOver = createSprite(width/2 + 20,height/2- 200);
gameOver.addImage(gameOverImg);
gameOver.scale = 2;
gameOver.visible = false;


gamestate = play;
  
}

function draw() {
    background('lightblue')
    textSize(20);
    fill("black")
    text("Score: "+ score,30,50);
    text("High Score: "+ hiscore, 160,50);
    if (gamestate === play) {
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

    if (keyDown('UP_ARROW') || keyDown('space') && player.y >= windowHeight/2 + 220){
        player.velocityY  = -15;
        jumpsound.play( )
              
    }
    if (player.y < windowHeight/2 + 220){
        player.changeAnimation('jumping', player_jmp)
        player.velocityY = player.velocityY + 0.8
    }
    if (player.y > windowHeight/2 + 220){
        player.changeAnimation('player', playerImg)
        player.y = windowHeight/2 + 220
    }
    
    if (ground.x < 200){
        ground.x = ground.width/2;
    }
    if (score % 100 === 0 && score> 0){
        checkpointsound.play();
    }
    console.log(player.y)
    spawnObstacles();
    spawnClouds();
    spawnlava();
    obstaclesGroup.velocityYEach = obstaclesGroup.velocityYEach - 0.8;
    obstaclesGroup.collide(invisibleGround)
    if (obstaclesGroup.isTouching(lavaGroup)){
        lavaGroup.destroyEach();
    }
    if (player.isTouching(obstaclesGroup) || player.isTouching(lavaGroup)){
        gamestate = end;
        collidesound.play();
    }
}
    if (gamestate === end){
        
        player.velocityY = 0;
        ground.velocityX = 0;
        obstaclesGroup.setVelocityXEach(0);
        obstaclesGroup.setLifetimeEach(-1)
        lavaGroup.setVelocityXEach(0);
        lavaGroup.setLifetimeEach(-1)
        cloudsGroup.setVelocityXEach(0);
        cloudsGroup.setLifetimeEach(-1)
        player.changeAnimation('jumping',player_jmp)
        player.scale += 0.1
        gameOver.visible = true;
        restart.visible = true;
        if (score > hiscore) {
            hiscore = score;
        }
        if(keyDown("space")) {      
           // reset();
           gamestate = play;
            restart.visible = false;
            gameOver.visible = false;
            obstaclesGroup.destroyEach();
            cloudsGroup.destroyEach();
            lavaGroup.destroyEach();
            player.changeAnimation('player', playerImg)
            player.scale = 1.25
            score = 0;
            
          }
    }
     
    
 drawSprites(); 
}
function spawnlava() {
    if(frameCount % 133 === 0){
        lava = createSprite(3000 - ground.velocityX, height /2 + 104, 180, 80)
        lava.shapeColor = 'orange';
        lava.velocityX = ground.velocityX;
        lava.lifetime = 300;
        lavaGroup.add(lava);
        //lava.debug = true;
    }
}
function spawnObstacles() {
    var posx = 1500;
    if(frameCount % 100 === 0) {
      var obstacle = createSprite(posx - ground.velocityX * 2.5 - ground.velocityX,height - 385,20,30);
      obstacle.setCollider('circle',0, -50,45)
      //obstacle.debug = true
      
     obstacle.velocityX = ground.velocityX;
    obstacle.lifetime = 300

      var rand = Math.round(random(1,7));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      case 7: obstacle.addImage(obstacle7);
              break;
      default: break;
    }
    obstacle.depth = player.depth;
    player.depth +=5;
    obstaclesGroup.add(obstacle);
    
}
}
function spawnClouds() {
    if (frameCount % 200 === 0) {
      var cloud = createSprite(width+20,height-300,40,10);
      cloud.y = Math.round(random(100,220));
      cloud.addImage(cloudImg);
      cloud.scale = 0.5;
      cloud.velocityX = -3;
      cloud.lifetime = 600;
      cloud.depth = player.depth;
      player.depth = player.depth+5;
      gameOver.depth = cloud.depth + 1;
      cloudsGroup.add(cloud);
    }
    
  }
  