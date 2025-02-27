document.addEventListener('DOMContentLoaded', () => {
    const otpInputs = document.querySelectorAll('.otp-inputs input');

    // Handle input for OTP fields
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;

            // Allow only one digit
            e.target.value = value.replace(/[^0-9]/g, '').slice(0, 1);

            // Move to the next input if there's a value
            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        // Handle backspace to move to the previous input
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                if (!e.target.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            }
        });

        // Handle paste event to fill OTP inputs
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, otpInputs.length);
            if (/^\d+$/.test(pastedData)) {
                otpInputs.forEach((input, i) => {
                    input.value = pastedData[i] || '';
                });
                otpInputs[Math.min(pastedData.length, otpInputs.length - 1)].focus();
            }
        });
    });
});

// Timer for Resend OTP
let countdown = 60; // Timer duration in seconds
const resendBtn = document.getElementById('resendBtn');
const timerDisplay = document.getElementById('timer');

// Initialize localStorage values if not already set
if (!localStorage.getItem('count3')) localStorage.setItem('count3', 0);
if (!localStorage.getItem('expiryTime1')) localStorage.setItem('expiryTime1', 0);

// Function to start the timer
function startTimer() {
    const count = parseInt(localStorage.getItem('count3'), 10);

    // Check if user hit resend limit
    if (count >= 5) {
        const currentTime = new Date().getTime();
        const expiryTime = parseInt(localStorage.getItem('expiryTime1'), 10);

        if (currentTime < expiryTime) {
            const remainingTime = Math.ceil((expiryTime - currentTime) / 1000);
            timerDisplay.textContent = `Try again after ${Math.floor(remainingTime / 60)} minutes`;
            resendBtn.style.pointerEvents = 'none';
            resendBtn.style.color = '#C4AA7B';
            return;
        } else {
            // Reset count if expiry time has passed
            localStorage.setItem('count3', 0);
            localStorage.removeItem('expiryTime1');
        }
    }

    // Start the countdown
    resendBtn.style.pointerEvents = 'none'; // Disable button
    resendBtn.style.color = '#C4AA7B'; // Muted color for disabled state

    const timerInterval = setInterval(() => {
        timerDisplay.textContent = `Resend available in ${countdown}s`;
        countdown--;

        if (countdown < 0) {
            clearInterval(timerInterval);
            resendBtn.style.pointerEvents = 'auto'; // Enable button
            resendBtn.style.color = '#EBCB92'; // Active state color
            timerDisplay.textContent = 'You can now resend the OTP!';
        }
    }, 1000);
}

// Function to set expiry timestamp for 12 hours
function setExpiryTime() {
    const currentTime = new Date().getTime();
    const expiryTime = currentTime + 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    localStorage.setItem('expiryTime1', expiryTime);
}

// Event Listener for Resend Button
resendBtn.addEventListener('click', () => {
    let count = parseInt(localStorage.getItem('count3'), 10);

    if (count >= 5) {
        alert('You have reached the maximum resend attempts. Try again after 12 hours.');
        return;
    }

    alert('OTP has been resent!');
    count++;
    localStorage.setItem('count3', count);

    if (count === 5) {
        setExpiryTime();
        alert('You have reached the maximum attempts. Please wait 12 hours.');
    }

    countdown = 60; // Reset countdown
    startTimer(); // Restart the timer
});

// Function to reset resend count if expiry time has passed
function resetCountIfExpired() {
    const currentTime = new Date().getTime();
    const expiryTime = parseInt(localStorage.getItem('expiryTime1'), 10);

    if (expiryTime && currentTime > expiryTime) {
        localStorage.setItem('count3', 0); // Reset count
        localStorage.removeItem('expiryTime1'); // Remove expiry time
    }
}

// Initialize on page load
resetCountIfExpired();
startTimer();

// Function to resend OTP
function resend() {
    let count = parseInt(localStorage.getItem('count3'), 10);
    if (count >= 5) {
        return;
    }
    fetch('/auth/forgetPasswordOtp/resendOtp', {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            console.log('POST request sent successfully');
        } else {
            console.error('Failed to send POST request');
        }
    })
    .catch(error => console.error('Error:', error));
}