# HI MARK

# Wall display
A little display for my wall, containing a planet clock, a road conditions display, and others.
## Installation
To install, simply clone the repository to your PC.  Under the "views" folder, you'll find a number of HTML files, all of which should open in reasonable browsers.

If you want the planetary data to be updated regularly, create a cron job calling "get_ephemerides.sh" every day.  I update planetary data most times I update this project, and the software will extrapolate from the last one, but it loses accuracy over time.

If you're running this on a raspberry pi and want hardware buttons, configure your installation to run "button_handler.py" on startup.  Also, install firefox with AdBlock and the REPL plugin.  The button handler will monitor 5 GPIO pins and call the appropriate 'set_view_N.sh" script upon detecting a button press.  GPIO pins are configured with pull-up resistors, so the buttons should be wired to short to ground, or you should modify the script.  Each set_view_N script will interface with Firefox via the REPL plugin, setting its address to the corresponding view .html file.

# Included views
## Planet clock
Displays a reasonably accurate representation of the positions of Earth, the Sun, and the Moon.  Also displays handy references indicating what times of year is indicated by those positions.  Plus there's a digital clock and date thrown in to make life easier.

## Road conditions
Shows twitter feeds corresponding to major highways, along with a weather radar display.  This is customized to NH.  Sorry if you live somewhere else.

## Planets
A basic orrerry.  Under construction.

## Weather
Under construction.

## Sports
Under construction.


