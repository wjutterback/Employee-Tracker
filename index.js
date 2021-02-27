require('dotenv').config();
const inquirer = require('./assets/prompt');
const questions = require('./assets/questions');
const mysql = require('mysql2');
const {
  department,
  addRole,
  updateEmployeeRole,
  updateEmployeeManager,
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

//TODO: Move this to queries
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  selectionFunc();
});

async function selectionFunc() {
  //TODO: Stretch goal of refactoring without calling getManager/Employees everytime selectionFunc called
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
      case 'Remove Employee':
        let erased = await inquirer(questions.removeEmployee);
        deleteEmployee(erased);
        break;
      //TODO: Update Employee Role, at queries now
      case 'Update Employee Role':
        let updatedRole = await inquirer(questions.updateRole);
        updateEmployeeRole(updatedRole);
        break;
      //TODO: Update Employee Manager, at queries now
      case 'Update Employee Manager':
        let updatedManager = await inquirer(questions.updateManager);
        updateEmployeeManager(updatedManager);
        break;
      case 'View All Roles':
        viewRoles();
        break;
    }
  } catch (error) {
    console.error(error);
  }
}

function getManagers() {
  connection.query(
    'SELECT employee.first_name FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.title = "Manager"',
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

function getEmployees() {
  connection.query(
    "SELECT CONCAT(employee.first_name, ' ', employee.last_name) FROM employee",
    (err, res) => {
      if (err) throw err;
      const employeeArr = [];
      res.forEach((employee) => {
        employeeArr.push(Object.values(employee));
      });
      //alternative way to turn multiple arrays into one array (different from queries example)
      const writeArray = [].concat(...employeeArr);
      fs.writeFileSync('./assets/employees.js', JSON.stringify(writeArray));
    }
  );
}

function addEmployee(employee) {
  const varArray = [employee.manager];
  connection.query(
    'SELECT employee.id FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.title = "Manager" AND employee.first_name = ?',
    varArray,
    (err, res) => {
      if (err) throw err;
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
          console.log(
            `New employee ${employee.first_name} ${employee.last_name} added`
          );
          selectionFunc();
        }
      );
    }
  );
}

//Functions but menu option does NOT refresh, so you still can "delete" someone, mysql queries show it is gone but due to readFileSync persistence (guessing) it isn't updated until node restarts - tried lots of time-intensive fixes. will be a stretch goal to update list dynamically
function deleteEmployee(employee) {
  console.log(employee);
  const varArray = employee.remove.split(' ');
  connection.query(
    'DELETE FROM employee WHERE employee.first_name = ? and employee.last_name = ?',
    varArray,
    (err, res) => {
      if (err) throw err;
      console.log(`Removed ${employee.remove} from database`);
      selectionFunc();
    }
  );
}

function viewEmployee(byDepartment, byManager) {
  if (byDepartment === true) {
    connection.query(
      "SELECT CONCAT(employee.first_name, ' ', employee.last_name) as 'Employee Name', department.name AS 'Department' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;",
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
      "SELECT CONCAT(employee1.first_name, ' ', employee1.last_name) as 'Employee Name', employee.first_name AS Manager FROM employee as employee1 INNER JOIN employee ON employee1.manager_id = employee.id;",
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

function viewRoles() {
  const roleChoices = [
    'Salesperson',
    'Engineer',
    'Manager',
    'Developer',
    'Intern',
  ];
  console.table(roleChoices);
  selectionFunc();
}
