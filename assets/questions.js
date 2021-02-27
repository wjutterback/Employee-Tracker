const fs = require('fs');
const managers = JSON.parse(fs.readFileSync('./assets/manager.js'));
const employees = JSON.parse(fs.readFileSync('./assets/employees.js'));
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

//PSEUDOCODE: mysql query for all employees, iterate through the list, push to array, save as manager/employee choices, rather than using writefile/readfilesync
//since those options lead to a failure in dynamically updating employees once one has been removed etc.

// async function init(callback) {
//   connection.query(
//     "SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee",
//     (err, res) => {
//       if (err) throw err;
//       const employeeArr = [];
//       res.forEach((employee) => {
//         employeeArr.push(Object.values(employee));
//       });
//       //alternative way to turn multiple arrays into one array (different from queries example)
//       const writeArray = [].concat(...employeeArr);
//         callback(writeArray);
//     }
//   );
// }
// console.log(writeArray)
// init((writeArray) => {
// fs.writeFileSync(fileName, writeArray);
// });

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

const updateRole = [
  {
    name: 'name',
    type: 'list',
    message: 'Which employee would you like to update?',
    choices: employeeChoices,
  },
  {
    name: 'updateRole',
    type: 'list',
    message: 'Which new role will the employee now assume?',
    choices: roleChoices,
  },
];

const updateManager = [
  {
    name: 'name',
    type: 'list',
    message: 'Which employee would you like to update?',
    choices: employeeChoices,
  },
  {
    name: 'updateManager',
    type: 'list',
    message: 'Whos is their new manager?',
    choices: managerChoices,
  },
];

exports.employeeAction = employeeAction;
exports.addEmployee = addEmployee;
exports.removeEmployee = removeEmployee;
exports.updateRole = updateRole;
exports.updateManager = updateManager;
