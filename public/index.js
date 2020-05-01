(function () {
    document.getElementById('pump-timer-on').onclick = function () {
        fetch('/pump/on', { method: 'PUT' });
    }

    document.getElementById('pump-timer-off').onclick = function () {
        fetch('/pump/off', { method: 'PUT' });
    }
    const rateEls = document.getElementsByClassName('rate');
    for (var i = 0; i < rateEls.length; i++) {
        rateEls[i].onclick = function() {
            const rateStr = this.getAttribute('data-rate');
            const rate = parseFloat(rateStr);
            if (rate < 0) {
                fetch('/pump/interval/off/' + (rate * -60), { method: 'PUT' });
            } else {
                fetch('/pump/interval/on/' + (rate * 60), { method: 'PUT' });
            }
        }
    }

    function doubleDigits(v) {
        if (v < 10) {
            return '0' + v;
        }
        return v.toString();
    }
    function PumpStats() {
        fetch('/pump').then((res) => {
            res.json().then((data) => {
                for (var i = 0; i < rateEls.length; i++) {
                    rateEls[i].setAttribute('class', 'rate');
                }
                document.getElementById('rate-on-' + (data.rateOn / 60)).setAttribute('class', 'rate selected');
                document.getElementById('rate-off-' + (data.rateOff / 60)).setAttribute('class', 'rate selected');

                const runningClock = document.getElementById('running-clock');
                const timerClock = document.getElementById('timer-clock');
                if (data.timerOn) {
                    if (data.pumpRunning) {
                        runningClock.setAttribute('class', 'clock');
                        runningClock.querySelector('.title').innerText = 'Pump Running';
                    } else {
                        runningClock.setAttribute('class', 'clock alternate');
                        runningClock.querySelector('.title').innerText = 'Pump Off';
                    }
                    timerClock.querySelector('.title').innerText = 'Pump Timer Running';
                    runningClock.querySelector('.hours').innerText = doubleDigits(data.running.hours);
                    runningClock.querySelector('.minutes').innerText = doubleDigits(data.running.mins);
                    runningClock.querySelector('.seconds').innerText = doubleDigits(data.running.seconds);
                    timerClock.querySelector('.days').innerText = doubleDigits(data.timer.days);
                    timerClock.querySelector('.hours').innerText = doubleDigits(data.timer.hours);
                    timerClock.querySelector('.minutes').innerText = doubleDigits(data.timer.mins);
                    timerClock.querySelector('.seconds').innerText = doubleDigits(data.timer.seconds);
                } else {
                    runningClock.setAttribute('class', 'clock alternate');
                    runningClock.querySelector('.title').innerText = 'Pump Off';
                    timerClock.querySelector('.title').innerText = 'Pump Off';
                    runningClock.querySelector('.hours').innerText = doubleDigits(0);
                    runningClock.querySelector('.minutes').innerText = doubleDigits(0);
                    runningClock.querySelector('.seconds').innerText = doubleDigits(0);
                    timerClock.querySelector('.days').innerText = doubleDigits(0);
                    timerClock.querySelector('.hours').innerText = doubleDigits(0);
                    timerClock.querySelector('.minutes').innerText = doubleDigits(0);
                    timerClock.querySelector('.seconds').innerText = doubleDigits(0);
                }
                setTimeout(PumpStats, 1000);
            });
        }).catch(() => setTimeout(PumpStats, 1000));
    }
    PumpStats()

    function Temperature() {
        fetch('/temperature').then((res) => {
            res.json().then((data) => {
                // celsius to farenheit
                const f = (data.temperature * 9 / 5) + 32;
                document.getElementById('temperature').innerHTML = f.toFixed(2) + '&#730F';
                document.getElementById('humidity').innerText = data.humidity.toFixed(2) + '%';
                setTimeout(Temperature, 1000);
            });
        }).catch(() => setTimeout(Temperature, 1000));
    }
    Temperature();

    function WaterLevel() {
        fetch('/waterlevel').then((res) => {
            res.json().then((data) => {
                console.log(data);
                setTimeout(WaterLevel, 2000);
            });
        }).catch(() => setTimeout(WaterLevel, 1000));
    }
    WaterLevel();
})();