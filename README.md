# Tasker
[![Netlify Status](https://api.netlify.com/api/v1/badges/2f1b2e55-540e-4f88-96d4-987c157d3dc8/deploy-status)](https://app.netlify.com/sites/tasker14/deploys)  

Tasker is a smart tasks list application that allows you to organize and add your daily tasks including other features.  

![Screenshot](preview.png)

## Demo and How to Interact  

![tasker-your-tasks-organizer-goog](https://user-images.githubusercontent.com/69651552/93817787-bc51fc80-fc59-11ea-8f1a-af03a42d961e.gif)

## Getting Started

You can try the Game APP from [here](https://mohamed-elhawary.github.io/tasker/)

### Prerequisites

Just Modern Browser like "Chrome" and a Code Editor for Deployment and Develop.

## Versions

* [v1](https://github.com/Mohamed-Elhawary/tasker/tree/v1)  

* [v1.1](https://github.com/Mohamed-Elhawary/tasker/tree/v1.1)  
  - Used Local Storage Feature to save the User Tasks in case of Reloading or Close the App.
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

 - Include Date and Time for Each Created Task Showing Beside Each Task.  

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

## Features  

* Ability to Search for Specific Task by Enter the Task Name in the Search Input Field.  

![Tasker-Your-Tasks-Organizer](https://user-images.githubusercontent.com/69651552/93818495-ba3c6d80-fc5a-11ea-99c6-daef04b19db9.png)

## Built With

* HTML5
* CSS3
* ES6 Modern JS Syntax 

## Frameworks

* Bootstrap

## Author

* Mohamed Elhawary  

## Contact Me  

* Email: mohamed.k.elhawary@gmail.com

## Deploy with Me

Feel Free to Deploy it with me, send Issues or a Pull Request and i'll deal with you, just test it First.

## License

Licensed under the [MIT License](LICENSE)


