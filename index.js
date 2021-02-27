require('dotenv').config();
const inquirer = require('./assets/prompt');
const questions = require('./assets/questions');
const mysql = require('mysql2');
const { department, deleteEmployee, addRole } = require('./assets/queries');
const C = require('./assets/constructors');
const fs = require('fs');

const connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

//TODO: Move this to queries
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  selectionFunc();
});

async function selectionFunc() {
  try {
    //Potentially use fs.writeFileSync to write Manager result from DB query;
    getManagers();
    let { selection } = await inquirer(questions.employeeAction);
    switch (selection) {
      case 'Exit':
        connection.end();
        console.log('Goodbye');
        process.exit();
      case 'Add Employee':
        let employeeData = await inquirer(questions.addEmployee);
        const dept = new C.Department(employeeData.department);
        let deptId = await department(dept);
        const role = new C.Role(employeeData.role, employeeData.salary, deptId);
        let roleId = await addRole(role);
        const employee = new C.Employee(
          employeeData.fname,
          employeeData.lname,
          roleId,
          employeeData.manager
        );
        console.log(employee);
        addEmployee(employee);
        break;
      case 'View all Employees':
        viewEmployee();
        break;
      case 'View all Employees By Department':
        viewEmployee(true);
        break;
      case 'View all Employees By Manager':
        viewEmployee('', true);
        break;
      //TODO: Remove Employee
      case 'Remove Employee':
        let erased = await inquirer(questions.removeEmployee);
        deleteEmployee(erased);
        break;
      case 'Update Employee Role':
        break;
      case 'Update Employee Manager':
        break;
      case 'View All Roles':
        break;
    }
  } catch (error) {
    console.error(error);
  }
}

function getManagers() {
  connection.query(
    `SELECT employee.first_name FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.title = 'Manager'`,
    (err, res) => {
      if (err) throw err;
      const managerArr = [];
      res.forEach((manager) => {
        managerArr.push(Object.values(manager));
      });
      //alternative way to turn multiple arrays into one array (different from queries example)
      const writeArray = [].concat(...managerArr);
      fs.writeFileSync('./assets/manager.js', JSON.stringify(writeArray));
    }
  );
}

function addEmployee(employee) {
  console.log('employee in queries', employee);
  connection.query(
    `SELECT employee.id FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.title = 'Manager' AND employee.first_name = '${employee.manager}'`,
    (err, res) => {
      if (err) throw err;
      console.log(res);
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: employee.first_name,
          last_name: employee.last_name,
          role_id: employee.role_id,
          manager_id: res[0].id,
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }
          console.log(`${res.affectedRows} employee added`);
          selectionFunc();
        }
      );
    }
  );
}

function viewEmployee(byDepartment, byManager) {
  if (byDepartment === true) {
    connection.query(
      `SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', department.name AS 'Department' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id`,
      (err, res) => {
        if (err) throw err;
        console.log('');
        console.table(res);
        console.log('');
        selectionFunc();
      }
    );
  } else if (byManager === true) {
    connection.query(
      `SELECT employee1.first_name AS 'First Name', employee1.last_name AS 'Last Name', employee.first_name AS Manager FROM employee as employee1 INNER JOIN employee ON employee1.manager_id = employee.id;`,
      (err, res) => {
        if (err) throw err;
        console.log('');
        console.table(res);
        console.log('');
        selectionFunc();
      }
    );
  } else {
    connection.query('SELECT * FROM employee', (err, res) => {
      if (err) throw err;
      console.log('');
      console.table(res);
      console.log('');
      selectionFunc();
    });
  }
}
