#!/usr/bin/python
import RPi.GPIO as GPIO
from subprocess import call

GPIO.setmode(GPIO.BCM)

BUTTON_0_PIN = 20
BUTTON_1_PIN = 12
BUTTON_2_PIN = 13
BUTTON_3_PIN = 19
BUTTON_4_PIN = 26
PS_SWITCH_PIN = 6

GPIO.setup(BUTTON_0_PIN, GPIO.IN, pull_up_down = GPIO.PUD_UP)
GPIO.setup(BUTTON_1_PIN, GPIO.IN, pull_up_down = GPIO.PUD_UP)
GPIO.setup(BUTTON_2_PIN, GPIO.IN, pull_up_down = GPIO.PUD_UP)
GPIO.setup(BUTTON_3_PIN, GPIO.IN, pull_up_down = GPIO.PUD_UP)
GPIO.setup(BUTTON_4_PIN, GPIO.IN, pull_up_down = GPIO.PUD_UP)
GPIO.setup(PS_SWITCH_PIN, GPIO.IN, pull_up_down = GPIO.PUD_UP)

def activateScreen(pin):
	if pin == BUTTON_0_PIN:
		call(["/home/pi/display/enter_fullscreen.sh"])
		call(["/home/pi/display/set_view_0.sh"])
	elif pin == BUTTON_1_PIN:
		call(["/home/pi/display/enter_fullscreen.sh"])
		call(["/home/pi/display/set_view_1.sh"])
	elif pin == BUTTON_2_PIN:
		call(["/home/pi/display/enter_fullscreen.sh"])
		call(["/home/pi/display/set_view_2.sh"])
	elif pin == BUTTON_3_PIN:
		call(["/home/pi/display/enter_fullscreen.sh"])
		call(["/home/pi/display/set_view_3.sh"])
	elif pin == BUTTON_4_PIN:
		call(["/home/pi/display/enter_fullscreen.sh"])
		call(["/home/pi/display/set_view_4.sh"])

def setPowersave(pin):
	if GPIO.input(pin):
		print("Gonna enter powersave mode")
	else:
		print("Gonna exit powersave mode")

GPIO.add_event_detect(BUTTON_0_PIN, GPIO.FALLING, callback=activateScreen, bouncetime=300)
GPIO.add_event_detect(BUTTON_1_PIN, GPIO.FALLING, callback=activateScreen, bouncetime=300)
GPIO.add_event_detect(BUTTON_2_PIN, GPIO.FALLING, callback=activateScreen, bouncetime=300)
GPIO.add_event_detect(BUTTON_3_PIN, GPIO.FALLING, callback=activateScreen, bouncetime=300)
GPIO.add_event_detect(BUTTON_4_PIN, GPIO.FALLING, callback=activateScreen, bouncetime=300)

GPIO.add_event_detect(PS_SWITCH_PIN, GPIO.BOTH, callback=setPowersave, bouncetime=300)

try:
	while True:
		pass
except:# KeyboardException:
	print ("Got a ctrl-c")
finally:
	print("Cleaning up")
	GPIO.cleanup()

