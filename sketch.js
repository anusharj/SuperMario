var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score = 0;

var backImage, backgr;

var mario, mario_running, mario_collided;

var ground, backImage, groundImage, brickImg;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var bricksGroup;

var jumpSound, checkPointSound, dieSound;

function preload() {
  backImage = loadImage("bg.png");

  mario_running = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  mario_collided = loadAnimation("collided.png");

  groundImage = loadImage("ground2.png");
  brickImg = loadImage("brick.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");

  obstaclesGroup = createGroup();
  bricksGroup = createGroup();

  gameOver = createSprite(300, 180);
  gameOver.addImage("gameover", gameOverImg);

  restart = createSprite(300, 240);
  restart.addImage("restart", restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

}

function setup() {
  createCanvas(600, 400);

  mario = createSprite(50, 315, 20, 50);

  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);

  ground = createSprite(600, 377, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -8;
  // ground.visible = false;

  mario.setCollider("rectangle", 0, 0, mario.width, mario.height);
 // mario.debug = true;

}

function draw() {
  background(backImage);
  fill("yellow");
  textSize(20);
  text("Score: " + score, 500, 30);

  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
     ground.velocityX = -5 ;
                          
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }


    //jump when the space key is pressed
    if (keyDown("space") && mario.y >= 100) {
      mario.velocityY = -12;
      jumpSound.play();
    }

    //add gravity
    mario.velocityY = mario.velocityY + 0.8

    spawnObstacles();
    spawnBricks();

    if (obstaclesGroup.isTouching(mario)) {

      jumpSound.play();
      gameState = END;
      dieSound.play();

    }
    mario.isTouching(bricksGroup,getBrick);
  } else if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;

    mario.velocityY = 0;
    mario.changeAnimation("collided", mario_collided);
   if(mousePressedOver(restart))
   {
     reset();
   }

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
  }

  mario.collide(ground);
  drawSprites();
}


function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(500, 322, 10, 40);
    obstacle.velocityX = -8;

    //generate random obstacles
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}


function spawnBricks() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var brick = createSprite(600, 120, 40, 10);
    brick.y = Math.round(random(190, 220));
    brick.addImage(brickImg);
    brick.scale = 0.5;
    brick.velocityX = -3;

    //assign lifetime to the variable
    brick.lifetime = 200;

    //adjust the depth
    brick.depth = mario.depth;
    mario.depth = brick.depth + 1;
    brick.depth = gameOver.depth
    gameOver.depth = brick.depth + 1;

    //add each brick to the group
    bricksGroup.add(brick);
  }
}


 function reset(){
    
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    obstaclesGroup.destroyEach();
    bricksGroup.destroyEach();
    mario.changeAnimation("running",mario_running);
    score =0;
  }

function getBrick(mario,brick){
  brick.remove();
  score += 1;
}