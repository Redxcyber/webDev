// Task : Countdown Timer

let seconds = 60;

let countIntervalId = setInterval(() => {
    console.log(`${seconds} sec left !!`);
    seconds--;

    if (seconds < 0) {
        console.log("Time's up");
        clearInterval(countIntervalId);
    }
}, 1000);