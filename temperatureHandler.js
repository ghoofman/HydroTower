const dhtLib = require('node-dht-sensor');

function TemperatureHandler(gpio, sensorType) {
    this.gpio = gpio;
    this.sensorType = sensorType || 22;
    this.temperature = 0;
    this.humidity = 0;
    this.currentTime = 0;
    // check once per second
    this.intervalRate = 1000;
}

TemperatureHandler.prototype = {
    read: function () {
        dhtLib.read(this.sensorType, this.gpio, (err, temperature, humidity) => {
            if (!err) {
                this.temperature = temperature;
                this.humidity = humidity;
            } else {
                console.log('err', err);
            }
        });
    },

    web: function (app) {
        app.get('/temperature', (req, res) => {
            res.send(this.stats());
        });
        return this;
    },

    stats: function () {
        return {
            humidity: this.humidity,
            temperature: this.temperature
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

module.exports = TemperatureHandler;