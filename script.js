const breakTime = 240000;
let timeLeft = breakTime;
let timeElement = document.getElementById("time");

function resizing() {
  window.resizeBy(0, 0);
}

function properExit() {
  window.close();
}

move();

function move() {
  let i = 0;
  var elem = document.getElementById("myBar");
  var width = 1;
  var id = setInterval(frame, breakTime / 1000);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
      resizing();
    } else {
      i++;
      width += 0.1;
      elem.style.width = width + "%";

      timeLeft -= breakTime / 1000;
      if (timeLeft / 1000 < 60) {
        timeElement.innerText = Math.floor(timeLeft / 1000) + " seconds";
      } else if (timeLeft / 1000 > 60 && timeLeft / 1000 < 120) {
        timeElement.innerText =
          "1 minute and " + (Math.floor(timeLeft / 1000) - 60) + " seconds";
      } else if (timeLeft / 1000 > 120 && timeLeft / 1000 < 600) {
        console.log("2 to 5");
        timeElement.innerText =
          Math.floor(timeLeft / 60000) +
          " minutes and " +
          (Math.floor(timeLeft / 1000) - Math.floor(timeLeft / 60000) * 60) +
          " seconds";
      } else {
        console.log("More than 5");
        timeElement.innerText = Math.floor(timeLeft / 60000) + " minutes";
      }
    }
  }
}
