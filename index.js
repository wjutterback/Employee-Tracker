require('dotenv').config();
const inquirer = require('./assets/prompt');
const questions = require('./assets/questions');
const mysql = require('mysql2');
const {
  department,
  addEmployee,
  viewEmployee,
  addRole,
} = require('./assets/queries');
const C = require('./assets/constructors');

const connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  selectionFunc();
});

async function selectionFunc() {
  try {
    let { selection } = await inquirer(questions.employeeAction);
    switch (selection) {
      case 'Exit':
        console.log('Quitting selection');
        connection.end();
        break;
      case 'Add Employee':
        let employeeData = await inquirer(questions.addEmployee);
        const dept = new C.Department(employeeData.department);
        let deptId = await department(dept, null);
        console.log('deptId', deptId);
        const role = new C.Role(
          employeeData.role,
          employeeData.salary,
          deptId.toString()
        );
        let roleId = await addRole(role);
        const employee = new C.Employee(
          employeeData.fname,
          employeeData.lname,
          roleId.toString(),
          employeeData.manager
        );
        console.log(employee);
        await addEmployee(employee);
        // selection();
        break;
      case 'View all Employees':
        viewEmployee();
        selectionFunc();
        break;
      case 'View all Employees By Department':
        viewEmployee(true);
        selectionFunc();
        break;
      case 'View all Employees By Manager':
        viewEmployee('', true);
        selectionFunc();
    }
  } catch (error) {
    console.error(error);
  }
}
