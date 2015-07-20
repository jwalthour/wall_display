#!/bin/bash
{ echo 'content.location.href="file:///home/pi/wall_display/views/clock.html"'; echo 'window.fullScreen = true'; echo 'document.getElementById("toolbar-menubar").hidden = true'; sleep 10 } | telnet localhost 7070
