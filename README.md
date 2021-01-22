# Tasker
[![Netlify Status](https://api.netlify.com/api/v1/badges/2f1b2e55-540e-4f88-96d4-987c157d3dc8/deploy-status)](https://app.netlify.com/sites/tasker14/deploys)  

Tasker is a smart tasks list application that allows you to organize and add your daily tasks including other features.  

![Screenshot](preview.png)

## Demo and How to Interact  

![tasker-your-tasks-organizer-goog](https://user-images.githubusercontent.com/69651552/105536262-ba2ba780-5cf8-11eb-8e26-069b2955c02f.gif)

## Getting Started

You can try the Game APP from [here](https://tasker14.netlify.app/)

### Prerequisites

Just Modern Browser like "Chrome" and a Code Editor for Deployment and Develop.

## Versions

* [v1](https://github.com/Mohamed-Elhawary/tasker/tree/v1)  

* [v1.1](https://github.com/Mohamed-Elhawary/tasker/tree/v1.1)  

  - Depending on local storage to save the user tasks in case of reloading or close the App.
```
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
```  

 - Adding date and time for each created task.  

```  
const list      = document.querySelector('.todos');
let tasks       = [];
let tasksDates  = [];

// add tasks
addForm.addEventListener('submit', e => {
  e.preventDefault();
  const date = new Date().toString().slice(0, -45);
  if(taskValue.length){
    tasksDates.push(date);
    saveDataInStorage();
    generateTemplate();
  }
});

//create and inject tasks into the UI
const generateTemplate = () => {
  for (let i in tasks, tasksDates) {
    task  = tasks[i];
    date  = tasksDates[i];
    html += `<div class="date text-muted" style="font-size: 12px">${date}</div>`
  }
  list.innerHTML = html;
}
```  

* [v2.0](https://github.com/Mohamed-Elhawary/tasker/tree/v2.0) 

- Edit any Task and see the last editing date for this edited task.
```
let editedTasks = [];

//create and inject tasks into the UI
const generateTemplate = () => {
  let html = "";
  for (let i in tasks, tasksDates) {
    let task  = tasks[i];
    let date  = tasksDates[i];
    html +=
    `<li class="list-group-item align-items-center" data-index="${i}">
      <div class="d-flex justify-content-between">
        <span class="task-name">${task}</span>
        <input class="edit-task-name" type="text"/>
        <span class="options">
          <i class="far fa-edit edit mr-2"></i>
          <i class="far fa-trash-alt delete"></i>
        </span>
      </div>
      <div class="date text-muted" style="font-size: 12px"><span class="date-text">${date}</span><span class="ml-2 if-edit-task"><span class="edit-text"></span><span class="edit-date bg-light rounded"></span></span></div>
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

// edit tasks
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
        triggerEdit(target, taskName, editTaskName);  
      } else {
        editTaskName.focus();
      }
    }
  }
});

// when clickig enter or esc keys on the edit task name field 
list.addEventListener("keydown", function(event) {
  if(event.target.classList.contains("edit-task-name")) {
    let target   = event.target;
        editSign = target.nextElementSibling.querySelector(".edit"),
        taskName = target.previousElementSibling;
    if(event.keyCode == 13 && event.target.value.length > 0) {
      triggerEdit(editSign, taskName, target)
    } else if(event.keyCode == 27) {
      editSign.classList.toggle("fa-check-circle");
      editSign.classList.toggle("fa-edit");
      taskName.style.display = "initial";
      target.style.display = "none";
    }
  }
});

// trigger edit function
function triggerEdit(target, taskName, editTaskName) {
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

//save data in local storage
function saveDataInStorage() {
  let editedTasksString = JSON.stringify(editedTasks);
  localStorage.setItem("edited-tasks", editedTasksString);
}

//get tasks from local storage
function getDataFromStorage() {
  let editedTasksString = localStorage.getItem("edited-tasks");  
  editedTasks  = JSON.parse(editedTasksString);
  if(!editedTasks) { //if there is not any editedTasks stored in the local storage
    editedTasks = [];
  }
}
```  

 - Sort the tasks list with your prefer sort by dragging the tasks.  

```  
// trigger the sortable library
new Sortable(sortablelist, {
  animation: 110,
  ghostClass: 'sortable-ghost',
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
```  

## Features

* Depneding on local storage to save the tasks from lost.

* Adding the date and time for each created task.

![image](https://user-images.githubusercontent.com/69651552/105534679-85b6ec00-5cf6-11eb-99f4-98ba348df2d6.png)

* Search for specific task by enter the task name in the search input field.  

![image](https://user-images.githubusercontent.com/69651552/105533727-358b5a00-5cf5-11eb-8696-b25428b57174.png)
![image](https://user-images.githubusercontent.com/69651552/105533683-24424d80-5cf5-11eb-863e-5f9e82417cd8.png)

* Delete any task in the list. 

![image](https://user-images.githubusercontent.com/69651552/105533910-6cfa0680-5cf5-11eb-973d-5849e1e5a0d5.png)
![image](https://user-images.githubusercontent.com/69651552/105533951-7a16f580-5cf5-11eb-87a9-ee6cc53a84ab.png)

* Edit any Task and see the last editing date for this edited task. 

![image](https://user-images.githubusercontent.com/69651552/105533537-f0672800-5cf4-11eb-956b-56fb4606cb71.png)
![image](https://user-images.githubusercontent.com/69651552/105533617-0d036000-5cf5-11eb-840b-c193df3a11ae.png)

* Sort the tasks list with your prefer sort by dragging the tasks.

![image](https://user-images.githubusercontent.com/69651552/105533128-66b75a80-5cf4-11eb-8ea5-82676519cee0.png)
![image](https://user-images.githubusercontent.com/69651552/105533218-7a62c100-5cf4-11eb-8828-6e317428cabe.png)
![image](https://user-images.githubusercontent.com/69651552/105533265-8d759100-5cf4-11eb-881f-a3e1b79cade7.png)


## Built With

* HTML5
* CSS3
* ES6 Modern JS Syntax 

## Libraries 

* [Sortable.js](https://github.com/SortableJS/Sortable)

## Frameworks

* [Bootstrap 4](https://getbootstrap.com/)

## Author

* [Mohamed Elhawary](https://www.linkedin.com/in/mohamed-elhawary14/)

## Contact Me  

* Email: mohamed.k.elhawary@gmail.com
* [LinkedIn](https://www.linkedin.com/in/mohamed-elhawary14/)
* [Github](https://github.com/Mohamed-Elhawary)  
* [Behance](https://www.behance.net/mohamed-elhawary14)
* [Codepen](https://codepen.io/Mohamed-ElHawary) 

## Deploy with Me

Feel Free to Deploy it with me, send Issues or a Pull Request and i'll deal with you, just test it First.

## License

Licensed under the [MIT License](LICENSE)