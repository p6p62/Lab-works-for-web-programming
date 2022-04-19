var secondCounterTimerId;

function startTimer() {
    var timerBlock = document.getElementById("time_counter");
    secondCounterTimerId = setInterval(() => {
        var counterValue = parseFloat(timerBlock.textContent);
        timerBlock.textContent = (counterValue + 0.1).toFixed(1);
    }, 100);
}

function stopTimer() {
    clearInterval(secondCounterTimerId);
    document.getElementById("time_counter").textContent = '0';
}