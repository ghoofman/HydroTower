const gpio = require('rpi-gpio');
const exec = require('child_process').exec;

function WaterLevelHandler(gpioTriggerPin, gpioEchoPin, sensorType) {
    this.gpioTriggerPin = gpioTriggerPin;
    this.gpioEchoPin = gpioEchoPin;
    this.sensorType = sensorType || 22;
    this.distance = 0;
    this.currentTime = 0;
    // check once per second
    this.intervalRate = 1000;

    gpio.setup(gpioTriggerPin, gpio.DIR_OUT);
    gpio.setup(gpioEchoPin, gpio.DIR_IN);
}

WaterLevelHandler.prototype = {
    read: function () {

        exec('python python/range.py', (err, stdout) => {
            this.distance = parseFloat(stdout);
        });

        // This isn't working the same as the python. Not sure what's different.
        // For now just calling the python script via shell

        // gpio.output(this.gpioTriggerPin, false, () => {
        //     console.log('this.gpioTriggerPin set to false')
        //     setTimeout(() => {
        //         gpio.output(this.gpioTriggerPin, true, () => {

        //             console.log('this.gpioTriggerPin set to true')

        //             function waitUntil(result, cb) {
        //                 gpio.input(this.gpioEchoPin, (err, val) => {
        //                     if (val === result) {
        //                         cb();
        //                     } else if (!err) {
        //                         waitUntil(result, cb);
        //                     } else {
        //                         cb(err)
        //                     }
        //                 })
        //             }

        //             gpio.output(this.gpioTriggerPin, false, () => {
        //                 console.log('this.gpioTriggerPin set to false')

        //                 waitUntil(true, (err) => {                       
        //                     console.log('echo is now true', err)
        //                     var pulseStart = process.hrtime()[0] * 1000000 + process.hrtime()[1]/1000;

        //                     waitUntil(false, (err) => {    
        //                         console.log('echo is now false', err)
        //                         var pulseEnd = process.hrtime()[0] * 1000000 + process.hrtime()[1]/1000;

        //                         console.log(pulseStart, pulseEnd);

        //                         const pulseDuration = ((pulseEnd - pulseStart) / 1000) / 1000;
        //                         console.log(pulseDuration);
        //                         const distance = pulseDuration * 1715;
        //                         res.send({
        //                             distance
        //                         });
        //                     });
        //                 });
        //             });
        //         });


        //     }, 1000);
        // });
    },

    web: function (app) {
        app.get('/waterlevel', (req, res) => {
            res.send(this.stats());
        });
        return this;
    },

    stats: function () {
        return {
            distance: this.distance
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
        this.currentTime += delta;
        if (this.currentTime > this.intervalRate) {
            this.currentTime = 0;
            this.read();
        }
    }
}

module.exports = WaterLevelHandler;