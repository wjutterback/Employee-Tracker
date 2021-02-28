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
  'Remove Department',
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

function getQuestions(questions) {
  return new Promise(function (resolve, reject) {
    if (questions === 'deleteDept') {
      connection.query(
        'SELECT department.name, department.id FROM department',
        (err, res) => {
          if (err) throw err;
          const deptChoices = [];
          res.forEach((dept) => {
            let obj = {};
            Object.assign(obj, {
              name: `${dept.name}`,
            });
            Object.assign(obj, { value: `${dept.id}` });
            deptChoices.push(...[obj]);
          });
          const deleteDeptQuestion = [
            {
              name: 'dept',
              message: 'Which department would you like to remove?',
              type: 'list',
              choices: deptChoices,
            },
          ];
          resolve(deleteDeptQuestion);
        }
      );
    } else {
      connection.query(
        'SELECT employee.first_name, employee.last_name, employee.id FROM employee',
        (err, res) => {
          if (err) throw err;
          const employeeChoices = [];
          res.forEach((employee) => {
            let obj = {};
            Object.assign(obj, {
              name: `${employee.first_name} ${employee.last_name}`,
            });
            Object.assign(obj, { value: `${employee.id}` });
            employeeChoices.push(...[obj]);
          });
          connection.query(
            "SELECT employee.first_name, employee.last_name, employee.id FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.title = 'Manager'",
            (err, res) => {
              const managerChoices = [{ name: 'None', value: null }];
              res.forEach((manager) => {
                let obj = {};
                Object.assign(obj, {
                  name: `${manager.first_name} ${manager.last_name}`,
                });
                Object.assign(obj, { value: `${manager.id}` });
                managerChoices.push(...[obj]);
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
    }
  });
}

module.exports = {
  employeeAction: employeeAction,
  getQuestions: getQuestions,
};
