const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fetching all tasks from the file
function getAllTasks() {
  return new Promise((resolve, reject) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
}

function listTasks() {
  getAllTasks().then(tasks => {
    if (tasks.length === 0) {
      console.log('No tasks available');
      mainMenu();
    } else {
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title} - ${task.description} [${task.status}]`);
      });
      mainMenu();
    }
  }).catch(error => {
    console.error('Error reading tasks:', error);
    mainMenu();
  });
}

// Adding a new task
function addTask(title, description) {
  getAllTasks().then(tasks => {
    tasks.push({
      title: title,
      description: description,
      status: 'not completed'
    });
    fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), err => {
      if (err) return console.error('Error writing to file:', err);
      console.log('Task added successfully!');
      mainMenu();
    });
  });
}

// Marking a task as completed
function completeTask(taskTitle) {
  getAllTasks().then(tasks => {
    const task = tasks.find(t => t.title === taskTitle);
    if (task) {
      task.status = task.status === 'completed' ? 'not completed' : 'completed';
      fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), err => {
        if (err) return console.error('Error writing to file:', err);
        console.log('Task marked as ' + task.status + '!');
        mainMenu();
      });
    } else {
      console.log('Task not found.');
      mainMenu();
    }
  }).catch(error => {
    console.error('Error reading tasks:', error);
    mainMenu();
  });
}

function deleteTask(taskTitle) {
  getAllTasks().then(tasks => {
    const taskIndex = tasks.findIndex(t => t.title === taskTitle);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), err => {
        if (err) return console.error('Error writing to file:', err);
        console.log('Task deleted successfully!');
        mainMenu();
      });
    } else {
      console.log('Task not found.');
      mainMenu();
    }
  }).catch(error => {
    console.error('Error deleting task:', error);
    mainMenu();
  });
}

// User interaction
function mainMenu() {
  rl.question('Choose an action:\n(1) List tasks, (2) Add task, (3) Mark task as completed/not completed, (4) Delete Task, (5) Exit: ', choice => {
    switch (choice) {
      case '1':
        listTasks();
        break;
      case '2':
        rl.question('Enter task title: ', title => {
          rl.question('Enter task description: ', description => {
            addTask(title, description);
          });
        });
        break;
      case '3':
        rl.question('Enter the title of the task to mark as completed: ', taskTitle => {
          completeTask(taskTitle);
        });
        break;
      case '4':
        rl.question('Enter the title of the task to delete: ', taskTitle => {
          deleteTask(taskTitle);
        });
        break;
      case '5':
        rl.close();
        break;
      default:
        console.log('Invalid choice.');
        mainMenu();
    }
  });
}

// Start the app
mainMenu();
