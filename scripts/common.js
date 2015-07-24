// Takes a string of format "11 22 34.28" (ICRF/J2000.0 format)
// and returns radians.  This is like a 24 hour clock (HH MM SS.ff)
function rightAscensionStringToRadians(raString) {
  raParts = raString.split(' ');
  raArcseconds = (parseInt(raParts[0]) * 3600) + (parseInt(raParts[1]) * 60) + parseFloat(raParts[2]);
  return raArcseconds * ((2 * Math.PI) / (24 * 3600));
}

// Takes in a raw ephemeris array that was downloaded from the server.
// Returns an object with all those values parsed and converted
function loadEphemeris(rawEphemArray) {
  var retval = {
    siderialAngle:null, // "heading" from the prime to the satellite, in radians
    siderialAngularVelocity:null, // rate of change in the "heading", in radians per hour
    dateOfEphemeris:null, // The date and time that this body was said to be at this location
  };
  
  // Parse date
  reformattedDate = rawEphemArray[0].substring(1).replace(' ', 'T')
    .replace("Jan", "01")
    .replace("Feb", "02")
    .replace("Mar", "03")
    .replace("Apr", "04")
    .replace("May", "05")
    .replace("Jun", "06")
    .replace("Jul", "07")
    .replace("Aug", "08")
    .replace("Sep", "09")
    .replace("Oct", "10")
    .replace("Nov", "11")
    .replace("Dec", "12");
  retval.dateOfEphemeris = new Date(reformattedDate);

  // Parse right ascension
  retval.siderialAngle = rightAscensionStringToRadians(rawEphemArray[3]);
  
  // Parse declination - HORIZONS provides dRA/dt multiplied by cos(declination) for some reason
  // Note that the declination is listed with a sign but in this case we don't care what it is,
  // so we trim it off.
  declParts = rawEphemArray[4].substring(1).split(' ');
  declArcseconds = (parseInt(declParts[0]) * 3600) + (parseInt(declParts[1]) * 60) + parseFloat(declParts[2]);
  declRadians = declArcseconds * ((2.0 * Math.PI) / (360.0 * 3600.0));
  cosDecl = Math.cos(declRadians);
  raRateArcsecondsPerHour = parseFloat(rawEphemArray[5]) / cosDecl;
  retval.siderialAngularVelocity = raRateArcsecondsPerHour * ((2.0 * Math.PI) / (360.0 * 3600.0));
  
  return retval;
}

// For debugging; have the capability to offset by one day
var dayOffset = 0;
function jogDay() {
  dayOffset++;
}
var hourOffset = 0;
function jogHour() {
  hourOffset++;
}
var minuteOffset = 0;
function jogMinute() {
  minuteOffset++;
}

function getLocalTime() {
  now = new Date();
  return new Date(now.getFullYear(),
    now.getMonth(),
    now.getDate() + dayOffset,
    now.getHours() + hourOffset,
    now.getMinutes() + minuteOffset,
    now.getSeconds());
}

function getUtcTime() {
  now = getLocalTime();
  nowMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
  return nowMs;
}

// Shamelessly thefted from StackOverflow (http://stackoverflow.com/questions/11887934) - Thanks Sheldon Griffin!
Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

function enterFullscreen() {
  var elem = document.getElementById("canvas");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
}