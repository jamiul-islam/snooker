//initialize the all balls object to store red and colored balls
function BallOrganizer() {
  this.allBalls = {
    red: [],
    color: [],
  };

  // Initialize foul state and other game-related variables
  this.foul = false;
  let won = false;
  this.foulText = "";
  let subsequentColor = 0;
  let target = "Red Ball";
  this.redInside = false;
  let ballImpacted;
  this.mode;

  // Initialize the positions and values of colored balls
  this.colorfulBalls = {
    pink: {
      x: 720,
      y: 310 - 800 / 72,
      value: 6,
    },
    blue: {
      x: 600,
      y: 310 - 800 / 72,
      value: 5,
    },
    black: {
      x: 949,
      y: 310 - 800 / 72,
      value: 7,
    },
    brown: {
      x: 360,
      y: 310 - 800 / 72,
      value: 4,
    },
    green: {
      x: 360,
      y: 149 + 370 / 3,
      value: 2,
    },
    yellow: {
      x: 360,
      y: 249 + 370 / 3,
      value: 3,
    },
  };

  /**
   * Function to set the mode and create balls based on it
   * @param {*} mode: mode of ball arrangement
   */
  this.setMode = (mode) => {
    this.mode = mode;
    createBalls(mode);
  };

  /**
   * Function to create red balls in a pyramid arrangement
   */
  const createRedBalls = () => {
    let startX = 725;
    let startY = 305;
    const radius = 400 / 72;
    let space = 4;

    // Create red balls in a pyramid arrangement
    for (var i = 0; i < 6; i++) {
      let yPos = startY - i * radius;
      for (var j = 0; j < i; j++) {
        createBall(
          startX + i * (radius + space),
          yPos + 2 * j * radius,
          "red",
          1
        );
      }
    }
  };

  /**
   * Function to create a ball and add it to the world and respective array
   * @param {*} x: x-coordinate of the ball
   * @param {*} y: y-coordinate of the ball
   * @param {*} color: color of the ball
   * @param {*} value: value of the ball
   */
  const createBall = (x, y, color, value) => {
    let ball = new Ball(x, y, color, value);
    this.allBalls[color == "red" ? "red" : "color"].push(ball);
    snookerWorld.add(engine.world, [ball.object]);
  };

  /**
   * Function to create balls based on the selected mode
   * @param {*} mode: mode of ball arrangement
   */
  const createBalls = (mode) => {
    switch (mode) {
      // Create red balls in a pyramid arrangement
      case "ordered":
        createRedBalls();
        for (color in this.colorfulBalls) {
          createBall(
            this.colorfulBalls[color]["x"],
            this.colorfulBalls[color]["y"],
            color,
            this.colorfulBalls[color]["value"]
          );
        }
        break;

      // Create red balls randomly positioned
      case "unordered":
        for (let i = 0; i < 15; i++) {
          createBall(random(249, 949), random(149, 399), "red", 1);
          snookerSleeping.set(this.allBalls["red"][i]["object"], false);
        }
        for (var i = 0; i < Object.keys(this.colorfulBalls).length; i++) {
          let color = Object.keys(this.colorfulBalls)[i];
          createBall(
            random(249, 949),
            random(149, 399),
            color,
            this.colorfulBalls[color]["value"]
          );
          snookerSleeping.set(this.allBalls["color"][i]["object"], false);
        }
        break;

      // Create red balls randomly positioned
      case "partial":
        for (let i = 0; i < 15; i++) {
          createBall(random(249, 949), random(149, 399), "red", 1);
          snookerSleeping.set(this.allBalls["red"][i]["object"], false);
        }
        // Create colored balls in fixed positions
        for (var i = 0; i < Object.keys(this.colorfulBalls).length; i++) {
          let color = Object.keys(this.colorfulBalls)[i];
          createBall(
            this.colorfulBalls[color]["x"],
            this.colorfulBalls[color]["y"],
            color,
            this.colorfulBalls[color]["value"]
          );
        }
    }
  };

  /**
   * Function to set the sleep state of all balls
   * @param {*} asleep: boolean value to set the sleeping state of the balls
   */
  this.ballsSleep = (asleep) => {
    for (type in this.allBalls) {
      for (ball of this.allBalls[type]) {
        snookerSleeping.set(ball.object, asleep);
      }
    }
  };

  /**
   * Function to draw all the balls on the canvas
   */
  this.drawBalls = () => {
    for (ballType in this.allBalls) {
      for (ball of this.allBalls[ballType]) {
        push();
        fill(ball.color);
        noStroke();
        helperFunc.drawVertices(ball.object.vertices);
        pop();
      }
    }
  };

  /**
   * Function to detect when balls fall into pockets
   * and handle the game logic accordingly
   * @returns a message if a foul is detected
   */
  this.detectFalling = () => {
    for (ballType in this.allBalls) {
      for (ball of this.allBalls[ballType]) {
        if (ball.object.position.y <= 106 || ball.object.position.y >= 494) {
          if (ball.color == "red") {
            this.redInside = true;
            removeBall(this.allBalls.red, this.allBalls.red.indexOf(ball));
            target = "Colored Ball";
          } else {
            removeBall(this.allBalls.color, this.allBalls.color.indexOf(ball));
            subsequentColor++;
            if (subsequentColor >= 2) {
              this.foul = true;
              this.foulText = "two subsequent colorful balls fell";
            }
            if (this.allBalls.red.length != 0) {
              createBall(
                this.colorfulBalls[ball.color].x,
                this.colorfulBalls[ball.color].y,
                ball.color,
                ball.value
              );
            } else {
              target = "Red Ball";
            }
            if (
              this.allBalls.red.length == 0 &&
              this.allBalls.color.length == 0
            ) {
              won = true;
            }
            this.redInside = false;
          }
          leaderBoard.addScore(this.foul ? 0 : ball.value);
        }
      }
    }
  };

  /**
   * Function to remove a ball from the world and array
   * @param {*} array: array from which the ball is to be removed
   * @param {*} index: index of the ball to be removed
   */
  const removeBall = (array, index) => {
    snookerWorld.remove(engine.world, [array[index].object]);
    array.splice(index, 1);
  };

  /**
   * Function to detect collisions between the cue ball and other balls
   * @param {*} cueBall: the cue ball object
   */
  this.detectCollision = (cueBall) => {
    for (ballType in this.allBalls) {
      for (ball of this.allBalls[ballType]) {
        if (snookerCollision.collides(cueBall, ball.object)) {
          if (ball.color == "red") {
            redBallCollided();
          } else {
            coloredBallsCollided();
          }
          target = "Red ball";
        }
      }
    }
  };

  // Function to draw a foul message on the canvas
  this.drawFoul = () => {
    push();
    textSize(24);
    stroke(this.foul ? "red" : 0);
    fill(this.foul ? "red" : 0);
    text("Foul: " + this.foulText, 460, 690);
    pop();
  };

  // Function to handle logic when a red ball is hit
  const redBallCollided = () => {
    if ((this.redInside || ballImpacted == "color") && !this.foul) {
      this.foul = true;
      this.foulText = "Red ball Hit";
      leaderBoard.addScore(-4);
    }
    this.redInside = false;
    ballImpacted = "red";
  };

  // Function to handle logic when a colored ball is hit
  const coloredBallsCollided = () => {
    if (!this.redInside && this.allBalls.red.length != 0 && !this.foul) {
      this.foul = true;
      this.foulText = "Coloured ball Hit";
      leaderBoard.addScore(-4);
    }
    this.redInside = false;
    ballImpacted = "color";
  };

  // Function to start a new turn, resetting necessary variables
  this.newTurn = () => {
    this.foul = false;
    this.foulText = "";
    ballImpacted = "";
    subsequentColor = 0;
    this.ballsSleep(true);
  };

  // Function to check for a win condition and display a message if won
  this.checkWin = () => {
    if (won) {
      push();
      textSize(40);
      stroke(won ? "green" : 0);
      fill(won ? "green" : 0);
      text("You Win!", 400, 700);
      pop();
      setTimeout(() => {
        noLoop();
      }, 1490);
    }
  };

  // Function to show the target ball on the canvas
  this.showTarget = () => {
    push();
    textSize(20);
    stroke(255);
    fill("white");
    text("Target: " + target, 949, 50);
    pop();
  };
}
