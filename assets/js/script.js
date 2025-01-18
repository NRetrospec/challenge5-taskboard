// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Function to generate a unique task id
function generateTaskId() {
    if (nextId) {
        nextId = nextId + 1;
    } else {
        nextId = 1;
    }

    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}

// Function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-taskid', task.id);

    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-taskid', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);

    // Set background color based on status
    switch (task.status) {
        case 'to-do':
            taskCard.addClass('bg-danger text-white');
            break;
        case 'in-progress':
            taskCard.addClass('bg-warning text-dark');
            break;
        case 'done':
            taskCard.addClass('bg-light text-dark'); // or use `bg-white` if applicable
            break;
    }

    // If a due date exists and the task is not done, check for urgency
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        // If the task is due today, keep it yellow; if it's overdue, it should remain red
        if (now.isSame(taskDueDate, 'day') && task.status === 'to-do') {
            taskCard.removeClass('bg-danger').addClass('bg-warning text-dark');
        } else if (now.isAfter(taskDueDate) && task.status === 'to-do') {
            taskCard.removeClass('bg-warning').addClass('bg-danger text-white');
        }
    }

    // Gather all the elements created above and append them to the task card
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    // Empty existing cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    // Loop through tasks and create cards for each status
    for (let task of taskList) {
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }

    // Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');

            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    // Read user input from the form
    const taskTitle = $("#title").val().trim();
    const taskDueDate = $("#due-date").val();
    const taskDescription = $("#description").val();

    const newTask = {
        id: generateTaskId(),
        title: taskTitle,
        dueDate: taskDueDate,
        description: taskDescription,
        status: 'to-do',
    };
    
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

    // Clear the form inputs
    $("#title").val('');
    $("#due-date").val('');
    $("#description").val('');
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(this).attr('data-taskid');

    taskList = taskList.filter(task => task.id !== parseInt(taskId));

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable[0].dataset.taskid;
    const newStatus = event.target.id;

    for (let task of taskList) {
        if (task.id === parseInt(taskId)) {
            task.status = newStatus;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList(); // This will recreate the cards with the updated colors
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('#due-date').datepicker({
        changeMonth: true,
        changeYear: true,
    });

    $("#task-form").on("submit", handleAddTask);

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});
