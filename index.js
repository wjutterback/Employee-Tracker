require('dotenv').config();
const inquirer = require('./assets/prompt');
const questions = require('./assets/questions');
const mysql = require('mysql2');
const {
  department,
  addRole,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployee,
  addEmployee,
  viewRoles,
  deleteEmployee,
} = require('./assets/queries');
const C = require('./assets/constructors');
const fs = require('fs');

const connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

//TODO: Move this to queries - last step to remove this to queries, solve writeFileSync problem
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  selectionFunc();
});

async function selectionFunc() {
  //TODO: Stretch goal of refactoring without calling getManager/Employees everytime selectionFunc called, tied in with above problem.
  getManagers();
  getEmployees();
  try {
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
        await addEmployee(employee);
        selectionFunc();
        break;
      case 'View all Employees':
        await viewEmployee();
        selectionFunc();
        break;
      case 'View all Employees By Department':
        await viewEmployee(true);
        selectionFunc();
        break;
      case 'View all Employees By Manager':
        await viewEmployee('', true);
        selectionFunc();
        break;
      case 'Remove Employee':
        let erased = await inquirer(questions.removeEmployee);
        await deleteEmployee(erased);
        selectionFunc();
        break;
      case 'Update Employee Role':
        let updatedRole = await inquirer(questions.updateRole);
        await updateEmployeeRole(updatedRole);
        selectionFunc();
        break;
      case 'Update Employee Manager':
        let updatedManager = await inquirer(questions.updateManager);
        await updateEmployeeManager(updatedManager);
        selectionFunc();
        break;
      case 'View All Roles':
        await viewRoles();
        selectionFunc();
        break;
    }
  } catch (error) {
    console.error(error);
  }
}

function getManagers() {
  connection.query(
    "SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.title = 'Manager'",
    (err, res) => {
      if (err) throw err;
      const managerArr = [];
      res.forEach((manager) => {
        managerArr.push(...Object.values(manager));
      });
      //alternative way to turn multiple arrays into one array (different from queries example)
      fs.writeFileSync('./assets/manager.js', JSON.stringify(managerArr));
    }
  );
}

function getEmployees() {
  connection.query(
    "SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee",
    (err, res) => {
      if (err) throw err;
      const employeeArr = [];
      res.forEach((employee) => {
        employeeArr.push(...Object.values(employee));
      });
      fs.writeFileSync('./assets/employees.js', JSON.stringify(employeeArr));
    }
  );
}
