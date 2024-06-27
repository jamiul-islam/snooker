/**
 * this function is used to organize the balls in the snooker game
 * @constructor BallOrganizer object to organize the balls in the snooker game
 * @method setMode Function to set the mode and create balls based on it
 * @method createRedBalls Function to create red balls in a pyramid arrangement
 * @method createBall Function to create a ball and add it to the world and respective array
 */

function BallOrganizer() {
  this.allBalls = {
    red: [],
    color: [],
  };

  // Define the array of dimensions with calculated results
  const DIMENSIONS = [
    720, //               (x of pink)
    310 - 800 / 72, //    (y of pink)
    600, //               (x of blue)
    310 - 800 / 72, //    (y of blue)
    950, //               (x of black)
    310 - 800 / 72, //    (y of black)
    360, //               (x of brown)
    310 - 800 / 72, //    (y of brown)
    360, //               (x of green)
    150 + 370 / 5, //     (y of green)
    360, //               (x of yellow)
    250 + 370 / 3, //     (y of yellow)
  ];

  // Initialize foul state and other game-related variables
  this.foul = false;
  let won = false;
  this.foulText = "";
  let subsequentColor = 0;
  let aim = "Red Ball";
  this.redInside = false;
  let ballImpacted;
  this.mode;

  // Initialize the positions and values of colorful balls
  this.colorfulBalls = {
    pink: {
      x: DIMENSIONS[0],
      y: DIMENSIONS[1],
      value: 6,
    },
    blue: {
      x: DIMENSIONS[2],
      y: DIMENSIONS[3],
      value: 5,
    },
    black: {
      x: DIMENSIONS[4],
      y: DIMENSIONS[5],
      value: 7,
    },
    brown: {
      x: DIMENSIONS[6],
      y: DIMENSIONS[7],
      value: 4,
    },
    green: {
      x: DIMENSIONS[8],
      y: DIMENSIONS[9],
      value: 2,
    },
    yellow: {
      x: DIMENSIONS[10],
      y: DIMENSIONS[11],
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

      // all balls randomly positioned
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

      // only red balls randomly positioned
      case "partial":
        for (let i = 0; i < 15; i++) {
          let posX = map(noise(i * 0.1), 0, 1, 300, 900); // Adjusted range to stay within table bounds
          let posY = map(noise(i * 0.1 + 1000), 0, 1, 150, 380); // Adjusted range to stay within table bounds
          createBall(posX, posY, "red", 1);
          snookerSleeping.set(this.allBalls["red"][i]["object"], false);
        }
        // Colorful balls in fixed positions
        for (var i = 0; i < Object.keys(this.colorfulBalls).length; i++) {
          let color = Object.keys(this.colorfulBalls)[i];
          createBall(
            this.colorfulBalls[color]["x"],
            this.colorfulBalls[color]["y"],
            color,
            this.colorfulBalls[color]["value"]
          );
        }
        break;
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
        helperFunc.drawShapes(ball.object.vertices);
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
            aim = "Colorful Ball";
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
              aim = "Red Ball";
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
  this.detectImpact = (cueBall) => {
    for (ballType in this.allBalls) {
      for (ball of this.allBalls[ballType]) {
        if (snookerCollision.collides(cueBall, ball.object)) {
          if (ball.color == "red") {
            redBallImpacted();
          } else {
            coloredBallsImpacted();
          }
          aim = "Red Ball";
        }
      }
    }
  };

  // Function to draw a foul message on the canvas
  this.drawFoul = () => {
    push();
    textSize(24);
    stroke(this.foul ? "red" : 255);
    fill(this.foul ? "red" : 255);
    text("Foul: " + this.foulText, width - 820, height - 30);
    pop();
  };

  // Function to handle logic when a red ball is hit
  const redBallImpacted = () => {
    if ((this.redInside || ballImpacted == "color") && !this.foul) {
      this.foul = true;
      this.foulText = "Red ball was hit";
      leaderBoard.addScore(-4);
    }
    this.redInside = false;
    ballImpacted = "red";
  };

  // Function to handle logic when a colorful ball is hit
  const coloredBallsImpacted = () => {
    if (!this.redInside && this.allBalls.red.length != 0 && !this.foul) {
      this.foul = true;
      this.foulText = "Colorful ball was Hit";
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
      text("You Win!", width - 880, height - 20);
      pop();
      setTimeout(() => {
        noLoop();
      }, 1490);
    }
  };

  // Function to show the aim ball on the canvas
  this.showAim = () => {
    push();
    textSize(20);
    stroke(255);
    fill(255);
    text("Aim: " + aim, width - 330, height - 670);
    pop();
  };
}
