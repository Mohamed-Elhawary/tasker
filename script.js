const addForm           = document.querySelector('.add');
const search            = document.querySelector('.search input');
const list              = document.querySelector('.todos');
const deleteAllTasksBtn = document.querySelector(".danger-zone .delete-all-tasks-btn");
const deleteAllBox      = document.querySelector(".danger-zone .delete-all-box");
const deleteAllBtn      = deleteAllBox.querySelector(".delete-all-btn");
const cancelBtn         = deleteAllBox.querySelector(".cancel-btn");
let tasks       = [];
let tasksDates  = [];
let editedTasks = [];

addForm.add.focus();

// create and inject tasks into the UI
const generateTemplate = () => {
  let html = "";
  for (let i in tasks, tasksDates) {
    let task  = tasks[i];
    let date  = tasksDates[i];
    html +=
    `<li class="list-group-item align-items-center" data-index="${i}">
      <div class="d-flex justify-content-between task-part">
        <span class="task-name">${task}</span>
        <input class="edit-task-name filter-from-drag" type="text"/>
        <span class="options filter-from-drag">
          <i class="far fa-edit edit mr-2"></i>
          <i class="far fa-trash-alt delete"></i>
        </span>
      </div>
      <div class="date text-muted" style="font-size: 12px"><span class="date-text">${date}</span><span class="ml-2 if-edit-task"><span class="edit-text filter-from-drag"></span><span class="edit-date bg-light rounded"></span></span></div>
    </li>
    `;
    //console.log(tasks);
    //console.log(tasksDates)
  }
  list.innerHTML = html;

  editedTasks.forEach(task => {
    let editedLI = list.querySelector(`li[data-index = '${task.edited_task_id}']`);
    if(editedLI) {
      editedLI.querySelector("span.edit-text").innerHTML = "edited";
      editedLI.querySelector("span.edit-date").innerHTML = task.edited_task_date;
    }
  });
};

// add task
addForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskValue = addForm.add.value.trim();
  const date      = new Date().toString().slice(0, -45);
  if(taskValue.length){
    tasks.push(taskValue);
    tasksDates.push(date);
    //console.log(tasks);
    //console.log(tasksDates);
    generateTemplate();
    saveDataInStorage();
    addForm.reset();
    addForm.add.focus();
  }

});

// when clicking on the delete icon
list.addEventListener('click', e => {
  if(e.target.classList.contains('delete')) {
    let deleteBox        = document.createElement("div"),
        deleteField      = document.createElement("p"),
        deleteFieldText  = document.createTextNode("Are you sure to delete this task ?"),
        deleteBtn        = document.createElement("button"),
        cancelBtn        = document.createElement("button"),
        deleteBtnText    = document.createTextNode("Delete"),
        cancelBtnText    = document.createTextNode("Cancel"),
        deletedTask      = e.target.parentElement.parentElement.parentElement;
    
    deleteBtn.appendChild(deleteBtnText);
    cancelBtn.appendChild(cancelBtnText);
    deleteField.appendChild(deleteFieldText);
    deleteBox.appendChild(deleteField);
    deleteBox.appendChild(cancelBtn);
    deleteBox.appendChild(deleteBtn);

    deleteBox.classList.add("delete-box");
    deleteBox.classList.add("filter-from-drag");
    deleteBtn.classList.add("delete-btn");
    cancelBtn.classList.add("cancel-btn");
    deleteField.classList.add("delete-field");
    deletedTask.appendChild(deleteBox);
    deletedTask.querySelector(".task-part").classList.toggle("d-flex");
    deletedTask.querySelector(".task-part").classList.toggle("justify-content-between");
    deletedTask.querySelector(".task-part").classList.toggle("d-none");
    deletedTask.querySelector(".date").classList.toggle("d-none");
  }
});

// delete task 
list.addEventListener("click", e => {
  if(e.target.classList.contains('delete-btn')) {
    let deletedTask = e.target.parentElement.parentElement,
        deleteBox  = e.target.parentElement;
    
    deleteBox.style.display = 'none';
    tasks.splice(deletedTask.getAttribute("data-index"), 1);
    tasksDates.splice(deletedTask.getAttribute("data-index"), 1);
    editedTasks.forEach((editedTask, i) => {
      if(editedTask.edited_task_id == deletedTask.getAttribute("data-index")) {
        editedTasks.splice(i, 1);
      }
    });

    tasks.forEach((task, y) => {
      editedTasks.forEach(editedTask => {
        if(task == editedTask.edited_task_text) {
          editedTask.edited_task_id = y;
        }
      });
    });
    //console.log(tasks);
    //console.log(tasksDates);
    generateTemplate();
    saveDataInStorage();
  }
});

// when clicking on the cancel btn in the tasks list
list.addEventListener("click", e => {
  if(e.target.classList.contains('cancel-btn')) {
    let deleteBox    = e.target.parentElement,
        canceledTask = e.target.parentElement.parentElement;
    deleteBox.parentElement.removeChild(deleteBox);
    canceledTask.querySelector(".task-part").classList.toggle("d-flex");
    canceledTask.querySelector(".task-part").classList.toggle("justify-content-between");
    canceledTask.querySelector(".task-part").classList.toggle("d-none");
    canceledTask.querySelector(".date").classList.toggle("d-none");
  }
});

// when clicking on the delete all tasks btn
deleteAllTasksBtn.addEventListener("click", function() {
  this.classList.toggle("d-none");
  deleteAllBox.classList.toggle("d-none");
});

// delete all tasks (clear the tasks list)
deleteAllBtn.addEventListener("click", function() {
  tasks = [];
  tasksDates = [];
  editedTasks = [];
  generateTemplate();
  saveDataInStorage();
  addForm.reset();
  addForm.add.focus();
  deleteAllTasksBtn.classList.toggle("d-none");
  deleteAllBox.classList.toggle("d-none"); 
});

// when clicking on the cancel btn in the delete all box
cancelBtn.addEventListener("click", function() {
  deleteAllTasksBtn.classList.toggle("d-none");
  deleteAllBox.classList.toggle("d-none");
});

// when clicking on the edit icon
list.addEventListener('click', e => {
  if(e.target.classList.contains('edit')) {
    let target = e.target;
    let taskName     = target.parentElement.previousElementSibling.previousElementSibling,
        editTaskName = target.parentElement.previousElementSibling;
    if (target.classList.contains("fa-edit")) {
      target.classList.toggle("fa-check-circle");
      target.classList.toggle("fa-edit");
      taskName.style.display = "none";
      editTaskName.style.display = "initial";
      editTaskName.focus();
      editTaskName.value = taskName.innerHTML;
    } else {
      if(editTaskName.value.length > 0) {
        editTask(target, taskName, editTaskName);  
      } else {
        editTaskName.focus();
      }
    }
  }
});

// when clicking enter or esc keys on the edit task name field 
list.addEventListener("keydown", function(event) {
  if(event.target.classList.contains("edit-task-name")) {
    let target   = event.target;
        editSign = target.nextElementSibling.querySelector(".edit"),
        taskName = target.previousElementSibling;
    if(event.keyCode == 13 && event.target.value.length > 0) {
      editTask(editSign, taskName, target)
    } else if(event.keyCode == 27) {
      editSign.classList.toggle("fa-check-circle");
      editSign.classList.toggle("fa-edit");
      taskName.style.display = "initial";
      target.style.display = "none";
    }
  }
});

// edit task 
function editTask(target, taskName, editTaskName) {
  target.classList.toggle("fa-check-circle");
  target.classList.toggle("fa-edit");
  taskName.style.display = "initial";
  editTaskName.style.display = "none";
  if(taskName.innerHTML != editTaskName.value) {
    taskName.innerHTML = editTaskName.value;
    tasks[taskName.parentElement.parentElement.getAttribute("data-index")] = taskName.innerHTML;
    editedTasks.forEach((task, i) => {
      if(task.edited_task_id == taskName.parentElement.parentElement.getAttribute("data-index")) {
        editedTasks.splice(i, 1);
      }
    });
    editedTasks.push({
      edited_task_id: taskName.parentElement.parentElement.getAttribute("data-index"),
      edited_task_date: new Date().toString().slice(0, -45),
      edited_task_text: taskName.innerHTML
    });
    generateTemplate();
    saveDataInStorage();  
    //console.log(editedTasks);
  }
}

// trigger the sortable library
new Sortable(sortablelist, {
  animation: 110,
  ghostClass: 'sortable-ghost',
  filter: '.filter-from-drag',
  onUpdate: function() {
    //console.log(tasks);
    //console.log(tasksDates);
    let newTasksArray      = [],
        newTasksDatesArray = [];
    list.querySelectorAll("li .task-name").forEach(task => {
      newTasksArray.push(task.innerHTML)
    });
    //console.log(newTasksArray);
    tasks = newTasksArray;
    //console.log(tasks);
    list.querySelectorAll("li .date-text").forEach(date => {
      newTasksDatesArray.push(date.innerHTML)
    });
    //console.log(newTasksDatesArray);
    tasksDates = newTasksDatesArray;
    //console.log(tasksDates);
    tasks.forEach((task, i) => {
      editedTasks.forEach(editedTask => {
        if(task == editedTask.edited_task_text) {
          editedTask.edited_task_id = i;
        }
      });
    });
    generateTemplate();
    saveDataInStorage();
  }
});

// filter tasks mechanism
const filterTasks = term => {
  // add filtered class
  Array.from(list.children)
    .filter(task  => !task.textContent.toLowerCase().includes(term))
    .forEach(task => task.classList.add('filtered'));

  // remove filtered class
  Array.from(list.children)
    .filter(task  => task.textContent.toLowerCase().includes(term))
    .forEach(task => task.classList.remove('filtered'));

};

// filter tasks event
search.addEventListener('keyup', () => {
  const term = search.value.trim().toLowerCase();
  filterTasks(term);
});

// prevent enter key default while searching
search.addEventListener('keypress', e => {
  let key = e.keyCode;
  if (key == 13) {
    e.preventDefault();
  }  

});

// save data in local storage
function saveDataInStorage() {
  let tasksString       = JSON.stringify(tasks);
  let datesString       = JSON.stringify(tasksDates);
  let editedTasksString = JSON.stringify(editedTasks);
  localStorage.setItem("tasks", tasksString);
  localStorage.setItem("tasks-dates", datesString);
  localStorage.setItem("edited-tasks", editedTasksString);
}

// get data from local storage
function getDataFromStorage() {
  let tasksString       = localStorage.getItem("tasks");
  let datesString       = localStorage.getItem("tasks-dates");
  let editedTasksString = localStorage.getItem("edited-tasks");  
  tasks        = JSON.parse(tasksString);
  tasksDates   = JSON.parse(datesString);
  editedTasks  = JSON.parse(editedTasksString);
  if(!tasks) { // if there is not any tasks stored in the local storage
    tasks = [];
  }
  if(!tasksDates) { // if there is not any tasksDates stored in the local storage
    tasksDates = [];
  }
  if(!editedTasks) { // if there is not any editedTasks stored in the local storage
    editedTasks = [];
  }
}

// initial functions when reloading page
getDataFromStorage();
generateTemplate();