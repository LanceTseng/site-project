import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import * as UserApi from "./services/userServices.js";
import { isEqualIgnoreCase } from "./utils/stringUtils.js";

async function handleLogin() {

    try {
        const username = $('#username').val();
    const password = $('#password').val();

    const user = await UserApi.getTaskByName(username);
    if (!user) {
        Swal.fire("Error", `User not found.`, "error");
        return;
    }

    if (user.password !== password) {
        Swal.fire("Error", `Password is incorrect.`, "error");
    }

    const userView = await UserEmployeeViewApi.getUserEmployeeByUserId(user.user_id);
    console.log(userView);
    const isActive = userView.u_is_active == "1";
    if (!isActive) {
        window.location.href = "/unauth"; //home
        return;
    }

    sessionStorage.setItem("user", JSON.stringify(userView));
 
    Swal.fire("Success", `Login succeess.`, "success");
    if (isEqualIgnoreCase(userView.user_role ,"admin")) {
        window.location.href = "/"; //home
        return;
    }else if (isEqualIgnoreCase(userView.user_role ,"it")){
        window.location.href = "/it-dashboard";
    }else{
        window.location.href = "/employee-dashboard";
    }
 

    } catch (error) {
        if(error.response.status === 404) 
            Swal.fire("Error", `User not found.`, "error");
        else
            Swal.fire("Error", error.message, "error");
    }
    
}

$(document).ready(function() {
    $('form').on('submit', function(event) {
        event.preventDefault();

        handleLogin();
    });
});