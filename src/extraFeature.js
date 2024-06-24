/**
 * ExtraFeature class that creates the extra features that can be used in the game
 * if user uses a feature, the button is disabled and the feature cannot be used again
 * once the game restarts, the features can be used again
 */
function ExtraFeature() {
  //list of features already used
  let featuresUsed = [];
  //list of buttons
  let buttons = [];
  //list of features, their names, the functions they run when activated
  //and the functions to run after its been deactivated
  this.features = {
    mass: {
      title: "JUMBO BALL",
      activated: false,
      activate: () => {
        //increases the mass by 5x
        snookerBody.setMass(cueBall.cueBall, cueBall.cueBall.mass * 5);
      },
      deactivate: () => {
        //reset the mass back to normal, if mass is smaller than starting mass
        snookerBody.setMass(
          cueBall.cueBall,
          cueBall.cueBall.mass * (cueBall.cueBall.mass > 1 ? 1 / 5 : 1)
        );
      },
    },
    shrink: {
      title: "SHRINK BALLS",
      activated: false,
      activate: () => {
        //iterates through balls array
        for (type in ballOrganizer.allBalls) {
          for (ball of ballOrganizer.allBalls[type]) {
            //makes all balls ~30% smaller
            snookerBody.scale(ball.object, 2 / 3, 2 / 3);
          }
        }
      },
      deactivate: () => {
        for (type in ballOrganizer.allBalls) {
          for (ball of ballOrganizer.allBalls[type]) {
            //resets the area back to normal, if the area is smaller than starting
            if (ball.object.area < 91) {
              snookerBody.scale(ball.object, 3 / 2, 3 / 2);
            }
          }
        }
      },
    },
    points: {
      title: "3X POINTS",
      activated: false,
      activate: () => {
        //iterates through all balls and doubles their values
        for (type in ballOrganizer.allBalls) {
          for (ball of ballOrganizer.allBalls[type]) {
            ball.value *= 3;
          }
        }
      },
      deactivate: () => {
        //resets the points of all balls,
        for (type in ballOrganizer.allBalls) {
          for (ball of ballOrganizer.allBalls[type]) {
            //except colored balls that returns after being pocketed
            if (
              ball.color == "red" ||
              ball.value != ballOrganizer.colorfulBalls[ball.color].value
            ) {
              ball.value *= 1 / 2;
            }
          }
        }
      },
    },
    align: {
      title: "TO THE POCKETS",
      activated: false,
      activate: () => {
        //array of objects that contain the x y coordinates of the balls
        let positions = [
          { x: 220, y: 120 },
          { x: 600, y: 120 },
          { x: 980, y: 120 },
          { x: 220, y: 480 },
          { x: 600, y: 480 },
          { x: 980, y: 480 },
        ];

        //counter to only have 6 balls for the 6 pockets be moved
        let counter = 0;
        for (type in ballOrganizer.allBalls) {
          for (ball of ballOrganizer.allBalls[type]) {
            //randomly assigns balls based on a 70% and 50% probability for the red
            //and color respectively
            if (random() > (ball.color == "red" ? 0.7 : 0.5) && counter < 6) {
              let vector = positions[counter];
              snookerBody.setPosition(ball.object, {
                x: vector.x,
                y: vector.y,
              });
              counter++;
            }
          }
        }
      },
      deactivate: () => {
        return false;
      },
    },
  };

  /**
   * function that makes the button and its functionality
   * @param {*} feature: the feature object
   * @param {*} y: the y position of the button
   */
  const featureButton = (feature, y) => {
    const button = createButton(feature.title);
    //add button to the button array
    buttons.push(button);
    //places the button
    button.position(25, y);
    //if the feature has been used, deactivate the button
    if (featuresUsed.includes(feature)) {
      button.attribute("disabled", true);
    }
    //give onclick event listener to button
    button.mousePressed(function () {
      feature.activate();
      feature.activated = true;
      button.attribute("disabled", true);
      featuresUsed.push(feature);
    });
  };

  //functions that places the button on the screen
  this.placeButtons = () => {
    let y = 200;
    //hides the previously created buttons to avoid weird visual overlap effect
    for (button of buttons) {
      button.hide();
    }
    for (feature in this.features) {
      y += 50;
      featureButton(this.features[feature], y);
    }
  };
  //deactivates the features
  this.deactivate = () => {
    for (feature in this.features) {
      //run the deactivate function of the feature that is activated
      if (this.features[feature].activated) {
        this.features[feature].deactivate();
        this.features[feature].activated = false;
        // once the game restarts, the features can be used again
        this.features[feature.deactivate] = true;
      }
    }
  };
}
