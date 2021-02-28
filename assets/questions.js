const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

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

function getQuestions(questions) {
  return new Promise(function (resolve, reject) {
    connection.query(
      "SELECT CONCAT(employee.first_name, ' ', employee.last_name, ' -- Employee ID: ', employee.id) FROM employee",
      (err, res) => {
        if (err) throw err;
        const employeeChoices = [];
        res.forEach((employee) => {
          employeeChoices.push(...Object.values(employee));
        });
        connection.query(
          "SELECT CONCAT(employee.first_name, ' ', employee.last_name, ' -- Employee ID: ', employee.id) FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.title = 'Manager'",
          (err, res) => {
            const managerChoices = ['None'];
            res.forEach((manager) => {
              managerChoices.push(...Object.values(manager));
            });

            const roleChoices = [
              'Salesperson',
              'Engineer',
              'Manager',
              'Developer',
              'Intern',
            ];

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

            if (questions === 'removeEmployee') {
              resolve(removeEmployee);
            } else if (questions === 'updateRole') {
              resolve(updateRole);
            } else if (questions === 'addEmployeeQuestions') {
              resolve(addEmployeeQuestions);
            } else if (questions === 'updateManager') {
              resolve(updateManager);
            }
          }
        );
      }
    );
  });
}

module.exports = {
  employeeAction: employeeAction,
  getQuestions: getQuestions,
};
