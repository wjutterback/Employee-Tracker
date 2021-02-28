require('dotenv').config();
const inquirer = require('./assets/prompt');
const { getQuestions, employeeAction } = require('./assets/questions');
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
  viewBudget,
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
    let { selection } = await inquirer(employeeAction);
    switch (selection) {
      case 'Exit':
        connection.end();
        console.log('Goodbye');
        process.exit();
      case 'Add Employee':
        let employeeQuestions = await getQuestions('addEmployeeQuestions');
        let employeeData = await inquirer(employeeQuestions);
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
        let removeQuestion = await getQuestions('removeEmployee');
        let erased = await inquirer(removeQuestion);
        await deleteEmployee(erased);
        selectionFunc();
        break;
      case 'Update Employee Role':
        let updateQuestion = await getQuestions('updateRole');
        let updatedRole = await inquirer(updateQuestion);
        await updateEmployeeRole(updatedRole);
        selectionFunc();
        break;
      case 'Update Employee Manager':
        let managerQuestion = await getQuestions('updateManager');
        let updatedManager = await inquirer(managerQuestion);
        await updateEmployeeManager(updatedManager);
        selectionFunc();
        break;
      case 'View All Roles':
        await viewRoles();
        selectionFunc();
        break;
      case 'View Department Budget':
        await viewBudget();
        selectionFunc();
        break;
    }
  } catch (error) {
    console.error(error);
  }
}
