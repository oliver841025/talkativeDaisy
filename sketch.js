let daisyImg;

let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies;

let engine, world;
let balls = [];

let mic;
let started = false;

function preload() {
  daisyImg = loadImage('daisy.png');
}

function resetWorld() {
  World.clear(world);
  Engine.clear(engine);

  engine = Engine.create();
  world = engine.world;
  balls = [];

  // ground, walls
  let ground = Bodies.rectangle(width / 2, height, width, 20, {
    isStatic: true,
  });
  let leftWall = Bodies.rectangle(0, height / 2, 20, height, {
    isStatic: true,
  });
  let rightWall = Bodies.rectangle(width, height / 2, 20, height, {
    isStatic: true,
  });
  World.add(world, [ground, leftWall, rightWall]);
}

function checkReset() {
  if(balls.length === 0) return;

  for(let ball of balls) {
    if(ball.position.y - ball.circleRadius <= 0){
      resetWorld();
      break;
    }
  }

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  
  // 一進來就啟動麥克風
  userStartAudio();
  mic = new p5.AudioIn();
  mic.start();
  started = true;

  engine = Engine.create();
  world = engine.world;

  // ground, walls
  let ground = Bodies.rectangle(width / 2, height, width, 20, {
    isStatic: true,
  });
  let leftWall = Bodies.rectangle(0, height / 2, 20, height, {
    isStatic: true,
  });
  let rightWall = Bodies.rectangle(width, height / 2, 20, height, {
    isStatic: true,
  });
  World.add(world, [ground, leftWall, rightWall]);
}

function draw() {
  background(0);
  if (!started) {
    text("Click to start, try making some noise!", width / 2, height / 2);
    return;
  }
  
  Engine.update(engine);
  
  let vol = mic.getLevel();
  let volSize = map(vol, 0, 1, 30, 500);
  
  if (volSize > 31) {
    let ball = Bodies.circle(random(50, width - 50), height / 2, volSize, {
      restitution: 0.7,
      friction: 0.1,
    });
    balls.push(ball);
    World.add(world, ball);
  }
  
  fill(255);
  stroke(0);
  strokeWeight(4);
  for (let ball of balls) {
    imageMode(CENTER);
    image(daisyImg, ball.position.x, ball.position.y, ball.circleRadius * 2, ball.circleRadius * 2);
  }

  checkReset();
}
