require('dotenv').config();
const inquirer = require('./assets/prompt');
const {
  addEmployeeQuestions,
  employeeAction,
  updateManager,
  updateRole,
  removeEmployee,
  deleteRoleQ,
  deleteDeptQuestion,
} = require('./assets/questions');
const mysql = require('mysql2');
const {
  addDepartment,
  addRole,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployee,
  addEmployee,
  viewRoles,
  deleteEmployee,
  viewBudget,
  deleteDepartment,
  deleteRole,
} = require('./assets/queries');
const { Department, Employee, Role } = require('./assets/constructors');

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
        let employeeData = await inquirer(addEmployeeQuestions);
        const dept = new Department(employeeData.department);
        let deptId = await addDepartment(dept);
        const role = new Role(employeeData.role, employeeData.salary, deptId);
        let roleId = await addRole(role);
        const employee = new Employee(
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
        let erased = await inquirer(removeEmployee);
        await deleteEmployee(erased);
        selectionFunc();
        break;
      case 'Update Employee Role':
        let updatedRole = await inquirer(updateRole);
        await updateEmployeeRole(updatedRole);
        selectionFunc();
        break;
      case 'Update Employee Manager':
        let updatedManager = await inquirer(updateManager);
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
      case 'Remove Department':
        let deleteDept = await inquirer(deleteDeptQuestion);
        await deleteDepartment(deleteDept);
        selectionFunc();
        break;
      case 'Remove Role':
        let deleteRoleAnswer = await inquirer(deleteRoleQ);
        await deleteRole(deleteRoleAnswer);
        selectionFunc();
        break;
    }
  } catch (error) {
    console.error(error);
  }
}
