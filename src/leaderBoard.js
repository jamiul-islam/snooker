/**
 * shows the score of the player
 * @method addScore: adds the score
 * @param {Number} s - score to be added
 * @method showScore: shows the scoreboard
 */

function LeaderBoard() {
  let score = 0;
  //adds the score
  this.addScore = (s) => {
    score += s;
  };

  //shows the scoreboard
  this.showScore = () => {
    push();
    textSize(24);
    fill(255);
    stroke("white");
    text("Score: " + score, width - 230, height - 320);
  };
}
