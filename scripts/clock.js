// This file assumes you've included:
//   earth.js
//   luna.js
var earth = loadEphemeris(earth_ephemeris);
var luna  = loadEphemeris(luna_ephemeris);

var earthSunOrbitalRadius = 225;
var moonOrbitalRadius = 110;
var earthAxialTilt = 20.0; // degrees
var nPoleShiftDueToAxialTilt = earthAxialTilt / 180.0; // As a fraction of the image width (for an image showing the entire globe as an azimuthal projection)
var observerLongitudeRad = -79 * Math.PI / 180;
// Taken from the HORIZONS ephemeris for the 2014 solstice, which was at 2014-12-23 23:03 UTC.
var earthWinterSolsticeAngle = rightAscensionStringToRadians("06 07 57.94");
// The angle at which we draw the winter solstice (for offsets later)
var earthWinterSolsticeDrawAngle = -Math.PI / 2;

var imgBg = new Image();
var imgSun = new Image();
var imgSeasonRing = new Image();
var imgMonthRing = new Image();
var imgMonthHand = new Image();
var imgEarth = new Image();
var imgEarthShadow = new Image();
var imgHourRing = new Image();
var imgHourHand = new Image();
var imgMonthRing1to27 = new Image();
var imgMonthRing5to31 = new Image();
var imgMoon = new Image();
var imgMoonShadow = new Image();

var numLoaded = 0;
var NUM_IMGS = 11;
var timeRefd = 0;
function refresh() {
  earthOrbitalLocationRad = getEarthOrbitalAngle() + earthWinterSolsticeDrawAngle; // sidereal
  earthRotationalAngle = getEarthRotationalAngle() + Math.PI / 2; // relative to the sun
  moonOrbitalLocationRad = getMoonOrbitalAngle() + earthWinterSolsticeDrawAngle ; // sidereal
  moonOrbitalAngleAtStartOfMonth = getMoonOrbitalAngleAtStartOfMonth() + earthWinterSolsticeDrawAngle;
    
  var timeDiv = document.getElementById('time');
  now = getDisplayTime();
  timeDiv.innerHTML = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + 
    "<br />" + (now.getHours() < 10? "0":"") + now.getHours() + ":" + (now.getMinutes() < 10? "0":"") + now.getMinutes();// + ":" + (now.getSeconds() < 10? "0":"") + now.getSeconds();
  
  draw();
  // setTimeout(function(){refresh();}, 10000);
}

function load() {
  var img_path = "../images/planet_clock/";
  imgBg.addEventListener("load", startIfLoaded);
  imgSun.addEventListener("load", startIfLoaded);
  imgSeasonRing.addEventListener("load", startIfLoaded);
  imgMonthRing.addEventListener("load", startIfLoaded);
  imgMonthHand.addEventListener("load", startIfLoaded);
  imgEarth.addEventListener("load", startIfLoaded);
  imgEarthShadow.addEventListener("load", startIfLoaded);
  //imgHourRing.addEventListener("load", startIfLoaded);
  //imgHourHand.addEventListener("load", startIfLoaded);
  imgMonthRing1to27.addEventListener("load", startIfLoaded);
  imgMonthRing5to31.addEventListener("load", startIfLoaded);
  imgMoon.addEventListener("load", startIfLoaded);
  imgMoonShadow.addEventListener("load", startIfLoaded);
  
  imgBg.src             = img_path + 'background.svg'; // Set source path
  imgSun.src            = img_path + 'sun.svg'; // Set source path
  imgSeasonRing.src     = img_path + 'seasonring.svg'; // Set source path
  imgMonthRing.src      = img_path + 'monthring.svg'; // Set source path
  imgMonthHand.src      = img_path + 'monthhand.svg'; // Set source path
  imgEarth.src          = img_path + 'earth.svg'; // Set source path
  imgEarthShadow.src    = img_path + 'earthshadow.svg'; // Set source path
  imgMonthRing1to27.src = img_path + 'dayring1to27.svg'; // Set source path
  imgMonthRing5to31.src = img_path + 'dayring5to31.svg'; // Set source path
  imgMoon.src           = img_path + 'luna.svg'; // Set source path
  imgMoonShadow.src     = img_path + 'lunareticle.svg'; // Set source path
}

function startIfLoaded() {
  if(++numLoaded >= NUM_IMGS) {
    refresh();
  }
}

var DEBUG_IMAGES = true;
function draw() {
  var container = document.getElementById('container');
  var canvas = document.getElementById('canvas');
  
//  if (canvas.getContext) {
//    var ctx = canvas.getContext('2d');
//
//    ctx.fillRect(25,25,100,100);
//    ctx.clearRect(45,45,60,60);
//    ctx.strokeRect(50,50,50,50);
//  }
  if(canvas && container) {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  if(canvas) {
    // The context follows navigator's convention for angles (positive angles measured clockwise from North)
    var ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var center={x:canvas.width/2, y:canvas.height/2};
    var canvasLargerDim =  (canvas.width > canvas.height)? canvas.width : canvas.height;
    var canvasSmallerDim = (canvas.width < canvas.height)? canvas.width : canvas.height;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = "#FFFFFF";
    //ctx.fillRect(center.x - 5, center.y - 5, 10, 10);

    
    // Solstices, equinoxes, earth's orbit
    ctx.setTransform(1,0,0,1,0,0);
    ctx.strokeStyle="#AAAAAA";
    var sunCenter = {
      x:center.x + earthSunOrbitalRadius * Math.cos(-earthOrbitalLocationRad + Math.PI / 2),
      y:center.y + earthSunOrbitalRadius * Math.sin(-earthOrbitalLocationRad + Math.PI / 2)
    };
    ctx.beginPath();
      ctx.moveTo(0,sunCenter.y); ctx.lineTo(canvas.width,sunCenter.y);
    ctx.stroke();
    ctx.beginPath();
      ctx.moveTo(sunCenter.x, 0); ctx.lineTo(sunCenter.x, canvas.height);
    ctx.stroke();
    ctx.beginPath();
      ctx.arc(sunCenter.x, sunCenter.y, earthSunOrbitalRadius * 2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Background, sun decorations, sun
    ctx.setTransform(1,0,0,1,0,0);
    ctx.translate(center.x, center.y);
    ctx.rotate(-earthOrbitalLocationRad);
    ctx.translate(0,earthSunOrbitalRadius);
    ctx.rotate(earthOrbitalLocationRad);
    var bgWidthHeight = canvasLargerDim + 2 * earthSunOrbitalRadius;
    // if(DEBUG_IMAGES) {
      
    // } else {
      ctx.drawImage(imgBg,-bgWidthHeight/2, -bgWidthHeight/2, bgWidthHeight, bgWidthHeight);
      ctx.drawImage(imgSeasonRing,-imgSeasonRing.width/2, -imgSeasonRing.height/2);
      ctx.drawImage(imgMonthRing,-imgMonthRing.width/2, -imgMonthRing.height/2);
    // }
    ctx.rotate(-earthOrbitalLocationRad);
    // if(DEBUG_IMAGES) {

    // } else {
      ctx.drawImage(imgMonthHand,-imgMonthHand.width/2, -imgMonthHand.height/2);
      ctx.drawImage(imgSun,-imgSun.width/2, -imgSun.height/2);
    // }
    // Earth
    ctx.setTransform(1,0,0,1,0,0);
    ctx.translate(center.x, center.y);
    ctx.rotate(-earthOrbitalLocationRad);
    ctx.translate(0,-earthSunOrbitalRadius);
    ctx.rotate(earthRotationalAngle);
    if(DEBUG_IMAGES) {
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle="";
      ctx.beginPath();
        ctx.arc(0, 0, imgEarth.width/2, 0,  2 * Math.PI, false);
      ctx.fill();
      
      ctx.strokeStyle="#000000";
      ctx.lineWidth = 1;
      ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(0, -imgEarth.height/2);
      ctx.stroke();
    } else {
      ctx.drawImage(imgEarth,-imgEarth.width/2, -imgEarth.height/2);
    }
    ctx.rotate(earthOrbitalLocationRad);
    ctx.translate(0, imgEarth.width * nPoleShiftDueToAxialTilt);
    ctx.rotate(-earthOrbitalLocationRad);
    
    // Earth shadow
    ctx.setTransform(1,0,0,1,0,0);
    ctx.translate(center.x, center.y);
    ctx.rotate(-earthOrbitalLocationRad);
    ctx.translate(0,-earthSunOrbitalRadius);
    if(DEBUG_IMAGES) {
      
    } else {
      ctx.drawImage(imgEarthShadow,-imgEarthShadow.width/2, -imgEarthShadow.height/2);
    }    
    // Hour ring
    //ctx.setTransform(1,0,0,1,0,0);
    //ctx.translate(center.x, center.y);
    //ctx.rotate(earthOrbitalLocationRad);
    //ctx.translate(0,-earthSunOrbitalRadius);
    //ctx.drawImage(imgHourRing,-imgHourRing.width/2, -imgHourRing.height/2);
    
    // Day ring
    ctx.setTransform(1,0,0,1,0,0);
    ctx.translate(center.x, center.y);
    ctx.rotate(-earthOrbitalLocationRad);
    ctx.translate(0,-earthSunOrbitalRadius);
    ctx.rotate(earthOrbitalLocationRad);
    ctx.rotate(-moonOrbitalAngleAtStartOfMonth);
    imgDayRing = getDayRing();
    if(DEBUG_IMAGES) {
      
    } else {
      ctx.drawImage(imgDayRing,-imgDayRing.width/2, -imgDayRing.height/2);
    }    
    // Hour hand
    //ctx.setTransform(1,0,0,1,0,0);
    //ctx.translate(center.x, center.y);
    //ctx.rotate(earthOrbitalLocationRad);
    //ctx.translate(0,-earthSunOrbitalRadius);
//  //  ctx.translate(0, imgEarth.width * nPoleShiftDueToAxialTilt);
    //ctx.rotate(earthRotationalAngle);
    //ctx.rotate(-observerLongitudeRad);
    //ctx.drawImage(imgHourHand,-imgHourHand.width/2, -imgHourHand.height/2);
  
    // Moon
    ctx.setTransform(1,0,0,1,0,0);
    ctx.translate(center.x, center.y);
    ctx.rotate(-earthOrbitalLocationRad);
    ctx.translate(0,-earthSunOrbitalRadius);
    ctx.rotate(earthOrbitalLocationRad);
    //ctx.rotate(earthSiderealAngle);
    ctx.rotate(-moonOrbitalLocationRad);
    ctx.translate(0,moonOrbitalRadius);
    if(DEBUG_IMAGES) {
      
    } else {
      ctx.drawImage(imgMoon,-imgMoon.width/2, -imgMoon.height/2);
    }
    // Moon decorations
    ctx.setTransform(1,0,0,1,0,0);
    ctx.translate(center.x, center.y);
    ctx.rotate(-earthOrbitalLocationRad);
    ctx.translate(0,-earthSunOrbitalRadius);
    ctx.rotate(earthOrbitalLocationRad);
    //ctx.rotate(earthSiderealAngle);
    ctx.rotate(-moonOrbitalLocationRad);
    ctx.translate(0,moonOrbitalRadius);
    ctx.rotate(moonOrbitalLocationRad);
    //ctx.rotate(-earthSiderealAngle);
    ctx.rotate(-earthOrbitalLocationRad);
    if(DEBUG_IMAGES) {
      
    } else {
      ctx.drawImage(imgMoonShadow,-imgMoonShadow.width/2, -imgMoonShadow.height/2);
    }
  }
}

// The angle of the earth-sun line with respect to the winter solstice
// in radians.
function getEarthOrbitalAngle(now = null) {
  now = getHeavenlyTimeMs();
  // The following method is based on the local clock rather than involving the ephemerides
//  // Months are zero-indexed, days are one-indexed
//  startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
//  thisYearsWinterSolstice = new Date(now.getFullYear(), 11, 21, 0, 0, 0, 0);
//  msAfterSolstice = (now - thisYearsWinterSolstice); // may be negative
//  msInYear = (new Date(now.getFullYear(), 11, 30, 23, 59, 59, 999)) - startOfYear;
//  return 2 * Math.PI * (msAfterSolstice / msInYear);

  // Figure out how long it's been since the last ephemeris
  msAfterEphemeris = now - earth.dateOfEphemeris;
  hoursAfterEphemeris = (msAfterEphemeris / 1000.0) / 3600.0;
  // radiansAfterEphemeris = (hoursAfterEphemeris * earth.siderialAngularVelocity);
  radiansAfterEphemeris = (hoursAfterEphemeris * (2 * Math.PI) / (EARTH_SIDEREAL_PERIOD_DAYS * 24));
  return (earth.siderialAngle + radiansAfterEphemeris) - earthWinterSolsticeAngle;
}

// The angle of the prime meridian with respect to noon
function getEarthRotationalAngle() {
  nowMs = getHeavenlyTimeMs();
  now = getHeavenlyTime();
  noonTodayMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0);
  msAfterNoon = (nowMs - noonTodayMs) // may be negative
  msInToday = 24*60*60*1000; // will be one second off on leap-second days
  return -2 * Math.PI * (msAfterNoon / msInToday);
}

// Where the moon is in its orbit, relative to the celestial sphere
function getMoonOrbitalAngle() {
  now = getHeavenlyTimeMs();

  // Figure out how long it's been since the last ephemeris
  msAfterEphemeris = now - luna.dateOfEphemeris;
  hoursAfterEphemeris = (msAfterEphemeris / 1000.0) / 3600.0;
  // radiansAfterEphemeris = (hoursAfterEphemeris * luna.siderialAngularVelocity);
  radiansAfterEphemeris = (hoursAfterEphemeris * (2 * Math.PI) / (LUNA_SIDEREAL_PERIOD_DAYS * 24));
  return (luna.siderialAngle + radiansAfterEphemeris);
}

function getMoonOrbitalAngleAtStartOfMonth() {
  // How far through the lunar orbital period was the ephemeris?
  // Each ring is exactly one orbital period around, so we can
  // map the moon's location at that time to that fraction of a circle.
  ephemerisDate = new Date(luna.dateOfEphemeris);
  dayOfMonth = ephemerisDate.getUTCDate() - 1; // May 1 is the 0th day
  timeIntoMonth = dayOfMonth / LUNA_SIDEREAL_PERIOD_DAYS;
  radiansIntoMonth = timeIntoMonth * (2 * Math.PI);
  moonOrbitalAngleAtStartOfMonth = luna.siderialAngle - radiansIntoMonth;
  return moonOrbitalAngleAtStartOfMonth;
}

function getDayRing() {
  var today = getHeavenlyTime().getUTCDate();
  return today > 15? imgMonthRing5to31:imgMonthRing1to27;
}

function setDebugTime() {
  var year  = Number(document.getElementById('input_year').value); 
  var month = Number(document.getElementById('input_month').value);
  var day   = Number(document.getElementById('input_day').value);
  var hour  = Number(document.getElementById('input_hour').value);
  var min   = Number(document.getElementById('input_min').value);
  var sec   = Number(document.getElementById('input_sec').value);
  debugTime = new Date(year, month-1, day, hour, min, sec);
  refresh();
}
function clearDebugTime() {
  debugTime = null;
  refresh();
}