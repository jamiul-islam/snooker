// Importing Matter.js engine modules for physics simulation
let snookerEngine = Matter.Engine;
const snookerRender = Matter.Render;
let snookerWorld = Matter.World;
let snookerBody = Matter.Body;
let snookerBodies = Matter.Bodies;

// Importing Matter.js modules for interactions and constraints
let snookerMouse = Matter.Mouse;
var snookerMouseConstraint = Matter.MouseConstraint;
let snookerCollision = Matter.Collision;
let snookerConstraint = Matter.Constraint;
let snookerSleeping = Matter.Sleeping;

// Variable initialization for engine and game state
let engine = snookerEngine.create();
let canvas;
let gameStart = false; // Flag to track if the game has started

// Initializing game components
let gameTable = new Table();
let cueBall = new CueBall();
var ballOrganizer = new BallOrganizer();
var leaderBoard = new LeaderBoard();
var stopwatch = new Stopwatch();
var feature = new ExtraFeature();
var helperFunc = new Helper();

// p5.js setup function, runs once at the start
function setup() {
  canvas = createCanvas(1300, 800); // Creating the game canvas
  angleMode(DEGREES); // Setting angle mode to degrees
  background(0); // Setting background color to black
  gameTable.createCushions(); // Creating the table cushions
  helperFunc.snookerMouseInteraction(); // Setting up mouse interaction
}

// p5.js draw function, runs continuously
function draw() {
  background(0); // Clearing the canvas
  snookerEngine.update(engine); // Updating the physics engine

  // Set gravity to 0 to keep balls within the table
  engine.gravity.y = 0;

  gameTable.draw(); // Drawing the game table

  // Drawing the title of the game
  push();
  textSize(36);
  fill("white");
  stroke(255);
  text("SNOOKER ASSIGNMENT", 450, 50);
  pop();

  // Drawing the stopwatch timer
  stopwatch.drawTimer();

  // Checking if ball arrangement mode is selected
  if (!ballOrganizer.mode) {
    // Instructions to select ball arrangement mode
    push();
    textSize(24);
    fill("white");
    text(
      "Press for Ball Placement: o 👉 ordered, u 👉 unordered, p 👉 partially ordered",
      200,
      600
    );
    pop();
  } else {
    // Displaying the selected mode and starting the game if mode is selected
    textSize(14);
    text("mode: " + ballOrganizer.mode, 25, 100);
    ballOrganizer.drawBalls(); // Drawing the balls on the table
    leaderBoard.showScore(); // Displaying the leaderboard

    if (!gameStart) {
      // Instructions to place the white ball if game hasn't started
      textSize(24);
      stroke(255);
      text("Please click inside the D line to place the white ball", 200, 600);
    } else {
      // Game has started, showing additional instructions
      stopwatch.startTimer(); // Starting the stopwatch

      push();
      textSize(24);
      fill("white");
      text("press r to restart the game", 200, 600);
      pop();

      cueBall.draw(); // Drawing the cue ball
      ballOrganizer.showTarget(); // Showing the target for the cue ball

      // Handling game logic if the cue ball is in the field and not constrained
      if (cueBall.isInField() && !cueBall.isConstrained) {
        ballOrganizer.drawFoul(); // Drawing foul messages
        gameTable.detectCollision(cueBall.ball); // Detecting collisions with the table
        ballOrganizer.detectCollision(cueBall.ball); // Detecting collisions with other balls
        ballOrganizer.detectFalling(); // Detecting if any ball falls into a pocket
        ballOrganizer.checkWin(); // Checking if the player has won

        if (cueBall.notMoving()) {
          // Setting up the cue ball constraint if it is not moving
          cueBall.setUpConstraint(
            cueBall.ball.position.x,
            cueBall.ball.position.y
          );
          ballOrganizer.newTurn(); // Starting a new turn
          feature.deactivate(); // Deactivating any extra features
        }
      } else if (!cueBall.isConstrained) {
        // Handling fouls when cue ball is constrained and moving
        leaderBoard.addScore(-4); // Decreasing the score by 4 for a foul
        snookerWorld.remove(engine.world, [
          cueBall.ball,
          cueBall.cueBallConstraint,
        ]); // Removing the ball and its constraint
        gameStart = false; // Allowing the player to place the cue ball again
      }
    }
  }
}

// Function to handle key presses
function keyTyped() {
  if (!gameStart && !ballOrganizer.mode) {
    // Setting ball arrangement mode based on key press
    if (key.toLowerCase() === "u") {
      ballOrganizer.setMode("unordered");
    }
    if (key.toLowerCase() === "p") {
      ballOrganizer.setMode("partial");
    }
    if (key.toLowerCase() === "o") {
      ballOrganizer.setMode("ordered");
    }
  }

  // Restarting the game if 'r' is pressed
  if (key.toLowerCase() === "r") {
    window.location.reload(); // Reloading the window to restart
  }
}

// Function to handle mouse release events
function mouseReleased() {
  if (!gameStart && ballOrganizer.mode) {
    // Allowing the player to place the cue ball within the D line before the game starts
    if (dist(mouseX, mouseY, 350, 175 + 370 / 3) < 75 && mouseX < 350) {
      gameStart = true;
      cueBall.setUpCueBall(mouseX, mouseY); // Setting up the cue ball at mouse position
      cueBall.setUpConstraint(mouseX, mouseY); // Setting up the cue ball constraint
      ballOrganizer.ballsSleep(true); // Putting all balls to sleep
      feature.placeButtons(); // Placing additional feature buttons
    }
  } else if (gameStart) {
    // Removing the constraint if the game is in progress
    cueBall.removeConstraint(cueBall.cueBallConstraint);
    ballOrganizer.ballsSleep(false); // Waking up all balls
  }
}

// ----------------------------------------COMMENTARY ----------------------------------------------------

//I designed this snooker app with the idea of emulating the aesthetic of the image given in the coursework instructions.
//I created the gameTable with p5js using their rect and ellipse functions, while making the cushions, and the balls with matter.js
//using their snookerBodies function. The cue is not a physical cue as seen in snooker, but instead follows a more slingshot style of release,
//this was just another way for me to add uniqueness to my app, however using matter.js, I was able to create collision events only when,
//the cue ball was released. Furthermore, I also found it more intuitive to have a purely mouse based cue, this means that the placement,
// loading, and releasing of the cue is based on the state of the mouse. Functionally, this works by creating a constraint in the middle
//of the cue ball, and removing that constraint when the mouse is released, once the cue ball is no longer moving, create a new constraint
//at the new position of the cue ball.

//For the game mechanics, I used an object-oriented style of programming with constructor functions for the gameTable,
//ball, my extension, etc. For the pockets, I detected falling simply by tracking the y position of each ball, as the cushions would
// stop them from leaving the gameTable at certain heights, and the only way to breach that threshold would be through the p5.js generated
// pockets that don't collide with the matter.js bodies. In my ballOrganizer object I tracked things such as fouls, the target ball,
// as well as all the logic for when a ball collides or falls. I also included a function for the cushion where it lights up when making
// contact with the cue ball.

//For my extensions I implemented three things, starting from the least original I implemented a scoreboard, with both scoring additions
// from the balls being pocketed, but also deductions from foul shots, as well as preventing points from being added if a foul occurred.
// Next, I added a stopwatch that counts down from 10 minutes. If either the stopwatch runs out, or the player clears the gameTable, they can press
// ‘r’ to restart. Finally, I also included features. This is under its own object with functions that activate, deactivate,
//and assign their usage through the creation of a button with the p5.js DOM. Some of these feature include, increasing the feature of the
// cue by multiplying its mass, making the balls smaller, doubling the points of each ball, and randomly aligning balls to the front of
// each pocket. These features were my way of giving an arcade feel to an otherwise very professional and technical game. I believe this
//to be unique and “has not been seen in snooker gaming before”, as it is a manipulation of the game’s physics and rules in a way unable
// to be done in real life, and not appropriate for snooker applications which are usually attempting to
//recreate the reality of the game.
