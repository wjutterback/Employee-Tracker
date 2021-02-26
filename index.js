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
  selection();
});

const selection = async () => {
  let { selection } = await inquirer(questions.employeeAction);
  console.log(selection);
  switch (selection) {
    case 'Exit':
      console.log('Quitting selection');
      break;
    case 'Add Employee':
      let addEmployee = await inquirer(questions.addEmployee);
      console.log(addEmployee);
      const dept = new C.Department(addEmployee.department);
      let deptId = await department(dept);
      console.log('deptId', deptId);
      const role = new C.Role(addEmployee.role, addEmployee.salary, deptId);
      console.log('role', role);
      addRole(role);
      // const employee = C.Employee(
      //   addEmployee.fname,
      //   addEmployee.lname,
      //   role,
      //   manager
      // );
      break;
  }

  connection.end();
};
