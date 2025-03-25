let timeLeft = 30;
let results = [];
let timerInterval;
let periodCounter = 201024001; // Starting Period Number

// Initialize the user's wallet balance (for demonstration)
let walletBalance = 5000; // Set initial wallet balance as ₹5000
let userBets = []; // यूजर की बेट डिटेल्स स्टोर करने के लिए

// Pagination variables
let currentPage = 0;
const resultsPerPage = 10;

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.innerText = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
        }

        if (timeLeft === 5) {
            showCountdownOverlay(); // Show the countdown overlay when time is 5 seconds
        }

        timeLeft--;

        if (timeLeft < 0) {
            timeLeft = 30;
            generateRandomNumber();
        }
    }, 1000);
}

// Function to generate a random number and update results
function generateRandomNumber() {
    const number = Math.floor(Math.random() * 10); // Random number between 0 and 9
    const colorClass = getColorClass(number);

    // Add new result to the array
    results.unshift({ number, colorClass, period: periodCounter });

    periodCounter++; // Increment period number

    updateWingoNumbers();
    updateHistory();
    updateNextPeriod();
    checkBettingResult(); // Check betting result after generating a new number
}

// Function to get the color class for a number
function getColorClass(number) {
    if (number === 0 || number === 5) {
        return 'violet'; // 0 and 5 are violet
    } else if (number % 2 === 0) {
        return 'red'; // Even numbers other than 0 are red
    } else {
        return 'green'; // Odd numbers other than 5 are green
    }
}

// Function to update Wingo numbers (latest 5 results)
function updateWingoNumbers() {
    const wingoDiv = document.getElementById('wingo-numbers');
    if (wingoDiv) {
        wingoDiv.innerHTML = '';

        results.slice(0, 5).forEach(result => {
            const numberCircle = document.createElement('div');
            numberCircle.classList.add('number-ball', result.colorClass);

            // Create an image element for the result number
            const numberImage = document.createElement('img');
            numberImage.src = `no${result.number}.png`; // Image filename based on the number (e.g., no7.png)
            numberImage.alt = result.number; // Alt text as number

            // Append the image to the number circle div
            numberCircle.appendChild(numberImage);

            wingoDiv.appendChild(numberCircle);
        });
    }
}

// Function to update the results history (latest 10 results with pagination)
function updateHistory() {
    const historyDiv = document.getElementById('results-history');
    if (historyDiv) {
        historyDiv.innerHTML = '';

        const start = currentPage * resultsPerPage;
        const end = start + resultsPerPage;
        const pageResults = results.slice(start, end);

        // Reverse results for history display
        for (let i = 0; i < pageResults.length; i++) {
            const result = pageResults[i];
            const historyRow = document.createElement('div');
            historyRow.classList.add('history-row');

            historyRow.innerHTML = `
                <div class="period-no">${result.period}</div>
                <div class="number-center">${result.number}</div>
                <div class="big-small-right">${result.number >= 5 ? 'Big' : 'Small'}</div>
            `;

            historyDiv.appendChild(historyRow);
        }

        updateNavigationButtons();
    }
}

// Function to update the next period number
function updateNextPeriod() {
    const nextPeriod = document.getElementById('period-number');
    if (nextPeriod) {
        nextPeriod.innerText = periodCounter; // Update next period number
    }
}

// Function to open the betting slide
function openBattingSlide(selectedOption) {
    const battingOverlay = document.getElementById('battingOverlay');
    const selectedOptionText = document.getElementById('selectedOption');
    if (selectedOptionText && battingOverlay) {
        selectedOptionText.innerText = `Selected: ${selectedOption}`;

        // Show the overlay
        battingOverlay.style.display = 'block';
        setTimeout(() => {
            battingOverlay.classList.add('active');
        }, 10);
    }
}

// Function to close the betting slide
function closeBattingSlide() {
    const battingOverlay = document.getElementById('battingOverlay');
    if (battingOverlay) {
        battingOverlay.classList.remove('active');
        setTimeout(() => {
            battingOverlay.style.display = 'none';
        }, 300);
    }
}

// Toast Notification Function (केवल बेटिंग मैसेज के लिए)
function ShowToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast-notification');
    
    toast.innerHTML = `
        <div class="toast-content">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Custom alert function with background image (जीत/हार के लिए मूल फंक्शन)
function showAlert(message, backgroundImage, isWin, winningNumber = null, winningColor = null, Won = null, periodNo = null) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('custom-alert');
    alertBox.style.backgroundImage = `url(${backgroundImage})`;

    // Add win or loss class based on the result
    if (isWin) {
        alertBox.classList.add('win');
        alertBox.innerHTML = `
            <div class="alert-message">
                <h1>Congratulations</h1>
                <p class="Result">Result: ${winningNumber} (${winningColor})</p>
                <p class="Won">Won: ₹${Won.toFixed(2)}</p>
                <p class="period-no">Period no: ${periodNo}</p>
            </div>
        `;
    } else {
        alertBox.classList.add('loss');
        alertBox.innerHTML = `
            <div class="alert-message">
                <h1>Sorry</h1>
                <p>You didn't win this time.</p>
            </div>
        `;
    }

    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.remove();
    }, 5000);
}

// Event listener for the "Confirm Bet" button
document.getElementById('confirmBet').addEventListener('click', () => {
    const betAmount = parseInt(document.getElementById('betAmount').value, 10);
    const selectedOption = document.getElementById('selectedOption').innerText.split(": ")[1];

    if (isNaN(betAmount) || betAmount <= 0) {
        ShowToast("कृपया वैध राशि दर्ज करें।");
        return;
    }
    if (betAmount > walletBalance) {
        ShowToast("अपर्याप्त बैलेंस!");
        closeBattingSlide();
    } else {
        userBets.push({
            option: selectedOption,
            amount: betAmount
        });

        walletBalance -= betAmount;
        document.getElementById('walletBalanceBox').innerText = ` ₹${walletBalance}`;
        ShowToast(`बेट सफल! ₹${betAmount} आपके वॉलेट से कट गई है।`);
        closeBattingSlide();
    }
});

// Event listener for the "Cancel Bet" button
document.getElementById('cancelBet').addEventListener('click', () => {
    closeBattingSlide();
});

// Function to check the betting result after each round
function checkBettingResult() {
    if (userBets.length === 0) return;

    const latestResult = results[0];
    let totalWinAmount = 0;
    let hasWon = false;

    userBets.forEach(bet => {
        let isWin = false;
        let winAmount = 0;

        if ((bet.option === "Big" && latestResult.number >= 5) ||
            (bet.option === "Small" && latestResult.number < 5)) {
            isWin = true;
            winAmount = bet.amount * 1.96;
        } else if ((bet.option === "Red" && latestResult.colorClass === "red" && latestResult.number !== 5) ||
                   (bet.option === "Green" && latestResult.colorClass === "green" && latestResult.number !== 0)) {
            isWin = true;
            winAmount = bet.amount * 1.96;
        } else if (bet.option === "Red" && latestResult.number === 0) {
            isWin = true;
            winAmount = bet.amount * 1.5;
        } else if (bet.option === "Green" && latestResult.number === 5) {
            isWin = true;
            winAmount = bet.amount * 1.5;
        } else if (bet.option === "Violet" && latestResult.colorClass === "violet") {
            isWin = true;
            winAmount = bet.amount * 4.52;
        } else if (parseInt(bet.option) === latestResult.number) {
            isWin = true;
            winAmount = bet.amount * 8.51;
        }

        if (isWin) {
            walletBalance += winAmount;
            totalWinAmount += winAmount;
            hasWon = true;
        }
    });

    if (hasWon) {
        showAlert(`You Won\n₹${totalWinAmount.toFixed(2)}`, 'win.png', true, latestResult.number, latestResult.colorClass, totalWinAmount, latestResult.period);
    } else {
        showAlert("Didn't Win", 'loss.png', false);
    }

    userBets = [];
    document.getElementById('walletBalanceBox').innerText = ` ₹${walletBalance}`;
}

// Function to update navigation buttons state
function updateNavigationButtons() {
    const previousBtn = document.getElementById('previous-btn');
    const nextBtn = document.getElementById('next-btn');

    if (currentPage === 0) {
        previousBtn.disabled = true;
    } else {
        previousBtn.disabled = false;
    }

    if ((currentPage + 1) * resultsPerPage >= results.length) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
}

// Function to show the previous page of results
function showPreviousPage() {
    if (currentPage > 0) {
        currentPage--;
        updateHistory();
    }
}

// Function to show the next page of results
function showNextPage() {
    if ((currentPage + 1) * resultsPerPage < results.length) {
        currentPage++;
        updateHistory();
    }
}

// Add the event listeners to the number/option elements
document.querySelectorAll('.number-ball, .heading-box').forEach(item => {
    item.addEventListener('click', (e) => {
        const selectedOption = e.target.innerText || e.target.alt;
        openBattingSlide(selectedOption);
    });
});

// Function to show the countdown overlay
function showCountdownOverlay() {
    const countdownOverlay = document.createElement('div');
    countdownOverlay.classList.add('countdown-overlay');
    countdownOverlay.innerHTML = `<div class="countdown-timer">5</div>`;
    
    const gameBox = document.querySelector('.game-box');
    if (gameBox) {
        gameBox.appendChild(countdownOverlay);
    }
    
    let countdown = 5;
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownOverlay.querySelector('.countdown-timer').innerText = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            countdownOverlay.remove();
        }
    }, 1000);
}

let playerBet = 500;
let houseBalance = 10000;
let lossLimit = 2000;
let winProbability;

// Dynamic Probability Adjustment
if (playerBet < 1000) {
    winProbability = 0.3; // छोटे दांव पर 30% जीत
} else {
    winProbability = 0.1; // बड़े दांव पर 10% जीत
}

// Threshold Algorithm
if (houseBalance - lossLimit < 0) {
    winProbability = 0; // नुकसान सीमा पार होने पर हाउस जीतता है
}

// Result Calculation
let result;
if (Math.random() < winProbability) {
    result = "Player Wins";
    houseBalance -= playerBet;
} else {
    result = "House Wins";
    houseBalance += playerBet;
}

// Game Fairness Balance
if (Math.random() < 0.05) {
    result = "Player Wins"; // हर 20वें राउंड में यूजर जीतता है
}

console.log(`Result: ${result}, House Balance: ${houseBalance}`);

// Start the game timer
startTimer();
