import RPi.GPIO as GPIO
import time

channel = 16
GPIO.setmode(GPIO.BCM)
GPIO.setup(channel, GPIO.OUT)

GPIO.output(channel, GPIO.LOW)
time.sleep(10)

GPIO.output(channel, GPIO.HIGH)
time.sleep(10)

while True:
    GPIO.output(channel, GPIO.LOW)
    time.sleep(60 * 5)
    GPIO.output(channel, GPIO.HIGH)
    time.sleep(60 * 5)
    

GPIO.cleanup()