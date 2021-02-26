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
    type: 'input',
    message: 'What role will the employee assume?',
  },
  {
    name: 'manager',
    type: 'input',
    message: "Who is the employee's manager?",
  },
];

const questions = [{}];

exports.employeeAction = employeeAction;
exports.addEmployee = addEmployee;
