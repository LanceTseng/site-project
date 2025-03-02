$(document).ready(function () {
    // Mock department and status data
    const departments = ["IT Support", "HR", "Finance", "Admin"];
    const statuses = ["New", "Processing", "Completed", "Cancelled"];

    // Populate dropdowns
    departments.forEach(dept => {
        $("#searchDepartment, #addTicketDepoartment").append(`<option value="${dept}">${dept}</option>`);
    });

    statuses.forEach(status => {
        $("#searchTicketStatus").append(`<option value="${status}">${status}</option>`);
    });

    // Submit Ticket
    $("#submitTicket").click(function () {
        const title = $("#addTicketTitle").val().trim();
        const department = $("#addTicketDepoartment").val();
        const description = $("#addTicketDescription").val().trim();

        if (!title || !department || !description) {
            Swal.fire("Error", "Please fill in all fields!", "error");
            return;
        }

        // Mock API call
        axios.post("/mock-submit-ticket", { title, department, description })
            .then(response => {
                console.log("Ticket Submitted:", response.data);
                
                // Generate a random ticket ID
                const ticketID = Math.floor(Math.random() * 10000);
                const createdBy = "John Doe"; // Mock user
                const createdDate = new Date().toLocaleDateString();

                // Append new ticket to table
                $("#ticketTableBody").prepend(`
                    <tr>
                        <td>${ticketID}</td>
                        <td>${title}</td>
                        <td>Open</td>
                        <td>${department}</td>
                        <td>${createdBy}</td>
                        <td>${createdDate}</td>
                    </tr>
                `);

                // Clear input fields & close modal
                $("#addTicketTitle, #addTicketDepoartment, #addTicketDescription").val("");
                $("#ticketModal").modal("hide");

                Swal.fire("Success", "Ticket Created Successfully!", "success");
            })
            .catch(error => {
                console.error("Error submitting ticket:", error);
                Swal.fire("Error", "Failed to submit ticket!", "error");
            });
    });

    // Post a Reply
    $("#postComment").click(function () {
        const commentText = $("#commentInput").val().trim();

        if (!commentText) {
            Swal.fire("Error", "Comment cannot be empty!", "error");
            return;
        }

        // Mock API call
        axios.post("/mock-add-comment", { comment: commentText })
            .then(response => {
                console.log("Comment Added:", response.data);

                // Append new comment to the section
                $("#commentsSection").append(`
                    <div class="card p-2 mt-2">
                        <strong>John Doe:</strong>
                        <p>${commentText}</p>
                    </div>
                `);

                // Clear input field
                $("#commentInput").val("");
                Swal.fire("Success", "Reply Posted!", "success");
            })
            .catch(error => {
                console.error("Error adding comment:", error);
                Swal.fire("Error", "Failed to add comment!", "error");
            });
    });
});
