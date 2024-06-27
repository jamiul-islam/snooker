/**
 * Table class to represent the snooker table and its components
 * @constructor Table object to represent the snooker table
 * @method generateCushions Function to generate cushions on the table
 * @method detectImpact Function to detect impacts between the cue ball and cushions
 * @method draw Function to draw the table and its components
 * @method drawCushions Function to draw cushions on the table
 */

function Table() {
  // Array to store cushion objects
  let cushions = [];

  // Constants defining table dimensions and cushion properties
  const widthOfTable = 800;
  const lengthOfTable = widthOfTable / 2;
  const sizeOfHole = widthOfTable / 36;
  const heightOfCushion = 10;
  const angleOfCushion = 0.05;

  // Function to generate cushions as trapezoids and add them to the table
  this.generateCushions = () => {
    // Add six cushions at specific positions with specified properties
    cushions.push(
      snookerBodies.trapezoid(
        402, // x position
        105, // y position
        lengthOfTable - sizeOfHole * 2 - 13, // top width
        heightOfCushion, // height
        -0.07, // angle
        {
          isStatic: true, // Static so they don't move
          restitution: 1, // Bounciness
        }
      )
    );
    cushions.push(
      snookerBodies.trapezoid(
        800,
        105,
        lengthOfTable - sizeOfHole * 2 - 10,
        heightOfCushion,
        -angleOfCushion,
        {
          isStatic: true,
          restitution: 1,
        }
      )
    );
    cushions.push(
      snookerBodies.trapezoid(
        widthOfTable - 595,
        300,
        lengthOfTable - sizeOfHole * 2 + 9,
        heightOfCushion,
        angleOfCushion,
        {
          isStatic: true,
          angle: Math.PI / 2, // Rotate 90 degrees
          restitution: 1,
        }
      )
    );
    cushions.push(
      snookerBodies.trapezoid(
        403,
        lengthOfTable + 95,
        lengthOfTable - sizeOfHole * 2 + 9,
        heightOfCushion,
        angleOfCushion,
        {
          isStatic: true,
          restitution: 1,
        }
      )
    );
    cushions.push(
      snookerBodies.trapezoid(
        797,
        lengthOfTable + 95,
        lengthOfTable - sizeOfHole * 2 + 12,
        heightOfCushion,
        angleOfCushion,
        {
          isStatic: true,
          restitution: 1,
        }
      )
    );
    cushions.push(
      snookerBodies.trapezoid(
        995,
        300,
        lengthOfTable - sizeOfHole * 2 - 12,
        heightOfCushion,
        -angleOfCushion,
        {
          isStatic: true,
          angle: Math.PI / 2, // Rotate 90 degrees
          restitution: 1,
        }
      )
    );

    // Add cushions to the world for rendering and physics calculations
    for (let cushion of cushions) {
      snookerWorld.add(engine.world, [cushion]);
    }
  };

  // Function to draw the table's playing field
  const drawTableField = () => {
    noStroke();
    fill("#4b8232"); // Green color
    rect(widthOfTable / 4, lengthOfTable - 300, widthOfTable, lengthOfTable); // Draw rectangle representing the field
  };

  // Function to draw the sides (rails) around the table
  const drawSides = () => {
    fill("#41240f"); // Brown color for the rails
    rect(widthOfTable - 615, lengthOfTable - 300, 15, lengthOfTable); // Left rail
    rect(widthOfTable / 4, lengthOfTable - 315, widthOfTable, 15); // Top rail
    rect(widthOfTable + 200, lengthOfTable - 300, 15, lengthOfTable); // Right rail
    rect(widthOfTable / 4, lengthOfTable + 100, widthOfTable, 15); // Bottom rail
  };

  // Function to draw yellow marking boxes on the table
  const drawYellowBox = () => {
    fill("#e2c640"); // Yellow color
    rect(widthOfTable - 615, lengthOfTable - 315, Math.floor(sizeOfHole + 3), Math.floor(sizeOfHole + 3), 15, 0, 0, 0); // Top left
    rect(widthOfTable - 212, lengthOfTable - 315, Math.floor(sizeOfHole + 3), 15); // Top middle
    rect(widthOfTable + 190, lengthOfTable - 315, Math.floor(sizeOfHole + 3), Math.floor(sizeOfHole + 3), 0, 15, 0, 0); // Top right
    rect(widthOfTable - 615, lengthOfTable + 90, Math.floor(sizeOfHole + 3), Math.floor(sizeOfHole + 3), 0, 0, 0, 15); // Bottom left
    rect(widthOfTable - 212, lengthOfTable + 100, Math.floor(sizeOfHole + 3), 15); // Bottom middle
    rect(widthOfTable + 190, lengthOfTable + 90, Math.floor(sizeOfHole + 3), Math.floor(sizeOfHole + 3), 0, 0, 15, 0); // Bottom right
  };

  // Function to draw holes on the table
  const drawTableHoles = () => {
    fill(0); // Black color
    ellipse(widthOfTable - 595, lengthOfTable - 296, sizeOfHole); // Top left
    ellipse(widthOfTable - 200, lengthOfTable - 296, sizeOfHole); // Top middle
    ellipse(widthOfTable + 196, lengthOfTable - 296, sizeOfHole); // Top right
    ellipse(widthOfTable - 595, lengthOfTable + 95, sizeOfHole); // Bottom left
    ellipse(widthOfTable - 200, lengthOfTable + 95, sizeOfHole); // Bottom middle
    ellipse(widthOfTable + 196, lengthOfTable + 95, sizeOfHole); // Bottom right
  };

  // Function to draw the "D" line on the table
  const drawDLine = () => {
    fill(255); // White color
    stroke(255); // White stroke
    line(
      widthOfTable - 440,
      lengthOfTable - 285,
      widthOfTable - 440,
      lengthOfTable + 85
    ); // Draw vertical line
    noFill();
    arc(200 + widthOfTable / 5, 175 + 370 / 3, 150, 150, 90, 270); // Draw semicircle arc
  };

  /**
   * Function to detect impacts between the cue ball and cushions
   * @param {*} cueBall: The cue ball object
   */
  this.detectImpact = (cueBall) => {
    for (let cushion of cushions) {
      if (snookerCollision.collides(cueBall, cushion)) {
        cushion.render.visible = false; // Hide cushion on collision
      } else {
        cushion.render.visible = true; // Show cushion otherwise
      }
    }
  };

  /**
   * Function to draw cushions on the table
   * @param {*} c: Array of cushion objects
   */
  const drawCushions = (c) => {
    for (let cushion of c) {
      push();
      noStroke();
      fill(cushion.render.visible ? "#326119" : "#18b255"); // Dark or light green based on visibility
      helperFunc.drawShapes(cushion.vertices); // Draw the cushion shape
      pop();
    }
  };

  // Main draw function to render the table and its components
  this.draw = function () {
    drawTableField();
    drawSides();
    drawYellowBox();
    drawTableHoles();
    drawDLine();
    drawCushions(cushions);
  };
}
