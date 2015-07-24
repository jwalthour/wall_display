#!/bin/bash

iceweasel -repl -repl 7070&
sudo python /home/pi/wall_display/button_handler.py&
bash /home/pi/wall_display/set_view_1.sh


