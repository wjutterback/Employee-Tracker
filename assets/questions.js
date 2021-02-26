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

const roleChoices = ['Salesman', 'Engineer', 'Manager', 'Developer', 'Intern'];
//TODO: Manager Choices needs to be the result of a DB query, stopgap for now
const managerChoices = ['Will', 'Davis'];
//TODO: Employee Choices needs to be the result of a DB query, moving on
const employeeChoices = ['variable'];
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

const questions = [{}];

exports.employeeAction = employeeAction;
exports.addEmployee = addEmployee;
exports.removeEmployee = removeEmployee;
