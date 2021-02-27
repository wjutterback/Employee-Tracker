const fs = require('fs');
const managers = JSON.parse(fs.readFileSync('./assets/manager.js'));
const employees = JSON.parse(fs.readFileSync('./assets/employees.js'));

const selectionChoices = [
  'View all Employees',
  'View all Employees By Department',
  'View all Employees By Manager',
  'Add Employee',
  'Remove Employee',
  'Update Employee Role',
  'Update Employee Manager',
  'View All Roles',
  'Exit',
];

const roleChoices = [
  'Salesperson',
  'Engineer',
  'Manager',
  'Developer',
  'Intern',
];
//TODO: Managers functions properly but as of yet can only display first name (full name will require pushing into an array, splitting on the space between first/last name to gain the first name for query, potentially)
const managerChoices = managers;
const employeeChoices = employees;
const employeeAction = [
  {
    name: 'selection',
    type: 'list',
    message: 'What would you like to do?',
    choices: selectionChoices,
  },
];

const addEmployee = [
  {
    name: 'fname',
    type: 'input',
    message: "What is the employee's first name?",
  },
  {
    name: 'lname',
    type: 'input',
    message: "What is the employee's last name?",
  },
  {
    name: 'department',
    type: 'input',
    message: "What is the employee's department?",
  },
  {
    name: 'role',
    type: 'list',
    message: 'What role will the employee assume?',
    choices: roleChoices,
  },
  {
    name: 'salary',
    type: 'input',
    message: "What is the employee's salary?",
  },
  {
    name: 'manager',
    type: 'list',
    message: "Who is the employee's manager?",
    choices: managerChoices,
  },
];

const removeEmployee = [
  {
    name: 'remove',
    type: 'list',
    message: 'Which employee would you like to remove?',
    choices: employeeChoices,
  },
];

exports.employeeAction = employeeAction;
exports.addEmployee = addEmployee;
exports.removeEmployee = removeEmployee;
