// Common Utility Functions for Validation Feedback
function setError(element, message) {
    const messageElement = document.getElementById(`${element.id}Message`);
    messageElement.textContent = message; // Set the error message
    element.classList.add('iAfter'); // Add error styling
}

function clearError(element) {
    const messageElement = document.getElementById(`${element.id}Message`);
    messageElement.textContent = ''; // Clear the error message
    element.classList.remove('iAfter'); // Remove error styling
}

// Email or Phone Validation
const emailOrPhone = document.getElementById('emailOrPhone');
const password = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const form = document.getElementById('form');
let emailOrPhoneError = false;

// Validate Email or Phone
function validateEmailOrPhone() {
    const value = emailOrPhone.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email regex
    const phoneRegex = /^[+]?[0-9]{10,15}$/; // Phone number regex

    if (value === '') {
        setError(emailOrPhone, 'Email or Phone Number is required');
        emailOrPhoneError = true;
    } else if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        setError(emailOrPhone, 'Invalid email or phone number format');
        emailOrPhoneError = true;
    } else {
        clearError(emailOrPhone);
        emailOrPhoneError = false;
    }
}

// Event Listeners for Validation
emailOrPhone.addEventListener('blur', validateEmailOrPhone);
emailOrPhone.addEventListener('input', validateEmailOrPhone);

// Toggle Password Visibility
togglePassword.addEventListener('click', () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type); // Toggle input type
    togglePassword.classList.toggle('fa-eye'); // Toggle eye icon
    togglePassword.classList.toggle('fa-eye-slash'); // Toggle eye-slash icon
});

// Form Submission Handling
form.addEventListener('submit', (e) => {
    validateEmailOrPhone(); // Call validation function explicitly

    if (emailOrPhoneError) {
        e.preventDefault(); // Prevent form submission if errors exist
        alert('Please fix validation errors before submitting.');
    } else {
        e.preventDefault(); // Always prevent default to control form submission via JavaScript

        // Prepare Form Data
        const formData = {
            emailOrPhone: emailOrPhone.value.trim(),
            password: password.value.trim()
        };

        // Send Form Data to Server
        fetch('/auth/login/loginAuth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Sending JSON data
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                return response.text(); // Read the response body as text
            } else {
                throw new Error('Failed to authenticate. Please try again.');
            }
        })
        .then(data => {
            console.log('Response from server:', data);
            // Handle different responses from the server
            if (data === "done") {
                window.location.href = '/'; // Redirect to landing page
            } else if (data === "new") {
                window.location.reload(); // Reload the page
            } else if (data === "admin") {
                window.location.href = '/admin/dashboard'; // Redirect to admin page
            } else if (data === "undone") {
                window.location.reload(); // Reload the page
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while logging in. Please try again.'); // Show error alert
        });
    }
});