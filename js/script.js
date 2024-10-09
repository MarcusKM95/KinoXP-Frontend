const userURL = 'http://localhost:8080/users'
// Handle login form submission
document.getElementById("login").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    console.log(email, password);
    // Fetch request for login
    fetch(userURL+"/login" , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
        .then(response => {
            if (response.ok) {
                alert('Login successful!');
                // Redirect to a different page or show user dashboard
                console.log(response);
            } else {
                alert('Login failed! Please check your credentials.');
            }
        }).then()
        .catch(error => {
            console.error('Error:', error);
        });
});

// Handle registration form submission
document.getElementById("register").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const address = document.getElementById("registerAddress").value;
    const phone = document.getElementById("registerPhone").value;
    const password = document.getElementById("registerPassword").value;

    // Fetch request for registration
    fetch(userURL+'/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: username,
            email: email,
            address: address,
            phoneNumber: phone,
            password: password
        }),
    })
        .then(response => {
            if (response.ok) {
                alert('Registration successful! Please log in.');
                toggleForms(); // Switch to login form after successful registration
            } else {
                alert('Registration failed! Please check your input.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Event listeners to toggle between forms
document.getElementById("show-register").addEventListener("click", toggleForms);
document.getElementById("show-login").addEventListener("click", toggleForms);

// Function to toggle between login and registration forms
function toggleForms() {
    const loginForm = document.getElementById("login-form");
    const registrationForm = document.getElementById("registration-form");

    loginForm.classList.toggle("hidden");
    registrationForm.classList.toggle("hidden");
}