#!/bin/bash

cd /home/pi/wall_display/
bash get_ephemerides.sh
git pull
bash set_view_1.sh

