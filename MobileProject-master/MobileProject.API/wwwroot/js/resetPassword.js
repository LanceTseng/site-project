function fetchUser(userName, password) {
    return axios.get(`/api/Users/GetUsersByCondition?userName=${userName}`)
        .then(response => {
            // Filter the users array based on the userName and password
            const user = response.data.find(u => u.userName === userName);

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
function isValidPassword(password) {
    const regex = /^(?=.*[A-Z]).{8,}$/; // At least 8 chars, 1 uppercase
    return regex.test(password);
}

async function handleResetPassword() {
    let userName = $("#UserName").val().trim();
    let newPassword = $("#NewPassword").val().trim();

    if (!userName || !newPassword) {
        Swal.fire({
            icon: "warning",
            title: "Validation Error",
            text: "Both username and new password are required!",
        });
        return;
    }

    var user = await fetchUser(userName);
    if (!user) {
        Swal.fire("Error", "User not found.", "error");
        return;
    }

    if (!isValidPassword(newPassword)) {
        Swal.fire("Error", "Password must be at least 8 characters long and contain at least one uppercase letter.", "error");
        return;
    }

    user.password = newPassword;

    await axios.put(`/api/Users/UpdateUser`, user)
        .then(() => {
            Swal.fire({
                title: "Success!",
                text: "User updated successfully" ,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

            window.location.href = "/auth"; // Redirect after success
        })
        .catch(error => {
            console.error("Error updating user:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update user",
                icon: "error",
                timer: 2000,
                showConfirmButton: false
            });
        });
}

//update user
$(document).ready(function () {
    $(".btn-reset-pwd").click(async function (e) {
        e.preventDefault();
        handleResetPassword();
    });
})