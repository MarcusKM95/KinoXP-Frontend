const apiUrl = 'http://localhost:8080/users'; // Replace with your actual base URL

// Function to register a user
async function registerUser(userData) {
    try {
        const response = await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorDetails = await response.text(); // Get response text to log more details
            throw new Error(`Registration failed: ${errorDetails}`);
        }

        const result = await response.json();
        console.log('User registered successfully:', result);
        alert('Registration successful!'); // Notify user
    } catch (error) {
        console.error(error);
        alert(error.message); // Notify user about the error
    }
}

// Function to login a user
async function loginUser(username, password) {
    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName: username, password: password }),
        });

        if (!response.ok) {
            const errorDetails = await response.text(); // Get response text to log more details
            throw new Error(`Login failed: ${errorDetails}`);
        }

        const result = await response.text();
        console.log(result); // Login successful message
        alert(result); // Notify user about the successful login
    } catch (error) {
        console.error(error);
        alert(error.message); // Notify user about the error
    }
}

// Function to get all users
async function getAllUsers() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorDetails = await response.text(); // Get response text to log more details
            throw new Error(`Failed to fetch users: ${errorDetails}`);
        }

        const users = await response.json();
        console.log('All users:', users);
        displayUsers(users); // Call to display users on the page
    } catch (error) {
        console.error(error);
        alert(error.message); // Notify user about the error
    }
}

// Function to display users
function displayUsers(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // Clear existing content

    if (users.length === 0) {
        userList.innerHTML = '<p>No users found.</p>';
        return;
    }

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.textContent = `ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`;
        userList.appendChild(userDiv);
    });
}

// Function to get a user by ID
async function getUserById(userId) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`);
        if (!response.ok) {
            const errorDetails = await response.text(); // Get response text to log more details
            throw new Error(`User not found: ${errorDetails}`);
        }

        const user = await response.json();
        console.log('User details:', user);
        // You can display user details on the page if needed
    } catch (error) {
        console.error(error);
        alert(error.message); // Notify user about the error
    }
}

// Function to update a user
async function updateUser(userId, userData) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorDetails = await response.text(); // Get response text to log more details
            throw new Error(`Update failed: ${errorDetails}`);
        }

        const updatedUser = await response.json();
        console.log('User updated successfully:', updatedUser);
        alert('User updated successfully!'); // Notify user
    } catch (error) {
        console.error(error);
        alert(error.message); // Notify user about the error
    }
}

// Function to delete a user
async function deleteUser(userId) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorDetails = await response.text(); // Get response text to log more details
            throw new Error(`Delete failed: ${errorDetails}`);
        }

        console.log('User deleted successfully');
        alert('User deleted successfully!'); // Notify user
    } catch (error) {
        console.error(error);
        alert(error.message); // Notify user about the error
    }
}

// Event Listeners
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const userData = {
        username: document.getElementById('registerUsername').value,
        password: document.getElementById('registerPassword').value,
        email: document.getElementById('registerEmail').value
    };
    registerUser(userData); // Call the register function
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    loginUser(username, password); // Call the login function
});

document.getElementById('getAllUsers').addEventListener('click', function() {
    getAllUsers(); // Call the function to fetch all users
});

document.getElementById('updateForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const userId = document.getElementById('updateUserId').value; // Get user ID
    const userData = {
        username: document.getElementById('updateUsername').value,
        email: document.getElementById('updateEmail').value
    };
    updateUser(userId, userData); // Call the update function
});

document.getElementById('deleteForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const userId = document.getElementById('deleteUserId').value; // Get user ID
    deleteUser(userId); // Call the delete function
});
