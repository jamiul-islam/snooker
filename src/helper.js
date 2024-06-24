/**
 * draws vertices of a given shape
 * @param {Array} shapes - array of vertices
 * @method: snookerMouseInteraction:
 *        1. sets up the mouse interaction with the cue ball
 *        2. disables mouse interaction with the other balls
 *        3. disables the mouse interaction with all balls except the cue ball
 */
function Helper() {
  this.drawShapes = (shapes) => {
    beginShape();
    for (let i = 0; i < shapes.length; i++) {
      vertex(shapes[i].x, shapes[i].y);
    }
    endShape(CLOSE);
  };

  this.snookerMouseInteraction = () => {
    const mouse = snookerMouse.create(canvas.elt);
    const mouseParams = {
      mouse: mouse,
      constraint: { stiffness: 0.05 },
    };
    mouseConstraint = snookerMouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    mouseConstraint.collisionFilter.mask = 0x0001;
    snookerWorld.add(engine.world, mouseConstraint);
  };
}
