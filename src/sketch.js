/**
 * ------------------------COMMENTARY------------------------
 * My snooker application is designed with a unique blend of professional gameplay mechanics and arcade-style features.
 * The game table is visually rendered using p5.js, while the physical interactions of the balls and cushions are handled by Matter.js, ensuring realistic physics.
 *
 * The cue ball movement utilizes a slingshot-style mechanism, enhancing the user experience.
 * This is achieved by creating and removing constraints on the cue ball based on mouse interactions, allowing for intuitive control.
 *
 * Object-oriented programming, factory pattern principles are applied throughout the codebase, with constructor functions and classes managing various aspects of the game.
 * The Ball constructor function creates individual ball objects with specific properties, while the BallOrganizer constructor function manages the arrangement and organization of balls on the table.
 *
 * The CueBall constructor function is responsible for the creation and management of the cue ball, including setting constraints for movement and handling interactions.
 * The ExtraFeature constructor function introduces additional gameplay elements, such as increasing the cue ball's mass, shrinking ball sizes, and tripling the points of each ball, adding an arcade-like twist to the game.
 *
 * The Table constructor function encapsulates the snooker table's components, including the generation and detection of impacts between the cue ball and cushions.
 * The helper functions manage various utility tasks, such as drawing shapes and handling mouse interactions.
 *
 * A scoreboard system tracks the player's score, accounting for both successful shots and fouls.
 * A stopwatch adds a time-based challenge, counting down from 10 minutes and allowing players to restart the game upon completion or timeout.
 *
 * Overall, my snooker application offers a unique and engaging experience by combining realistic physics and professional gameplay with creative, arcade-inspired features.
 * The result is a dynamic and entertaining game that stands out from traditional snooker simulations.
 */

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

var imageBg; // Variable to store the background image

// p5.js setup function, runs once at the start
function setup() {
  canvas = createCanvas(1280, 720); // Creating the game canvas
  angleMode(DEGREES); // Setting angle mode to degrees
  background(0); // Setting background color to black
  gameTable.generateCushions(); // Creating the table cushions
  helperFunc.snookerMouseInteraction(); // Setting up mouse interaction
  imageBg = loadImage("/assets/patrick-tomasso-QMDap1TAu0g-unsplash.jpg"); // Loading the background image
}

// p5.js draw function, runs continuously
function draw() {
  background(imageBg); // Clearing the canvas
  snookerEngine.update(engine); // Updating the physics engine

  // Set gravity to 0 to keep balls within the table
  engine.gravity.y = 0;

  gameTable.draw(); // Drawing the game table

  // Drawing the title of the game
  push();
  textSize(36);
  fill(255);
  stroke(255);
  text("SNOOKER ASSIGNMENT", width / 3, height / 15);
  pop();

  // Drawing the stopwatch timer
  stopwatch.drawWatch();

  // Checking if ball arrangement mode is selected
  if (!ballOrganizer.mode) {
    // Instructions to select ball arrangement mode
    push();
    textSize(24);
    fill(255);
    text(
      "Press for Ball Placement: 1 👉 ordered, 2 👉 unordered, 3 👉 partially ordered",
      width / 6.5,
      height - 120
    );
    pop();
  } else {
    // Displaying the selected mode and starting the game if mode is selected
    textSize(14);
    text("mode: " + ballOrganizer.mode, width / 50, height / 7);
    ballOrganizer.drawBalls(); // Drawing the balls on the table
    leaderBoard.showScore(); // Displaying the leaderboard

    if (!gameStart) {
      // Instructions to place the white ball if game hasn't started
      textSize(24);
      stroke(255);
      text(
        "Please click inside the D line to place the white ball",
        width / 4,
        height - 120
      );
    } else {
      // Game has started, showing additional instructions
      stopwatch.startCounting(); // Starting the stopwatch

      push();
      textSize(24);
      fill(255);
      text("press r to restart the game", width / 3, height - 120);
      pop();

      cueBall.draw(); // Drawing the cue ball
      ballOrganizer.showAim(); // Showing the aim for the cue ball

      // Handling game logic if the cue ball is in the field and not constrained
      if (cueBall.isInsideField() && !cueBall.ballConst) {
        ballOrganizer.drawFoul(); // Drawing foul messages
        gameTable.detectImpact(cueBall.ball); // Detecting collisions with the table
        ballOrganizer.detectImpact(cueBall.ball); // Detecting collisions with other balls
        ballOrganizer.detectFalling(); // Detecting if any ball falls into a pocket
        ballOrganizer.checkWin(); // Checking if the player has won

        if (cueBall.ballStatic()) {
          // Setting up the cue ball constraint if it is not moving
          cueBall.setConstraints(
            cueBall.ball.position.x,
            cueBall.ball.position.y
          );
          ballOrganizer.newTurn(); // Starting a new turn
          feature.deactivate(); // Deactivating any extra features
        }
      } else if (!cueBall.ballConst) {
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
  // if (!gameStart && !ballOrganizer.mode) {
  // }
  if (key.toLowerCase() === "1") {
    ballOrganizer.setMode("ordered"); // pyramid style ball arrangement
  }
  if (key.toLowerCase() === "2") {
    ballOrganizer.setMode("partial"); // only red balls are randomized
  }
  if (key.toLowerCase() === "3") {
    ballOrganizer.setMode("unordered"); // all balls are randomized
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
      cueBall.cueBallInit(mouseX, mouseY); // Setting up the cue ball at mouse position
      cueBall.setConstraints(mouseX, mouseY); // Setting up the cue ball constraint
      ballOrganizer.ballsSleep(true); // Putting all balls to sleep
      feature.placeButtons(); // Placing additional feature buttons
    }
  } else if (gameStart) {
    // Removing the constraint if the game is in progress
    cueBall.removeConstraint(cueBall.cueBallConstraint);
    ballOrganizer.ballsSleep(false); // Waking up all balls
  }
}
