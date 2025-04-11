// Function to validate username existence (simulate async check)
async function isValidUserName(username) {
    try {
        // Fetch existing users (assuming API returns an array)
        const response = await axios.get("/api/Users/GetAllUsers");
        const existingUsers = response.data; 
        // Ensure existingUsers is an array before calling includes
        if (Array.isArray(existingUsers)) {
            return existingUsers.some(user => user.userName === username);
        } else {
            console.error("Error: existingUsers is not an array", existingUsers);
            return false;
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return false;
    }
}

async function isExistedEmail(email) {
    try {
        // Fetch existing users (assuming API returns an array)
        const response = await axios.get("/api/Users/GetAllUsers");
        const existingUsers = response.data;
        // Ensure existingUsers is an array before calling includes
        if (Array.isArray(existingUsers)) {
            return existingUsers.some(user => user.email == email);
        } else {
            console.error("Error: existingUsers is not an array", existingUsers);
            return false;
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return false;
    }
}

// Function to validate password strength
function isValidPassword(password) {
    const regex = /^(?=.*[A-Z]).{8,}$/; // At least 8 chars, 1 uppercase
    return regex.test(password);
}

// Function to validate email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email pattern
    return regex.test(email);
}

// Function to validate phone number (10 digits)
function isValidPhone(phone) {
    const regex = /^\d{10}$/; // Exactly 10 digits
    return regex.test(phone);
}

// Function to handle signup
async function signup() {
    const username = $("#UserName").val().trim();
    const email = $("#Email").val().trim();
    const phone = $("#Phone").val().trim();
    const password = $("#Password").val().trim();

    // Username check
    //if (await isValidUserName(username)) {
    //    Swal.fire("Error", "User already exists.", "error");
    //    return;
    //}

    // Password validation
    if (!isValidPassword(password)) {
        Swal.fire("Error", "Password must be at least 8 characters long and contain at least one uppercase letter.", "error");
        return;
    }

    // Email validation
    if (!isValidEmail(email)) {
        Swal.fire("Error", "Please enter a valid email address.", "error");
        return;
    }

    if (await isExistedEmail(email)) {
        Swal.fire("Error", "Email already exists.", "error");
        return;
    }

    // Phone number validation
    if (!isValidPhone(phone)) {
        Swal.fire("Error", "Please enter a valid phone number (10 digits).", "error");
        return;
    }

    // Submit data (Simulate API request)
    try {
        const response = await axios.post("/api/Users/CreateUser", {
            userName: username,
            email,
            phone,
            password: password,
            createdDate: new Date(),
            role:"user"
        });
  
        if (response.status == 200) {
            Swal.fire("Success", "Registration successful! Redirecting...", "success")
                .then(() => {
                 
                    window.location.href = "/auth"; // Redirect after success
                });
        } else {
            Swal.fire("Error", response.data.message || "Signup failed.", "error");
        }
    } catch (error) {
        Swal.fire("Error", "An error occurred while signing up.", "error");
    }
}

// Bind event on document ready
$(document).ready(function () {
    console.log("Load..");
    $("#form-signup").submit(function (e) {
        e.preventDefault();
        signup();
    });
});