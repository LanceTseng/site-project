function navigateToHome() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
        window.location.href = "/home"; // Redirect
    }
}

function fetchUser(email, password) {
    return axios.get(`/api/Users/GetUsersByCondition?email=${email}&password=${password}`)
        .then(response => {

            // Filter the users array based on the userName and password
            const user = response.data.find(u => u.email === email && u.password === password);

            if (user) {
            
                return user; // Return the found user object
            } else {
               
                return null; // Return null if no user matches
            }
        })
        .catch(error => {
            console.error("Error fetching user:", error);
            return null; // Return null in case of error
        });
}

function processLogin(user) {
    if (user) {
        console.log("Processing User:", user);

        // Save user info in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(user));

        Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Redirecting to dashboard...",
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "/home"; // Redirect
            window.location.reload();
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Invalid credentials!",
        });
    }
}

function preventBackNavigation() {
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            console.log('Back/Forward button detected, reloading...');
            window.location.reload(); // Reload the page when back/forward is triggered
        });
    }

    // Push an initial state to prevent back navigation
    window.history.pushState(null, null, window.location.href);
}


$(document).ready(function () {
    preventBackNavigation();

    navigateToHome();

    // Handle Login Form Submission
    $(".btn-login").click(async function (event) {
        event.preventDefault(); // Prevent default form submission

        let email = $("#Email").val().trim();
        let password = $("#Password").val().trim();

        // Simple validation
        if (!email || !password) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "Both username and password are required!",
            });
            return;
        }

        // Fetch user and process login
        const user = await fetchUser(email, password);
        processLogin(user);
    });
});