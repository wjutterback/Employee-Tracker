const { getManagers, getEmployees, getRole, getDept } = require('./queries');

const selectionChoices = [
  'View all Employees',
  'View all Employees By Department',
  'View all Employees By Manager',
  'Add Employee',
  'Remove Employee',
  'Remove Department',
  'Remove Role',
  'Update Employee Role',
  'Update Employee Manager',
  'View All Roles',
  'View Department Budget',
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

//TODO: Final stretch goal - Update Department

const addEmployeeQuestions = [
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
    name: 'salary',
    type: 'input',
    message: "What is the employee's salary?",
  },
  {
    name: 'manager',
    type: 'list',
    message: "Who is the employee's manager?",
    choices: getManagers,
  },
];

const updateManager = [
  {
    name: 'name',
    type: 'list',
    message: 'Which employee would you like to update?',
    choices: getEmployees,
  },
  {
    name: 'updateManager',
    type: 'list',
    message: 'Whos is their new manager?',
    choices: getManagers,
  },
];

const updateRole = [
  {
    name: 'name',
    type: 'list',
    message: 'Which employee would you like to update?',
    choices: getEmployees,
  },
  {
    name: 'updateRole',
    type: 'input',
    message: 'Which new role will the employee now assume?',
  },
];

const removeEmployee = [
  {
    name: 'remove',
    type: 'list',
    message: 'Which employee would you like to remove?',
    choices: getEmployees,
  },
];

const deleteRole = [
  {
    name: 'role',
    message: 'Which role would you like to remove?',
    type: 'list',
    choices: getRole,
  },
];

const deleteDeptQuestion = [
  {
    name: 'dept',
    message: 'Which department would you like to remove?',
    type: 'list',
    choices: getDept,
  },
];

module.exports = {
  addEmployeeQuestions: addEmployeeQuestions,
  employeeAction: employeeAction,
  updateManager: updateManager,
  updateRole: updateRole,
  removeEmployee: removeEmployee,
  deleteRoleQ: deleteRole,
  deleteDeptQuestion: deleteDeptQuestion,
};
