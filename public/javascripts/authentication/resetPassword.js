// 📝 Common Utility Function for Validation Feedback
function setError(element, message) {
    const messageElement = document.getElementById(`${element.id}Message`);
    messageElement.textContent = message;
    element.classList.add('iAfter');
}

function clearError(element) {
    const messageElement = document.getElementById(`${element.id}Message`);
    messageElement.textContent = '';
    element.classList.remove('iAfter');
}

// 🔑 Password Validation
const password = document.getElementById('password');
let passwordError = false;

function validatePassword() {
    let passwordValue = password.value.trim();
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (passwordValue === '') {
        setError(password, 'Password is required');
        passwordError = true;
    } else if (!regex.test(passwordValue)) {
        setError(
            password,
            'Password must be at least 8 characters long, contain uppercase, lowercase, number, and a special character'
        );
        passwordError = true;
    } else {
        clearError(password);
        passwordError = false;
    }
}

function validatePassword2() {
    if(!passwordError) {
        return;
    }
    let passwordValue = password.value.trim();
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (passwordValue === '') {
        setError(password, 'Password is required');
        passwordError = true;
    } else if (!regex.test(passwordValue)) {
        setError(
            password,
            'Password must be at least 8 characters long, contain uppercase, lowercase, number, and a special character'
        );
        passwordError = true;
    } else {
        clearError(password);
        passwordError = false;
    }
}

password.addEventListener('blur', validatePassword);
password.addEventListener('input', validatePassword2);

// 📝 Confirm Password Validation
const passwordConfirm = document.getElementById('passwordConfirm');
let passwordConfirmError = false;

function validateConfirmPassword() {
    let passwordValue = password.value.trim();
    let confirmPasswordValue = passwordConfirm.value.trim();
    if (confirmPasswordValue === '') {
        setError(passwordConfirm, 'Confirm Password is required');
        passwordConfirmError = true;
    } else if (!passwordValue.startsWith(confirmPasswordValue)) {
        setError(passwordConfirm, 'Passwords do not match');
        passwordConfirmError = true;
    } 
    else if(passwordValue.length == confirmPasswordValue.length){
        if(passwordValue !== confirmPasswordValue){
            setError(passwordConfirm, 'Passwords do not match');
            passwordConfirmError = true;
        }
    }else {
        clearError(passwordConfirm);
        passwordConfirmError = false;
    }
}

passwordConfirm.addEventListener('input', validateConfirmPassword);

password.addEventListener('input', ()=>{
    let passwordValue = password.value.trim();
    let confirmPasswordValue = passwordConfirm.value.trim();
    if (passwordValue === confirmPasswordValue) {
        clearError(passwordConfirm);
        passwordConfirmError = false;
    }
});

// Toggle Password Visibility
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', () => {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  togglePassword.classList.toggle('fa-eye');
  togglePassword.classList.toggle('fa-eye-slash');
});

// Toggle Confirm Password Visibility
const togglePasswordConfirm = document.getElementById('togglePasswordConfirm');

togglePasswordConfirm.addEventListener('click', () => {
  const type = passwordConfirm.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordConfirm.setAttribute('type', type);
  togglePasswordConfirm.classList.toggle('fa-eye');
  togglePasswordConfirm.classList.toggle('fa-eye-slash');
});

// ✅ Final Validation on Form Submission
const form = document.getElementById('form');


form.addEventListener('submit', (e) => {
    validatePassword();
    validateConfirmPassword();

    if (passwordError || passwordConfirmError) {
        e.preventDefault(); // Prevent form submission if errors exist
        alert('Please fix validation errors before submitting.');
    } else {
        e.preventDefault(); // Always prevent default to control form submission via JavaScript
        // Prepare Form Data
        const formData = {
            password: password.value.trim()
        };

        console.log('Form submitted successfully!');

        fetch('/auth/resetPassword/resetPasswordConfirm', {
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
            if (data === "done") {
                window.location.href = '/auth/resetSuccess'; // Redirect to landing page
            }
            else{
                alert('Failed to reset password. Please try again.');
            }
        })
        
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while logging in. Please try again.');
        });
     }
});



