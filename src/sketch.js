/*
 * --------Game Initialization--------
 *
 * The game begins when the user presses one of three numeric choices on the keyboard: 1, 2, or 3,
 * each corresponding to a different ball arrangement:
 *
 *   - Ordered (1): The balls are arranged in a pyramid configuration.
 *   - Partial (2): Only the red balls are randomly scattered across the table.
 *   - Unordered (3): All balls are randomly distributed across the table.
 *
 * For random ball distribution, the application utilizes the random function for the unordered mode and the noise function for the partial mode.
 * The game starts only when the player positions the cue ball inside the D-line.
 *
 * --------Ball Properties and Organization--------
 *
 * Each ball in the simulation is endowed with appropriate restitution and friction properties to emulate realistic bouncing and slowing effects.
 * Balls are managed within an array, allowing dynamic interaction and removal. The ballOrganizer.js class includes the detectImpact() function,
 * which evaluates collisions between the cue ball and other balls on the table.
 *
 * --------Cue Stick Mechanics--------
 *
 * The cue stick in the simulation is modeled as an elastic band with dynamic constraints. When the cue ball is struck,
 * it moves in various directions based on the applied force. The physics engine ensures that excessive force can propel the cue ball off the table.
 * Error-checking mechanisms are in place to prompt the user to reposition the cue ball within the D-line if it exits the table or falls into one of the six pockets.
 *
 * --------Cushion Physics and Visual Features--------
 *
 * Physics on the table cushions is implemented by assigning appropriate restitution values to simulate bounciness.
 * Additionally, a unique feature was added where the cue ball changes color from dark green to light green upon hitting the cushion,
 * providing a visual indication of collision. This feature, although was primarily for testing, remains in the final version due to its appealing aesthetics.
 *
 * --------Extra Features--------
 *
 * I developed extra functionalities and implemented four unique features using button interactions that challenged and required me to extensively depend on the Matter.js documentation throughout the past weeks:
 *
 *   - Jumbo Ball: Increases the weight of the cue ball by five times upon clicking the button.
 *   - Shrink Size: Reduces the size of all balls, excluding the cue ball, to approximately 60% of their original size.
 *   - 3X Score: Triples the player's score.
 *   - To Pockets: Randomly arranges six red balls at the six pockets of the table iteratively when the button is clicked.
 *
 * --------FACTORY PATTERN AND OOP FEATURES--------
 *
 * In this project I've used OOP features like encapsulation, inheritance, and polymorphism were applied extensively.
 * Encapsulation helped protect the internal state of objects, exposing only what was necessary.
 * Inheritance allowed for a hierarchy of classes, so shared behaviors among different ball types were efficiently managed.
 * Polymorphism enabled dynamic method overriding, allowing each ball type to behave uniquely when needed.
 *
 * References:
 * [1] https://www.geeksforgeeks.org/javascript-program-to-print-pyramid-pattern-by-using-numbers
 *   - Learned how to draw pyramid shapes, then modified the code to draw triangular shape of ball arrangement at keyboard press 1
 *
 * [2] https://natureofcode.com/physics-libraries/#matterjs-constraints
 *   - Took the constraints snippet of code from these resources and modified it in my application as needed.
 *
 * [3] https://editor.p5js.org/pedbad/sketches/0p6fA4hKe
 *   - Took the noise function code snippet from this resource to draw partially ordered balls in the keyboard’s numeric keystroke 2
 *
 * [4] https://unsplash.com/photos/gray-concrete-bricks-painted-in-blue-QMDap1TAu0g
 *   - Used this licence-free photo as a background for my snooker application
 *
 * [5] https://www.soundsnap.com/tags/billiards
 *   - Used this website for licence-free 3 license-free sounds for collision
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
var ballWasHit; // Variable to store the sound of the ball being hit
var ballFell; // Variable to store the sound of the ball falling into a pocket
var cusionHit; // Variable to store the sound of the ball hitting a cushion

// function to preload the sound
function preload() {
  soundFormats("mp3", "ogg");
  ballWasHit = loadSound(
    "/assets/383944-Billiards-Pool-Sports-sport-shot-ball-pocket-fall-14 (mp3cut.net).wav"
  );
  ballFell = loadSound(
    "/assets/69327-Pool_ricochet_ball_in_pocket_empty_billiards-BLASTWAVEFX-08258 (mp3cut.net).wav"
  );
  cusionHit = loadSound(
    "/assets/383892-Billiards-Pool-Sports-sport-drop-ball-on-table-05 (mp3cut.net).wav"
  );
}

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
