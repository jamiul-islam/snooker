function BallOrganizer() {
  this.allBalls = {
    red: [],
    color: [],
  };
  this.foul = false;
  let won = false;
  this.foulText = "";
  let subsequentColor = 0;
  let target = "Red Ball";
  this.redInside = false;
  let ballImpacted;
  // ball arrangement mode
  this.mode;
  // details of the colored balls
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

  //changes the mode and creates the balls
  this.setMode = (mode) => {
    this.mode = mode;
    createBalls(mode);
  };

  //creates specifically red balls with the patterns
  const createRedBalls = () => {
    let startX = 725;
    let startY = 305;
    const radius = 400 / 72;
    let space = 4;
    //creates the pyramid pattern for the red ball
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

  //creates a ball and adds it to the appropriate array
  //and the world
  const createBall = (x, y, color, value) => {
    let ball = new Ball(x, y, color, value);
    this.allBalls[color == "red" ? "red" : "color"].push(ball);
    snookerWorld.add(engine.world, [ball.object]);
  };

  //creates the balls with positions based on the mode
  const createBalls = (mode) => {
    //certain balls are awake so that placement doesn't overlap
    //especially on the modes that require random placement
    switch (mode) {
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
      case "unordered":
        //set all balls awake so they don't overlap
        for (let i = 0; i < 15; i++) {
          //randomly place the red balls
          createBall(random(249, 949), random(149, 399), "red", 1);
          snookerSleeping.set(this.allBalls["red"][i]["object"], false);
        }
        for (var i = 0; i < Object.keys(this.colorfulBalls).length; i++) {
          let color = Object.keys(this.colorfulBalls)[i];
          //randomly place the colored balls
          createBall(
            random(249, 949),
            random(149, 399),
            color,
            this.colorfulBalls[color]["value"]
          );
          snookerSleeping.set(this.allBalls["color"][i]["object"], false);
        }
        break;
      case "partial":
        for (let i = 0; i < 15; i++) {
          createBall(random(249, 949), random(149, 399), "red", 1);
          //set red balls awake so they dont overlap
          snookerSleeping.set(this.allBalls["red"][i]["object"], false);
        }
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

  //changes the sleep state of the balls
  this.ballsSleep = (asleep) => {
    for (type in this.allBalls) {
      for (ball of this.allBalls[type]) {
        snookerSleeping.set(ball.object, asleep);
      }
    }
  };

  //draws the balls in the balls object
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

  //detects the balls going into holes
  this.detectFalling = () => {
    //iterates through the balls and checks if they're in field
    for (ballType in this.allBalls) {
      for (ball of this.allBalls[ballType]) {
        if (ball.object.position.y <= 106 || ball.object.position.y >= 494) {
          if (ball.color == "red") {
            this.redInside = true;
            //if its red remove it from the array
            removeBall(this.allBalls.red, this.allBalls.red.indexOf(ball));
            target = "Colored Ball";
          } else {
            //removes the original ball from the object
            removeBall(this.allBalls.color, this.allBalls.color.indexOf(ball));
            //in one turn adds the number of consecutive color balls that fell
            subsequentColor++;
            //if its greater or equal to two put a prompt
            if (subsequentColor >= 2) {
              this.foul = true;
              this.foulText = "two subsequent colorful balls fell";
            }
            //adds the ball back if there are still reds on the table
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
          //adds the value of the ball pocketed if there is no foul
          leaderBoard.addScore(this.foul ? 0 : ball.value);
        }
      }
    }
  };

  const removeBall = (array, index) => {
    //removes the ball from the world
    snookerWorld.remove(engine.world, [array[index].object]);
    //removes it from the array
    array.splice(index, 1);
  };

  //detects collision between the white ball and the red or colored
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

  this.drawFoul = () => {
    //draws the foul by making it red if there is a foul
    push();
    textSize(24);
    stroke(this.foul ? "red" : 0);
    fill(this.foul ? "red" : 0);
    //gives the description based on the foul message
    text("Foul: " + this.foulText, 460, 690);
    pop();
  };

  //code that runs if red ball is hit
  const redBallCollided = () => {
    //checks if its a legal or non legal hit
    if ((this.redInside || ballImpacted == "color") && !this.foul) {
      this.foul = true;
      this.foulText = "Red ball Hit";
      leaderBoard.addScore(-4);
    }
    this.redInside = false;
    ballImpacted = "red";
  };

  //code that runs if a colored ball is hit
  const coloredBallsCollided = () => {
    //checks if its a legal or non legal hit
    if (!this.redInside && this.allBalls.red.length != 0 && !this.foul) {
      this.foul = true;
      this.foulText = "Coloured ball Hit";
      leaderBoard.addScore(-4);
    }
    this.redInside = false;
    ballImpacted = "color";
  };

  //starts a new turn by resetting to default variables
  this.newTurn = () => {
    this.foul = false;
    this.foulText = "";
    ballImpacted = "";
    subsequentColor = 0;
    this.ballsSleep(true);
  };

  //checks for a win and draws if player has cleared the table
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

  //shows the target ball
  this.showTarget = () => {
    push();
    textSize(20);
    stroke(255);
    fill("white");
    text("Target: " + target, 949, 50);
    pop();
  };
}
