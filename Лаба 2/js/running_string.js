function startTimer() {
    var timerBlock = document.getElementById("time_counter");
    setInterval(() => {
        var counterValue = parseFloat(timerBlock.textContent);
        timerBlock.textContent = (counterValue + 0.1).toFixed(1);
    }, 100);
}