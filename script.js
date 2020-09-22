const addForm   = document.querySelector('.add');
const search    = document.querySelector('.search input');
const list      = document.querySelector('.todos');
let tasks       = [];
let tasksDates  = [];

addForm.add.focus();

//create and inject tasks into the UI
const generateTemplate = () => {
  let html = "";
  for (let i in tasks, tasksDates) {
    task  = tasks[i];
    date  = tasksDates[i];
    html +=
    `<li class="list-group-item align-items-center" data-index="${i}">
      <div class="d-flex justify-content-between">
        <span>${task}</span>
        <i class="far fa-trash-alt delete"></i>
      </div>
      <div class="date text-muted" style="font-size: 12px">${date}</div>
    </li>
    `;
    //console.log(tasks);
    //console.log(tasksDates)
  }

  list.innerHTML = html;
};

// add tasks
addForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskValue = addForm.add.value.trim();
  const date      = new Date().toString().slice(0, -45);
  if(taskValue.length){
    tasks.push(taskValue);
    tasksDates.push(date);
    //console.log(tasks);
    //console.log(tasksDates)
    saveDataInStorage();
    generateTemplate();
    addForm.reset();
  }

});

// delete tasks
list.addEventListener('click', e => {
  if(e.target.classList.contains('delete')){
    e.target.parentElement.parentElement.remove();
    tasks.splice(e.target.parentElement.parentElement.getAttribute("data-index"), 1);
    tasksDates.splice(e.target.parentElement.parentElement.getAttribute("data-index"), 1);
    //console.log(tasks);
    //console.log(tasksDates);
    saveDataInStorage();
    addForm.add.focus();
  }

});

//filter tasks mechanism
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

//prevent enter key default while searching
search.addEventListener('keypress', e => {
  let key = e.keyCode;
  if (key == 13) {
    e.preventDefault();
  }  

});

//save data in local storage
function saveDataInStorage() {
  let tasksString  = JSON.stringify(tasks);
  let datesString  = JSON.stringify(tasksDates);
  localStorage.setItem("tasks", tasksString);
  localStorage.setItem("tasks-dates", datesString);
}

//get tasks from local storage
function getDataFromStorage() {
  let tasksString = localStorage.getItem("tasks");
  let datesString = localStorage.getItem("tasks-dates");  
  tasks        = JSON.parse(tasksString);
  tasksDates   = JSON.parse(datesString);
  if(!tasks) { //if there is not any tasks stored in the local storage
    tasks = [];
  }
  if(!tasksDates) { //if there is not any tasksDates stored in the local storage
    tasksDates = [];
  }
}

//initial functions when reloading page
getDataFromStorage();
generateTemplate();