function loadLoginStatus() {
    let user = JSON.parse(sessionStorage.getItem("user"));

    $(".btn-logout").hide();
    $(".btn-login").hide();

    if (user) {
        $(".text-login-user").html(`Welcome, ${user.userName} (${user.role})!`);

        $(".btn-logout").show();
    } else {
        $(".text-login-user").html(`Welcome, Guest!`);

        $(".btn-login").show();
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
        window.location.href = "/home"; // Redirect
    });
}

$(document).ready(function () {

    loadLoginStatus();

    $(".btn-logout").click(function (e) {
        e.preventDefault();
        logout();
    });
});