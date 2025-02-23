function navigateToHome() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
        window.location.href = "/home"; // Redirect
    }
}

function fetchUser(userName, password) {
    return axios.get(`/api/Users/GetUsersByCondition?userName=${userName}&password=${password}`)
        .then(response => {
            console.log("Fetched User:", response.data[0]);
            return response.data[0]; // Return user object
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
$(document).ready(function () {
    navigateToHome();

    // Handle Login Form Submission
    $(".btn-login").click(async function (event) {
        event.preventDefault(); // Prevent default form submission

        let userName = $("#UserName").val().trim();
        let password = $("#Password").val().trim();

        // Simple validation
        if (!userName || !password) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "Both username and password are required!",
            });
            return;
        }

        // Fetch user and process login
        const user = await fetchUser(userName, password);
        processLogin(user);
    });
});