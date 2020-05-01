import RPi.GPIO as GPIO
import time

GPIO.setwarnings(False)

GPIO.setmode(GPIO.BOARD)
TRIG = 31   
ECHO = 29

# print "Distance Measurement In Progress"

GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

GPIO.output(TRIG, False)
# print "Waiting For Sensor To Settle"
time.sleep(1)

GPIO.output(TRIG, True)
time.sleep(0.00001)
GPIO.output(TRIG, False)

pulse_start = time.time()
while GPIO.input(ECHO)==0:
    pulse_start = time.time()

pulse_end = time.time()
while GPIO.input(ECHO)==1:
    pulse_end = time.time()

pulse_duration = pulse_end - pulse_start

# print pulse_duration

distance = pulse_duration * 17150

distance = round(distance, 2)

print distance


GPIO.cleanup()