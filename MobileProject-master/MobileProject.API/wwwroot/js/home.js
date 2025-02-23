function loadLoginStatus() {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user) {
        $(".text-login-user").html(`Welcome, ${user.userName} (${user.role})`);

        // Hide guest section
        $(".guest-section").hide();

        // Show user or admin section based on role
        if (user.role.toLowerCase() === "user" ) {
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

$(document).ready(function () {
    loadLoginStatus();
})