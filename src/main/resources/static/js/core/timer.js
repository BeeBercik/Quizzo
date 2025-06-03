
export default function startTimer(totalSeconds, timerElement, onTimeUp) {
    let remaining = totalSeconds;

    updateDisplay(remaining, timerElement);

    const intervalId = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(intervalId);
            updateDisplay(0, timerElement);
            onTimeUp();
        } else {
            updateDisplay(remaining, timerElement);
        }
    }, 1000);


    return () => clearInterval(intervalId);

    function updateDisplay(sec, el) {
        const min = Math.floor(sec / 60);
        const s = sec % 60;

        const mm = min.toString().padStart(2, "0");
        const ss = s.toString().padStart(2, "0");
        el.textContent = `${mm}:${ss}`;
    }
}
