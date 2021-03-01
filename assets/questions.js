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
//TODO: Final stretch goal - Update Department and refactor getQuestions

//Gets question prompts for inquirer based on parameters
function getQuestions(questions) {
  return new Promise(function (resolve, reject) {
    if (questions === 'deleteDept') {
      const selectDept =
        'SELECT department.name, department.id FROM department';
      connection.query(selectDept, (err, res) => {
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
      });
    } else if (questions === 'deleteRole') {
      const selectRole =
        'SELECT DISTINCT(title), role.id  FROM role GROUP BY title;';
      connection.query(selectRole, (err, res) => {
        const roleChoices = [];
        res.forEach((role) => {
          let obj = {};
          Object.assign(obj, {
            name: `${role.title}`,
          });
          Object.assign(obj, { value: `${role.id}` });
          roleChoices.push(...[obj]);
        });
        const deleteRole = [
          {
            name: 'role',
            message: 'Which role would you like to remove?',
            type: 'list',
            choices: roleChoices,
          },
        ];
        resolve(deleteRole);
      });
    } else {
      const selectEmployee =
        'SELECT employee.first_name, employee.last_name, employee.id FROM employee';
      connection.query(selectEmployee, (err, res) => {
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
        const selectManager =
          "SELECT employee.first_name, employee.last_name, employee.id FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.title = 'Manager'";
        connection.query(selectManager, (err, res) => {
          const managerChoices = [{ name: 'None', value: null }];
          res.forEach((manager) => {
            let obj = {};
            Object.assign(obj, {
              name: `${manager.first_name} ${manager.last_name}`,
            });
            Object.assign(obj, { value: `${manager.id}` });
            managerChoices.push(...[obj]);
          });

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
              type: 'input',
              message: 'Which new role will the employee now assume?',
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
        });
      });
    }
  });
}

module.exports = {
  employeeAction: employeeAction,
  getQuestions: getQuestions,
};
