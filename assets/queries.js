const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

//Checks MySQL Database for Department, if not found, it creates department and finally returns department ID.
function department(dept) {
  return new Promise(function (resolve, reject) {
    loop();
    function loop() {
      const selectDept = 'SELECT ? FROM department';
      connection.query(selectDept, { name: dept.name }, (err, res) => {
        if (err) {
          return reject(err);
        }
        const valueArray = [];
        res.forEach((i) => {
          valueArray.push(...Object.values(i));
        });
        if (valueArray.indexOf(1) !== -1) {
          console.log(`${dept.name} department found in database`);
          resolve(valueArray.indexOf(1) + 1);
        } else {
          console.log(
            `${dept.name} department not found in database, creating new department`
          );
          const insertDept = 'INSERT INTO department SET ?';
          connection.query(
            insertDept,
            {
              name: dept.name,
            },
            (err, res) => {
              if (err) {
                return reject(err);
              }
              console.log(`${res.affectedRows} department added`);
              loop();
            }
          );
        }
      });
    }
  });
}

//Adds role to database and returns role.id
function addRole(role) {
  const sql = 'INSERT INTO role SET ?';
  connection.query(
    sql,
    {
      title: role.title,
      salary: role.salary,
      department_id: role.department_id,
    },
    (err, res) => {
      if (err) throw err;
    }
  );
  return new Promise(function (resolve, reject) {
    const sql = 'SELECT * FROM role WHERE ? AND ? AND ?';
    connection.query(
      sql,
      [
        { title: role.title },
        { salary: role.salary },
        { department_id: role.department_id },
      ],
      (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res[0].id);
      }
    );
  });
}

//Adds a new employee to database
function addEmployee(employee) {
  return new Promise(function (resolve, reject) {
    const sql = 'INSERT INTO employee SET ?';
    connection.query(
      sql,
      {
        first_name: employee.first_name,
        last_name: employee.last_name,
        role_id: employee.role_id,
        manager_id: employee.manager,
      },
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(console.log(`New employee added`));
      }
    );
  });
}

//Deletes employee from database
function deleteEmployee(employee) {
  return new Promise(function (resolve, reject) {
    const sql = 'DELETE FROM employee WHERE employee.id = ?';
    connection.query(sql, employee.remove, (err, res) => {
      if (err) {
        return reject(
          'Please remove all employees for this manager before you delete'
        );
      }
      resolve(console.log(`Removed employee from database`));
    });
  });
}

//Updates employee role
function updateEmployeeRole(employee) {
  return new Promise(function (resolve, reject) {
    const employeeRoleId = [employee.updateRole, employee.name];
    const sql = 'UPDATE role SET role.title = ? WHERE role.id = ?';
    connection.query(sql, employeeRoleId, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(console.log(`Employee's role updated!`));
    });
  });
}

//Updates Employee's Manager
function updateEmployeeManager(employee) {
  return new Promise(function (resolve, reject) {
    const updateArr = [employee.updateManager, employee.name];
    const sql =
      'UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?';
    connection.query(sql, updateArr, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(console.log(`Employee's manager updated!`));
    });
  });
}

//View employees in terminal based on input (by Department, by Manager, or all employees)
function viewEmployee(byDepartment, byManager) {
  return new Promise(function (resolve, reject) {
    if (byDepartment === true) {
      const queryDepartment =
        "SELECT CONCAT(employee.first_name, ' ', employee.last_name) as 'Employee Name', department.name AS 'Department' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY Department ASC";
      connection.query(queryDepartment, (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(console.table(res));
      });
    } else if (byManager === true) {
      const queryManager =
        "SELECT CONCAT(employee1.first_name, ' ', employee1.last_name) as 'Employee Name', CONCAT(employee.first_name, ' ', employee.last_name) AS 'Manager' FROM employee as employee1 INNER JOIN employee ON employee1.manager_id = employee.id ORDER BY Manager ASC;";
      connection.query(queryManager, (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(console.table(res));
      });
    } else {
      const queryAll =
        "SELECT CONCAT(employee.first_name, ' ', employee.last_name) as 'Employee Name', department.name AS 'Department', role.title AS 'Title', role.salary AS 'Salary', CONCAT(employee1.first_name, ' ', employee1.last_name) AS 'Manager' FROM employee LEFT JOIN employee AS employee1 ON employee.manager_id = employee1.id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY employee.last_name ASC;";
      connection.query(queryAll, (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(console.table(res));
      });
    }
  });
}

//List of Roles
function viewRoles() {
  return new Promise(function (resolve, reject) {
    const sql = 'SELECT DISTINCT(title) FROM employee_tracker.role;';
    connection.query(sql, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(console.table(res));
    });
  });
}

//View budgets by department
function viewBudget() {
  return new Promise(function (resolve, reject) {
    const sql =
      "SELECT department.name as 'Department', Sum(role.salary) AS Budget FROM department RIGHT JOIN role on role.department_id = department.id GROUP BY department.name;";
    connection.query(sql, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(console.table(res));
    });
  });
}

//Deletes department
function deleteDepartment(remove) {
  return new Promise(function (resolve, reject) {
    const sql = 'DELETE FROM department WHERE department.id = ?';
    connection.query(sql, remove.dept, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(console.log(`Department removed`));
    });
  });
}

function deleteRole(remove) {
  return new Promise(function (resolve, reject) {
    const sql = 'DELETE FROM role WHERE role.id = ?';
    connection.query(sql, remove.role, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(console.log(`Role removed`));
    });
  });
}

module.exports = {
  department: department,
  addRole: addRole,
  updateEmployeeRole: updateEmployeeRole,
  updateEmployeeManager: updateEmployeeManager,
  viewEmployee: viewEmployee,
  addEmployee: addEmployee,
  viewRoles: viewRoles,
  deleteEmployee: deleteEmployee,
  viewBudget: viewBudget,
  deleteDepartment: deleteDepartment,
  deleteRole: deleteRole,
};
