
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

// 🧑‍💼 Full Name Validation
const fullName = document.getElementById('fullName');
let fullNameError = false;

function validateFullName() {
    let name = fullName.value.trim();
    let regex = /^[a-zA-Z\s]+$/;

    if (name === '') {
         setError(fullName, 'Full Name is required');
         fullNameError = true;
    } else if (name.length < 3) {
        setError(fullName, 'Name must be at least 3 characters long');
        fullNameError = true;
    } else if (!regex.test(name)) {
        setError(fullName, 'Name can only contain alphabetic characters and spaces');
        fullNameError = true;
    } else {
        clearError(fullName);
        fullNameError = false;
    }
}

function validateFullName2() {
    if(!fullNameError) {
        return;
    }
    let name = fullName.value.trim();
    let regex = /^[a-zA-Z\s]+$/;

    if (name === '') {
        setError(fullName, 'Full Name is required');
         fullNameError = true;
    } else if (name.length < 3) {
        setError(fullName, 'Name must be at least 3 characters long');
        fullNameError = true;
    } else if (!regex.test(name)) {
        setError(fullName, 'Name can only contain alphabetic characters and spaces');
        fullNameError = true;
    } else {
        clearError(fullName);
        fullNameError = false;
    }
}

fullName.addEventListener('blur', validateFullName);
fullName.addEventListener('input', validateFullName2);

// 📧 Email Validation
const emailOrPhone = document.getElementById('emailOrPhone');
        const emailOrPhoneMessage = document.getElementById('emailOrPhoneMessage');
        let emailOrPhoneError = false;

        function validateEmailOrPhone() {
            let value = emailOrPhone.value.trim();
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Email regex
            let phoneRegex = /^[+]?[0-9]{10,15}$/;  // Phone number regex

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

        function validateEmailOrPhone2() {
            if (!emailOrPhoneError) {
                return;
            }
            let value = emailOrPhone.value.trim();
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let phoneRegex = /^[+]?[0-9]{10,15}$/;

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

        emailOrPhone.addEventListener('blur', validateEmailOrPhone);
        emailOrPhone.addEventListener('input', validateEmailOrPhone2);
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

// Toggle Password Visibility
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', () => {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  togglePassword.classList.toggle('fa-eye');
  togglePassword.classList.toggle('fa-eye-slash');
});

password.addEventListener('input', ()=>{
    let passwordValue = password.value.trim();
    let confirmPasswordValue = passwordConfirm.value.trim();
    if (passwordValue === confirmPasswordValue) {
        clearError(passwordConfirm);
        passwordConfirmError = false;
    }
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
    validateFullName();
    validateEmailOrPhone();
    validatePassword();
    validateConfirmPassword();

    if (fullNameError || emailOrPhoneError || passwordError || passwordConfirmError) {
        e.preventDefault();
        alert('Please fix validation errors before submitting.');
    } else {
        e.preventDefault();

        const formData = {
            emailOrPhone: emailOrPhone.value.trim(),
            password: password.value.trim(),
            name: fullName.value.trim()
        };

        console.log('Form submitted successfully!');

        fetch('/auth/signin/signinAuth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.ok ? response.text() : Promise.reject('Failed to authenticate.'))
        .then(data => {
            if (data === "done") {
                window.location.href = '/auth/otp';
            } else if(data === "already") {
                window.location.href = '/auth/already';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while logging in. Please try again.');
        });
    }
});
