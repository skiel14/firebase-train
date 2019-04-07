function timeChanger(origTime) {
  origTime = origTime.split(':');

  var hr = Number(origTime[0]);
  var min = Number(origTime[1]);
  var tVal;

  if(min==60) {
    hr++;
  }

  if (hr > 0 && hr <= 12) {
    tVal= "" + hr;
  } else if (hr > 12) {
    tVal= "" + (hr - 12);
  } else if (hr == 0) {
    tVal= "12";
  }

  if (min < 10) {
    tVal += ":0" + min;
  } else if(min==60) {
    tVal += ":00";
  } else {
    tVal += ":" + min;
  }

  if (hr >= 12 && hr < 24) {
    tVal += " P.M.";
  } else {
    tVal += " A.M.";
  }

  return tVal;
}

var minOfTrain;
function calcNextTime(origTime, frequency) {
  var today = new Date();
  var now = today.getHours() + ":" + today.getMinutes();

  now = now.split(':');
  origTime = origTime.split(':');

  var hrTrain = Number(origTime[0]);
  var minTrain = Number(origTime[1]);
  var hrNow = Number(now[0]);
  var minNow = Number(now[1]);
  var tVal;
  var minutesTrain=0, minutesNow=0, hours=0;

  minutesTrain = minTrain + hrTrain*60;
  minutesNow = minNow + hrNow*60;

  if(minutesTrain<minutesNow) {
    while(minutesTrain<minutesNow) {
      minutesTrain+=frequency;
    }
    minOfTrain=minutesTrain;

    while(minutesTrain>60) {
      hours++;
      if(hours>24) {
        hours=0;
      }
      minutesTrain-=60;
    }
    tVal = "" + hours + ":" + minutesTrain;
  } else {
    while(minutesTrain>60) {
      hours++;
      if(hours>24) {
        hours=0;
      }
      minutesTrain-=60;
    }
    tVal = "" + hours + ":" + minutesTrain;
  }

  return tVal;
}

function calcMinAway(origTime) {
  var today = new Date();
  var now = today.getHours() + ":" + today.getMinutes();

  now = now.split(':');
  origTime = origTime.split(':');

  var hrTrain = Number(origTime[0]);
  var minTrain = Number(origTime[1]);
  var hrNow = Number(now[0]);
  var minNow = Number(now[1]);
  var minAway;

  if(hrNow<hrTrain) {
    var hrDiff = (hrTrain-hrNow)*60;
  } else if(hrNow==hrTrain) {
    var hrDiff = 0;
  }

  if(minNow<minTrain) {
    var minDiff = (minTrain-minNow);
  } else if(minNow==minTrain) {
    var minDiff = 0;
  }

  minAway = hrDiff + minDiff;

  return minAway;
}

var config = {
  apiKey: "AIzaSyBJ_vmVT8PdhIMOr8puusToSj8dqX-gfBQ",
  authDomain: "train-schedule-hw-d5ea9.firebaseapp.com",
  databaseURL: "https://train-schedule-hw-d5ea9.firebaseio.com",
  projectId: "train-schedule-hw-d5ea9",
  storageBucket: "",
  messagingSenderId: "99781612076"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

var name = "";
var dest = "";
var first_time = "";
var freq = 0;

$("#add-train").on("click", function(event) {
  event.preventDefault();

  name = $("#train-name").val().trim();
  dest = $("#train-dest").val().trim();
  first_time = $("#train-first").val().trim();
  freq = $("#train-freq").val().trim();

  dataRef.ref().push({
    name: name,
    dest: dest,
    first_time: first_time,
    freq: freq,
  });

  $("#train-name").val("");
  $("#train-dest").val("");
  $("#train-first").val("");
  $("#train-freq").val("");
});
function load() {
  $("#trainsList").empty();
  dataRef.ref().on("child_added", function(childSnapshot) {
    $("#trainsList").append("<tr><td> " +
      childSnapshot.val().name +
      " </td><td> " + childSnapshot.val().dest +
      " </td><td> " + childSnapshot.val().freq +
      " </td><td> " + timeChanger(calcNextTime(childSnapshot.val().first_time, Number(childSnapshot.val().freq))) +
      " </td><td> " + calcMinAway(calcNextTime(childSnapshot.val().first_time, Number(childSnapshot.val().freq))) +
      " </td></tr>");
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
}
load();

var intervalId;
var number;
function timer() {
  number=5;
  function runTimer() {
    clearInterval(intervalId);
    intervalId = setInterval(decrement, 1000);
  }
  function decrement() {
    number--;
    load();
  }
  function stopTimer() {
    clearInterval(intervalId);
  }
  runTimer();
}

timer();
