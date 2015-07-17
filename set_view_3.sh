#!/bin/bash
(echo 'content.location.href="file:///home/pi/wall_display/views/planets.html"'; sleep 10) | telnet localhost 7070

