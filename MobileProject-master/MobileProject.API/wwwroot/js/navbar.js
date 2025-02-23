function loadLoginStatus() {
    let user = JSON.parse(sessionStorage.getItem("user"));

    if (user) {
        $(".text-login-user").html(`Welcome, ${user.userName} (${user.role})!`);
       
        $(".btn-logout").show();
        $(".btn-login").hide();
    } else {
        $(".text-login-user").html(`Welcome, Guest!`);
     
        $(".btn-logout").hind();
        $(".btn-login").show();
    }
}



$(document).ready(function () {

    loadLoginStatus();
});