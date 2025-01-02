// Retrieve tasks and nextId from localStorage
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  const id = nextId;
  nextId++;
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const card = $('<div>').addClass('task-card').attr('data-task-id', task.id);
  const title = $('<h3>').text(task.title);
  const description = $('<p>').text(task.description);
  const dueDate = $('<p>').text(`Due: ${task.dueDate}`);
  const deleteButton = $('<button>').text('Delete').on('click', handleDeleteTask);

  card.append(title, description, dueDate, deleteButton);
  return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
   const lanes = ['to-do', 'in-progress', 'done'];
    lanes.forEach(lane => {
        $(`#${lane}-cards`).empty();
        const laneTasks = taskList.filter(task => task.status === lane);
        laneTasks.forEach(task => {
            const card = createTaskCard(task);
            $(`#${lane}-cards`).append(card);
        });
    });

    $('.task-card').draggable({
        revert: 'invalid',
        cursor: 'move',
        zIndex: 1000
    }); 
  }

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});