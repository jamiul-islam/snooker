function ExtraFeature() {
  //list of features already used
  let featuresUsed = [];
  //list of buttons
  let featureButtons = [];
  //list of features, their names, the functions they run when activated
  //and the functions to run after its been deactivated
  this.features = {
    mass: {
      title: "JUMBO BALL",
      activated: false,
      activate: () => {
        // 5 times the mass of the cue ball
        snookerBody.setMass(cueBall.ball, cueBall.ball.mass * 5);
      },
      deactivate: () => {
        // if the mass is smaller than the original mass, reset it
        snookerBody.setMass(
          cueBall.ball,
          cueBall.ball.mass * (cueBall.ball.mass > 1 ? 1 / 5 : 1)
        );
      },
    },
    shrink: {
      title: "SHRINK SIZE",
      activated: false,
      activate: () => {
        for (type in ballOrganizer.allBalls) {
          for (ball of ballOrganizer.allBalls[type]) {
            //turn all balls ~60% smaller
            snookerBody.scale(ball.object, 3 / 5, 3 / 5);
          }
        }
      },
      deactivate: () => {
        for (type in ballOrganizer.allBalls) {
          for (ball of ballOrganizer.allBalls[type]) {
            // resets the size of the balls
            if (ball.object.area < 91) {
              snookerBody.scale(ball.object, 3 / 5, 3 / 5);
            }
          }
        }
      },
    },
    points: {
      title: "3X SCORE !!",
      activated: false,
      activate: () => {
        for (type in ballOrganizer.allBalls) {
          for (ball of ballOrganizer.allBalls[type]) {
            ball.value *= 3;
          }
        }
      },
      deactivate: () => {
        // resets the points of all balls
        for (type in ballOrganizer.allBalls) {
          for (ball of ballOrganizer.allBalls[type]) {
            // except colored balls that returns after being pocketed
            if (
              ball.color == "red" ||
              ball.value != ballOrganizer.colorfulBalls[ball.color].value
            ) {
              ball.value *= 1 / 3;
            }
          }
        }
      },
    },
    align: {
      title: "TO POCKETS",
      activated: false,
      activate: () => {
        //array of objects that contain the x y coordinates of the balls
        let positions = [
          { x: 221, y: 119 },
          { x: 601, y: 119 },
          { x: 981, y: 119 },
          { x: 221, y: 481 },
          { x: 601, y: 481 },
          { x: 981, y: 481 },
        ];

        // ballCounter to only have 6 balls for the 6 pockets be moved
        let ballCounter = 0;
        for (type in ballOrganizer.allBalls) {
          for (ball of ballOrganizer.allBalls[type]) {
            //randomly assigns balls based on a 70% and 50% probability for the red
            //and color respectively
            if (
              random() > (ball.color == "red" ? 0.7 : 0.5) &&
              ballCounter < 6
            ) {
              let vector = positions[ballCounter];
              snookerBody.setPosition(ball.object, {
                x: vector.x,
                y: vector.y,
              });
              ballCounter++;
            }
          }
        }
      },
      deactivate: () => {
        return false;
      },
    },
  };

  //function that makes the button and its functionality
  const makeFeatureButtons = (item, y) => {
    const button = createButton(item.title);
    //add button to the button array
    featureButtons.push(button);
    //places the button
    button.position(25, y);
    //if the item has been used, deactivate the button
    if (featuresUsed.includes(item)) {
      button.attribute("disabled", true);
    }
    //give onclick event listener to button
    button.mousePressed(function () {
      item.activate();
      item.activated = true;
      button.attribute("disabled", true);
      featuresUsed.push(item);
    });
  };

  //functions that places the button on the screen
  this.placeButtons = () => {
    let y = 200;
    //hides the previously created buttons to avoid weird visual overlap effect
    for (button of featureButtons) {
      button.hide();
    }
    for (item in this.features) {
      y += 50;
      makeFeatureButtons(this.features[item], y);
    }
  };
  //deactivates the features
  this.deactivate = () => {
    for (item in this.features) {
      //run the deactivate function of the item that is activated
      if (this.features[item].activated) {
        this.features[item].deactivate();
        this.features[item].activated = false;
      }
    }
  };
}
