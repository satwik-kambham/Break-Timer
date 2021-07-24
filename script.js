const fs = require("fs");

const intervals = {
  "10 seconds": 10,
  "20 seconds": 20,
  "30 seconds": 30,
  "1 minute": 60,
  "2 minutes": 120,
  "5 minutes": 300,
  "10 minutes": 600,
  "15 minutes": 900,
  "20 minutes": 1200,
};
let timeLeft;
let timeElement;
let breakTime;

let preferences;
fs.readFile("preferences.json", function (err, data) {
  if (err) throw err;
  preferences = JSON.parse(data);

  breakTime = 1000 * intervals[preferences.ShortBreak.Duration];
  timeLeft = breakTime;
  timeElement = document.getElementById("time");

  move();
});

function hideWindow() {
  window.close();
}

document.getElementById("skip").addEventListener("click", hideWindow);

function save() {
  preferences["ShortBreak"]["Duration"] =
    document.getElementById("short_break_time").value;

  fs.writeFile(
    "preferences.json",
    JSON.stringify(preferences),
    (jsonString, err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    }
  );
}

document.getElementById("save").addEventListener("click", save);

function move() {
  let i = 0;
  var elem = document.getElementById("myBar");
  var width = 1;
  var id = setInterval(frame, breakTime / 1000);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
      hideWindow();
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
        timeElement.innerText =
          Math.floor(timeLeft / 60000) +
          " minutes and " +
          (Math.floor(timeLeft / 1000) - Math.floor(timeLeft / 60000) * 60) +
          " seconds";
      } else {
        timeElement.innerText = Math.floor(timeLeft / 60000) + " minutes";
      }
    }
  }
}
