const { Timespan } = require('./utils');
const gpio = require('rpi-gpio');

function PumpHandler(channel) {
    this.running = false;
    this.currentTime = 0;
    this.channel = channel;
    this.up = true;
    this.intervalRateOn = 1000 * 60 * 15;
    this.intervalRateOff = 1000 * 60 * 15;
    this.started = new Date();
    this.stopped = new Date();
    this.timerStarted = new Date();
    this.timerStopped = new Date();

    gpio.setup(channel, gpio.DIR_HIGH);
}

PumpHandler.prototype = {
    start: function () {
        console.log('Turning pump timer on');
        if (this.running) {
            return;
        }
        this.running = true;
        gpio.write(this.channel, false);
        this.up = true;
        this.started = new Date();
        this.timerStarted = new Date();
        this.currentTime = 0;
    },

    stop: function () {
        console.log('Turning pump timer off');
        this.running = false;
        gpio.write(this.channel, true);
        this.stopped = new Date();
        this.timerStopped = new Date();
        this.currentTime = 0;
    },

    web: function (app) {
        app.get('/pump', (req, res) => {
            res.send(this.stats());
        });

        app.put('/pump/:state', (req, res) => {
            if (req.params.state === 'on') {
                this.start();
            } else {
                this.stop();
            }
            res.send(this.stats());
        });

        app.put('/pump/interval/on/:interval', (req, res) => {
            this.intervalRateOn = 1000 * req.params.interval;
            res.send(this.stats());
        });

        app.put('/pump/interval/off/:interval', (req, res) => {
            this.intervalRateOff = 1000 * req.params.interval;
            res.send(this.stats());
        });

        return this;
    },

    stats: function () {
        return {
            rateOn: this.intervalRateOn / 1000,
            rateOff: this.intervalRateOff / 1000,
            timerOn: this.running,
            pumpRunning: this.up,
            lastStarted: this.started,
            lastStopped: this.stopped,
            running: Timespan(this.up ? this.started : this.stopped, new Date()),
            timer: Timespan(this.timerStarted, new Date())
        };
    },

    loop: function (rate) {
        const updateRate = rate || 1000;
        setInterval(() => {
            this.update(updateRate);
        }, updateRate);
        return this;
    },

    update: function (delta) {
        if (!this.running) {
            return;
        }
        this.currentTime += delta;
        if (this.up && this.currentTime > this.intervalRateOn) {
            this.up = false;
            this.currentTime = 0;
            gpio.write(this.channel, true);
            this.stopped = new Date();
        } else if (!this.up && this.currentTime > this.intervalRateOff) {
            this.up = true;
            this.currentTime = 0;
            gpio.write(this.channel, false);
            this.started = new Date();
        }
    }
}

module.exports = PumpHandler;