$(document).ready(function () {
    function loadTasks() {
        axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5') // Simulated API
            .then(response => {
                $('#taskList').empty();
                response.data.forEach(task => {
                    $('#taskList').append(`<li>${task.title}</li>`);
                });
            })
            .catch(error => console.log(error));
    }

    $('#refreshTasks').click(loadTasks);

    loadTasks(); // Load tasks initially
});
