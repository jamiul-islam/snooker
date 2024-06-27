/**
 * counts and shows the time left
 * @method startCounting: starts counting down
 * @method drawWatch: draws the stopwatch
 */

function Stopwatch() {
  let mins = 10;
  let secs = 0;
  this.startCounting = () => {
    //60 frames per second so runs this func one every second
    if (frameCount % 60 == 0) {
      if (mins == 0 && secs == 0) {
        mins = 0;
        secs = 0;
        //kills the loop when time is over
        noLoop();
      } else if (secs == 0) {
        mins -= 1;
        secs = 60;
      }
      secs -= 1;
    }
  };
  //draws the stopwatch
  this.drawWatch = () => {
    push();
    textSize(18);
    fill(255);
    stroke(255);
    // if minute value is less than 10, add a 0 before the number
    if (mins + secs != 0) {
      text(
        `Stopwatch: ${mins < 10 ? "0" + mins : mins}:${
          secs < 10 ? "0" + secs : secs
        }`,
        width - 230,
        height - 520
      );
    } else {
      text("GAME'S OVER", width - 250, height - 500);
    }

    pop();
  };
}
