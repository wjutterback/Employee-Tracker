const selectionChoices = [
  'View all Employees',
  'View all Employees By Department',
  'View all Employees By Manager',
  'Add Employee',
  'Remove Employee',
  'Update Employee Role',
  'Update Employee Manager',
  'View All Roles',
];
const employeeAction = [
  {
    name: 'selection',
    type: 'list',
    message: 'What would you like to do?',
    choices: selectionChoices,
  },
];
const questions = [{}];

exports.employeeAction = employeeAction;
