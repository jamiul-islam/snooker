/**
 * this file contains the CueBall class which is responsible for creating the cue ball object and its constraints
 * @method cueBallInit - initializes the cue ball at a given position (x, y)
 * @method setConstraints - sets up constraints at a given position (x, y) to enable cue ball movement
 * @method removeConstraint - removes the constraint after releasing the cue ball
 * @method draw - draws the cue ball and its constraint
 * @method ballStatic - checks whether the cue ball is almost stationary (returns boolean)
 * @method isInsideField - checks whether the cue ball is within the playing field boundaries (returns boolean)
 * @method velocityLimit - limits the velocity of the cue ball to a maximum of 20
 * @method drawConst - draws the constraint line between the cue ball and the point of constraint
 */

function CueBall() {
  // Cue ball object
  this.ball;
  // Constraint for the cue ball
  this.cueBallConstraint;
  // Flag to check if the constraint is active
  this.ballConst = false;

  /**
   * Initializes the cue ball at a given position (x, y)
   * @param {*} x: x-coordinate of the cue ball
   * @param {*} y: y-coordinate of the cue ball
   */
  this.cueBallInit = (x, y) => {
    // Create a circle representing the cue ball with specific friction and restitution
    this.ball = snookerBodies.circle(x, y, 400 / 72, {
      restitution: 0.7,
      friction: 0.4,
    });

    // Double the mass of the cue ball
    snookerBody.setMass(this.ball, (this.ball.mass *= 2));
    // Add the cue ball to the snooker world
    snookerWorld.add(engine.world, [this.ball]);
  };

  /**
   * Sets up constraints at a given position (x, y) to enable cue ball movement
   * @param {*} x: x-coordinate of the constraint
   * @param {*} y: y-coordinate of the constraint
   */
  this.setConstraints = (x, y) => {
    this.cueBallConstraint = snookerConstraint.create({
      pointA: { x: x, y: y },
      bodyB: this.ball,
      stiffness: 0.01,
      damping: 0.0001,
    });

    // Set flag indicating that constraint is active
    this.ballConst = true;

    // Enable clicking when constraint is recreated
    document.getElementsByTagName("BODY")[0].style["pointer-events"] = "auto";
    // Add the constraint to the snooker world
    snookerWorld.add(engine.world, [this.cueBallConstraint]);
  };

  /**
   * Removes the constraint after releasing the cue ball
   * @param {*} constraint: Constraint to be removed
   */
  this.removeConstraint = (constraint) => {
    setTimeout(() => {
      // Limit the velocity of the cue ball
      snookerBody.setVelocity(this.ball, {
        x: velocityLimit(this.ball.velocity.x),
        y: velocityLimit(this.ball.velocity.y),
      });

      // Remove the constraint from the cue ball
      constraint.bodyB = null;
      constraint.pointA = { x: 0, y: 0 };
      this.ballConst = false;
      snookerWorld.remove(engine.world, [constraint]);
    }, 100);

    // Disable clicking when there is no constraint
    document.getElementsByTagName("BODY")[0].style["pointer-events"] = "none";
  };

  /**
   * Draws the constraint line between the cue ball and the point of constraint
   * @param {*} constraint: Constraint to be drawn
   */
  const drawConst = (constraint) => {
    push();
    var offsetA = constraint.pointA;
    var posA = { x: 0, y: 0 };
    if (constraint.bodyA) {
      posA = constraint.bodyA.position;
    }
    var offsetB = constraint.pointB;
    var posB = { x: 0, y: 0 };
    if (constraint.bodyB) {
      posB = constraint.bodyB.position;
    }

    strokeWeight(3);
    stroke("#B99976");
    line(
      posA.x + offsetA.x,
      posA.y + offsetA.y,
      posB.x + offsetB.x,
      posB.y + offsetB.y
    );
    pop();
  };

  /**
   * Limits the velocity of the cue ball to a maximum of 20
   * @param {*} velocity: Velocity of the cue ball
   * @returns Limited velocity of the cue ball
   */
  function velocityLimit(velocity) {
    return velocity > 0 ? min(velocity, 20) : max(velocity, -20);
  }

  // Draws the cue ball and its constraint
  this.draw = () => {
    push();
    fill(255);
    helperFunc.drawShapes(this.ball.vertices);
    stroke(0);
    strokeWeight(3);
    drawConst(this.cueBallConstraint);
    pop();
  };

  // Checks whether the cue ball is almost stationary (returns boolean)
  this.ballStatic = () => {
    if (
      Math.abs(this.ball.velocity.x) <= 0.05 &&
      Math.abs(this.ball.velocity.y) < 0.05
    )
      return true;
  };

  // Checks whether the cue ball is within the playing field boundaries (returns boolean)
  this.isInsideField = () => {
    return cueBall.ball.position.y >= 100 && cueBall.ball.position.y <= 490;
  };
}
