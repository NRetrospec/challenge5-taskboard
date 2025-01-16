// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.type);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id)
        .on('click', handleDeleteTask);

    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'YYYY-MM-DD');

        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    // Empty existing project cards out of the lanes
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    // Loop through tasks and create task cards for each status
    for (let task of taskList) {
        const taskCard = createTaskCard(task);
        if (task.status === 'to-do') {
            $('#todo-cards').append(taskCard);
        } else if (task.status === 'in-progress') {
            $('#in-progress-cards').append(taskCard);
        } else if (task.status === 'done') {
            $('#done-cards').append(taskCard);
        }
    }

    // Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: 'clone',
        revert: 'invalid',
        start: function (event, ui) {
            ui.helper.data('original-position', ui.helper.position());
        }
    });

    // Make lanes droppable
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const title = $('#title').val().trim();
    const type = $('#type').val();
    const dueDate = $('#dueDate').val();

    const newTask = {
        id: generateTaskId(),
        title: title,
        type: type,
        dueDate: dueDate,
        status: 'to-do'
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));

    renderTaskList();

    $('#formModal').modal('hide');
    $('#taskForm')[0].reset();
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).attr('data-task-id');

    taskList = taskList.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('data-task-id');
    const newStatus = $(this).attr('id').split('-')[0]; // Extract status from the column ID

    for (let task of taskList) {
        if (task.id === parseInt(taskId)) {
            task.status = newStatus;
            break;
        }
    }

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// When the page loads, render the task list, add event listeners, and initialize form elements
$(document).ready(function () {
    renderTaskList();

    $('#taskForm').on('submit', handleAddTask);

    // Initialize date picker
    $('#dueDate').datepicker({
        dateFormat: 'yy-mm-dd'
    });
});