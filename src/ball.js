/**
 * @param {*} x: x-coordinate of the ball
 * @param {*} y: y-coordinate of the ball
 * @param {*} color: color of the ball
 * @param {*} value: value of the ball
 * @returns an object with the matter js body, the ball's color, and the value
 */

function Ball(x, y, color, value) {
  return {
    object: snookerBodies.circle(x, y, 200 / 36, {
      isSleeping: true,
      collisionFilter: { category: 0x0002 }, // disable mouse interaction with red balls
      restitution: 0.4,
      friction: 0.2,
    }),
    color: color,
    value: value,
  };
}
