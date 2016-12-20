// Takes a string of format "11 22 34.28" (ICRF/J2000.0 format)
// and returns radians.  This is like a 24 hour clock (HH MM SS.ff)
function rightAscensionStringToRadians(raString) {
  raParts = raString.split(' ');
  raArcseconds = (parseInt(raParts[0]) * 3600) + (parseInt(raParts[1]) * 60) + parseFloat(raParts[2]);
  return raArcseconds * ((2 * Math.PI) / (24 * 3600));
}


function getLocalTime() {
  now = new Date();
  return new Date(now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds());
}

var debugTime = null

// Return the time to show literally to the user
// as a date object
function getDisplayTime() {
  return debugTime? debugTime:getLocalTime();
}

// Return the time on which to base the positions of heavenly bodies
function getHeavenlyTime() {
  return new Date(getHeavenlyTimeMs());
}
// in ms since epoch
function getHeavenlyTimeMs() {
  return getUtcTime();
}
// in ms since epoch
function getUtcTime() {
  now = debugTime? debugTime:getLocalTime();
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