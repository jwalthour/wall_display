TODAY=`date +%Y-%m-%d`
TODAY=`printf "%s" \`date +%Y-%m-%d\``
#TODAY="2015-1-1"
echo "Gathering ephemerides for $TODAY."

# First arg is the prime ID, second arg is the satellite ID, third is the filename, fourth is the variable name used in the JS file
function downloadSateliteRelToPrime {
  PRIME=$1
  SATELLITE=$2
  FILENAME=$3
  VARNAME=$4

  #  Date__(UT)__HR:MN, , ,R.A._(ICRF/J2000.0), DEC_(ICRF/J2000.0), dRA*cosD,d(DEC)/dt,            delta,     deldot,
  URL="http://ssd.jpl.nasa.gov/horizons_batch.cgi?batch=1&CENTER=$PRIME&COMMAND=%27$SATELLITE%27&MAKE_EPHEM=%27YES%27%20&TABLE_TYPE=%27OBSERVER%27&START_TIME=%27$TODAY%2000:00%27&STOP_TIME=%27$TODAY%2000:01%27&STEP_SIZE=%271%20d%27%20&QUANTITIES=%271,3,20%27&CSV_FORMAT=%27YES%27"
  echo $URL
  OUT=`curl $URL 2>/dev/null | grep -A1 "SOE" | tail -n 1 | sed 's/ *, */","/g' | sed 's/[\r\n]//g'`
  echo $OUT
  OUT=`printf "var $VARNAME=[\"%s\"];" "$OUT"`
  echo $OUT > $FILENAME
}

# First arg is the planet ID, second is the filename, third is the variable name used in the JS file
function downloadPlanetRelToSol {
  PLANET=$1
  FILENAME=$2
  VARNAME=$3
  downloadSateliteRelToPrime "500@10" $PLANET $FILENAME $VARNAME
}

OUT_PATH="ephemerides"

downloadPlanetRelToSol 199 $OUT_PATH/mercury.js   mercury_ephemeris
downloadPlanetRelToSol 299 $OUT_PATH/venus.js     venus_ephemeris
downloadPlanetRelToSol 399 $OUT_PATH/earth.js     earth_ephemeris
downloadPlanetRelToSol 499 $OUT_PATH/mars.js      mars_ephemeris
downloadPlanetRelToSol 599 $OUT_PATH/jupiter.js   jupiter_ephemeris
downloadPlanetRelToSol 699 $OUT_PATH/saturn.js    saturn_ephemeris
downloadPlanetRelToSol 799 $OUT_PATH/uranus.js    uranus_ephemeris
downloadPlanetRelToSol 899 $OUT_PATH/neptune.js   neptune_ephemeris
downloadPlanetRelToSol 999 $OUT_PATH/pluto.js     pluto_ephemeris
downloadSateliteRelToPrime 500 301 $OUT_PATH/luna.js luna_ephemeris
