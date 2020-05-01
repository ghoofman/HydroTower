require('dotenv').config();
const express = require('express');

const PumpHandler = require('./pumpHandler');
const TemperatureHandler = require('./temperatureHandler');
const WaterLevelHandler = require('./waterLevelHandler');

const app = express();
app.use(express.static('public'))

const temperature = new TemperatureHandler(24);
const waterLevel = new WaterLevelHandler(process.env.WATER_LEVEL_TRIGGER, process.env.WATER_LEVEL_ECHO);
const pumpHandler = new PumpHandler(process.env.WATER_PUMP_RELAY);

temperature.web(app).loop();
waterLevel.web(app).loop()
pumpHandler.web(app).loop()

// Web Socket Client communication
// Lets you reach out to a cloud based web socket server for external communication/control
// without having to open a port forward on your wireless router
if (process.env.WEB_SOCKET_ENDPOINT) {
    const io = require('socket.io-client');
    const socket = io(process.env.WEB_SOCKET_ENDPOINT);
    socket.on('hydro-tower', (req) => {
        if (req === 'on') {
            pumpHandler.start();
        } else if (req === 'off') {
            pumpHandler.stop();
        }
    });
}

app.listen(process.env.PORT, () => console.log(`HydroTower listening at http://localhost:${process.env.PORT}`));
