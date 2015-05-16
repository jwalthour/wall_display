#!/bin/bash
(echo 'content.location.href="file:///home/pi/display/views/clock.html"'; sleep 10) | telnet localhost 7070
