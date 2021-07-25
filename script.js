const fs = require("fs"); // adding file system API
const { ipcRenderer } = require("electron"); // adding electron API to get breakType

// interval dictionary
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

// variable to store which kind of break type it is
let breakType = "s";

// variables needed to keep track of time
let timeLeft, timeElement, breakTime;

// importing preferences from json file
let preferences;
fs.readFile("preferences.json", function (err, data) {
  if (err) throw err;
  preferences = JSON.parse(data);

  // setting breakType
  breakType = ipcRenderer.sendSync("breakType", "I need the break type");

  // setting variables based on imported preferences
  if (breakType == "s")
    breakTime = 1000 * intervals[preferences.ShortBreak.Duration];
  else breakTime = 1000 * intervals[preferences.LongBreak.Duration];
  timeLeft = breakTime;
  timeElement = document.getElementById("time");

  // setting the input dom elements to show the current preferences
  document.getElementById("short_break_time").value =
    preferences.ShortBreak.Duration;
  document.getElementById("short_break_interval").value =
    preferences.ShortBreak.Frequency;
  document.getElementById("long_break_time").value =
    preferences.LongBreak.Duration;
  document.getElementById("long_break_interval").value =
    preferences.LongBreak.Frequency;

  move(); // starting the break timer
});

// function to stop the timer on completion
function hideWindow() {
  window.close();
}

// function to save any changes in the preferences
function save() {
  // updating the local preferences variable
  preferences["ShortBreak"]["Duration"] =
    document.getElementById("short_break_time").value;
  preferences["ShortBreak"]["Frequency"] =
    document.getElementById("short_break_interval").value;
  preferences["LongBreak"]["Duration"] =
    document.getElementById("long_break_time").value;
  preferences["LongBreak"]["Frequency"] =
    document.getElementById("long_break_interval").value;

  // copying the preferences variable over to the json file
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

// function to create the progress bar functionality
function move() {
  let i = 0;
  let elem = document.getElementById("myBar");
  let width = 1;
  let id = setInterval(frame, breakTime / 1000);

  // function that is called very set interval
  function frame() {
    if (width >= 100) {
      // if break time is done close the window
      clearInterval(id);
      hideWindow();
    } else {
      // updating the progress bar
      i++;
      width += 0.1;
      elem.style.width = width + "%";

      // updating the time left
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

// event listeners for the various buttons
document.getElementById("skip").addEventListener("click", hideWindow);
document.getElementById("save").addEventListener("click", save);
