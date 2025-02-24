function loadLoginStatus() {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user) {
        $(".text-login-user").html(`Welcome, ${user.userName} (${user.role})`);

        // Hide guest section
        $(".guest-section").hide();

        // Show user or admin section based on role
        if (user.role.toLowerCase() === "user") {
            $(".user-section").show();
        }

        if (user.role.toLowerCase() === "admin") {
            $(".admin-section").show();
            $(".user-section").show();
        }
    } else {
        // Show guest section, hide others
        $(".guest-section").show();
        $(".user-section").hide();
        $(".admin-section").hide();
    }
}

function logout() {

    Swal.fire({
        icon: "success",
        title: "Logout Successful",
        text: "Redirecting to home...",
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        sessionStorage.removeItem("user");
        setTimeout(() => {
            window.location.reload();
        }, 100);  // ✅ Small delay ensures data is cleared first
    });
}


$(document).ready(function () {
    loadLoginStatus();

    $(".btn-logout").click(function (event) {
        event.preventDefault();
        logout();
    });
})