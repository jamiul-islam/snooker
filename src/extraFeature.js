/**
 * ExtraFeature class to handle the activation and deactivation of extra features
 * @method features: Object to store the features, including their names, activation, and deactivation functions
 * @method placeButtons: Function to place the feature buttons on the screen
 * @method deactivate: Function to deactivate all activated features
 * @method makeFeatureButtons: Function to create a button for each feature and set up its functionality
 */

function ExtraFeature() {
  // Array to keep track of features that have already been used
  let featuresUsed = [];
  // Array to store the feature buttons
  let featureButtons = [];

  this.features = {
    mass: {
      title: "JUMBO BALL",
      activated: false,
      activate: () => {
        // Increase the mass of the cue ball by 5 times
        snookerBody.setMass(cueBall.ball, cueBall.ball.mass * 5);
      },
      deactivate: () => {
        // Reset the mass to its original value, if it is greater than the initial mass
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
        // Iterate through all balls and reduce their size by approximately 60%
        for (let type in ballOrganizer.allBalls) {
          for (let ball of ballOrganizer.allBalls[type]) {
            snookerBody.scale(ball.object, 3 / 5, 3 / 5);
          }
        }
      },
      deactivate: () => {
        // Reset the size of all balls to their original dimensions
        for (let type in ballOrganizer.allBalls) {
          for (let ball of ballOrganizer.allBalls[type]) {
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
        // Iterate through all balls and triple their points value
        for (let type in ballOrganizer.allBalls) {
          for (let ball of ballOrganizer.allBalls[type]) {
            ball.value *= 3;
          }
        }
      },
      deactivate: () => {
        // Reset the points of all balls
        for (let type in ballOrganizer.allBalls) {
          for (let ball of ballOrganizer.allBalls[type]) {
            // Skip colorful balls that return after being pocketed
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
        // Predefined positions for aligning balls to pockets
        let positions = [
          { x: width - 1060, y: height - 600 },
          { x: width - 680, y: height - 600 },
          { x: width - 300, y: height - 600 },
          { x: width - 1060, y: height - 240 },
          { x: width - 680, y: height - 240 },
          { x: width - 300, y: height - 240 },
        ];

        // Counter to limit alignment to 6 balls
        let ballCounter = 0;
        for (let type in ballOrganizer.allBalls) {
          for (let ball of ballOrganizer.allBalls[type]) {
            // Randomly align balls based on a probability (70% for red, 50% for others)
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
        // No specific deactivation logic needed
        return false;
      },
    },
  };

  /**
   * Function to create a button for each feature and set up its functionality
   * @param {*} item: Feature object containing title, activation, and deactivation functions
   * @param {*} y: Vertical position of the button on the screen
   */
  const makeFeatureButtons = (item, y) => {
    const button = createButton(item.title);
    // Add the button to the featureButtons array
    featureButtons.push(button);
    // Set the button's position on the screen
    button.position(25, y);
    // Disable the button if the feature has already been used
    if (featuresUsed.includes(item)) {
      button.attribute("disabled", true);
    }
    // Set up the button's click event listener
    button.mousePressed(function () {
      item.activate();
      item.activated = true;
      button.attribute("disabled", true);
      featuresUsed.push(item);
    });
  };

  // Function to place the feature buttons on the screen
  this.placeButtons = () => {
    let y = 200;
    // Hide previously created buttons to avoid visual overlap
    for (let button of featureButtons) {
      button.hide();
    }
    // Create and position new buttons for each feature
    for (let item in this.features) {
      y += 50;
      makeFeatureButtons(this.features[item], y);
    }
  };

  // Function to deactivate all activated features
  this.deactivate = () => {
    for (let item in this.features) {
      // Run the deactivate function for each activated feature
      if (this.features[item].activated) {
        this.features[item].deactivate();
        this.features[item].activated = false;
      }
    }
  };
}
