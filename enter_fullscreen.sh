#!/bin/bash
(echo 'window.fullScreen = true'; sleep 0.25) | telnet localhost 7070
(echo 'document.getElementById("toolbar-menubar").hidden = true'; sleep 0.25) | telnet localhost 7070
