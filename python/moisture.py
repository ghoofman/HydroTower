#!/usr/bin/python
import RPi.GPIO as GPIO
import time
 
#GPIO SETUP
channel = 21
GPIO.setmode(GPIO.BCM)
GPIO.setup(channel, GPIO.OUT)
time.sleep(1)

if GPIO.input(channel):
        print "No Water Detected!"
else:
        print "Water Detected!"
        
GPIO.cleanup()