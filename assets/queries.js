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
      connection.query(
        `SELECT ? FROM department`,
        { name: dept.name },
        (err, res) => {
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
            connection.query(
              'INSERT INTO department SET ?',
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
        }
      );
    }
  });
}

function addRole(role) {
  connection.query(
    'INSERT INTO role SET ?',
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
    connection.query(
      'SELECT * FROM role WHERE ? AND ?',
      [{ title: role.title }, { salary: role.salary }],
      (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res[0].id);
      }
    );
  });
}

function addEmployee(employee) {
  return new Promise(function (resolve, reject) {
    const varArray = employee.manager.split(' ');
    console.log(varArray);
    connection.query(
      'SELECT employee.id FROM employee LEFT JOIN role ON employee.role_id = role.id WHERE role.title = "Manager" AND employee.first_name = ? AND employee.last_name = ?',
      varArray,
      (err, res) => {
        if (err) {
          return reject(err);
        }
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
              reject(err);
            }
            resolve(
              console.log(
                `New employee ${employee.first_name} ${employee.last_name} added`
              )
            );
          }
        );
      }
    );
  });
}

function deleteEmployee(employee) {
  return new Promise(function (resolve, reject) {
    const varArray = employee.remove.split(' ');
    connection.query(
      'DELETE FROM employee WHERE employee.first_name = ? AND employee.last_name = ?',
      varArray,
      (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(console.log(`Removed ${employee.remove} from database`));
      }
    );
  });
}

function updateEmployeeRole(employee) {
  return new Promise(function (resolve, reject) {
    const varArray = employee.name.split(' ');
    connection.query(
      'SELECT employee.role_id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?',
      varArray,
      (err, res) => {
        if (err) {
          return reject(err);
        }
        console.log('');
        console.table(res);
        console.log('');
        const employeeRoleId = [employee.updateRole, res[0].role_id];
        connection.query(
          'UPDATE role SET role.title = ? WHERE role.id = ?',
          employeeRoleId,
          (err, res) => {
            if (err) {
              return reject(err);
            }
            resolve(
              console.log(
                `${employee.name}'s role updated to ${employee.updateRole}`
              )
            );
          }
        );
      }
    );
  });
}

function updateEmployeeManager(employee) {
  return new Promise(function (resolve, reject) {
    const employeeName = employee.name.split(' ');
    const managerName = employee.updateManager.split(' ');
    connection.query(
      'SELECT employee.id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?',
      employeeName,
      (err, res) => {
        if (err) {
          return reject(err);
        }
        const employeeId = res[0].id;
        connection.query(
          'SELECT employee.id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?',
          managerName,
          (err, res) => {
            if (err) throw err;
            const managerId = res[0].id;
            const updateArr = [managerId, employeeId];
            connection.query(
              'UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?',
              updateArr,
              (err, res) => {
                if (err) {
                  return reject(err);
                }
                resolve(
                  console.log(
                    `${employee.name}'s manager updated to ${employee.updateManager}`
                  )
                );
              }
            );
          }
        );
      }
    );
  });
}

function viewEmployee(byDepartment, byManager) {
  return new Promise(function (resolve, reject) {
    if (byDepartment === true) {
      connection.query(
        "SELECT CONCAT(employee.first_name, ' ', employee.last_name) as 'Employee Name', department.name AS 'Department' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;",
        (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(console.table(res));
        }
      );
    } else if (byManager === true) {
      connection.query(
        "SELECT CONCAT(employee1.first_name, ' ', employee1.last_name) as 'Employee Name', employee.first_name AS Manager FROM employee as employee1 INNER JOIN employee ON employee1.manager_id = employee.id;",
        (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(console.table(res));
        }
      );
    } else {
      connection.query('SELECT * FROM employee', (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(console.table(res));
      });
    }
  });
}

function viewRoles() {
  return new Promise(function (resolve, reject) {
    //Write code to query server and get just one instance of each role (since salaries create new role for every new salary);
    const roleChoices = [
      'Salesperson',
      'Engineer',
      'Manager',
      'Developer',
      'Intern',
    ];
    resolve(console.table(roleChoices));
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
};

// From DB Tables (to reference)
// CREATE TABLE department(
//   id INT AUTO_INCREMENT,
//   name VARCHAR(30),
//   PRIMARY KEY(id)
//   );

//   CREATE TABLE role(
//   id INT AUTO_INCREMENT,
//   title VARCHAR(30),
//   salary DECIMAL,
//   department_id INT,
//   PRIMARY KEY(id),
//   FOREIGN KEY(department_id) REFERENCES department(id)
//   );

//   CREATE TABLE employee(
//   id INT AUTO_INCREMENT,
//   first_name VARCHAR(30),
//   last_name VARCHAR(30),
//   role_id INT,
//   manager_id INT,
//   PRIMARY KEY(id),
//   FOREIGN KEY(role_id) REFERENCES role(id),
//   FOREIGN KEY(manager_id) REFERENCES employee(id)
//   );

//Tish's example of consolidating UPDATE/SELECT query
//Needs to be retooled:
//UPDATE employee SET (employees.manager_id = ?)
//WHERE employee.id IN (SELECT e.manager_id FROM employees e WHERE e.id IN (?, ?))

// 1 variable in where clause
// ?UDPATE employees SET (employees.first_name = ?, employees.last_name = ?)
// WHERE employees.id = (SELECT e.manager_id FROM employees e WHERE e.id = ?)

//Figure out why this query results in unknown column in where clause, certainly a sytnax error
// function updateEmployeeManager(employee) {
//   varArray1 = employee.name.split(' ');
//   varArray2 = employee.updateManager.split(' ');
//   concatArray = varArray1.concat(varArray2);
//   concatArray.splice(1, 0, concatArray[2]);
//   concatArray.splice(3, 1);
//   connection.query(
//     "SELECT employee.id, role.title FROM employee LEFT JOIN role ON (employee.role_id = role.id) WHERE (employee.first_name IN (?,?) AND employee.last_name IN (?,?)) ORDER BY title='Manager' DESC;",
//     concatArray,
//     (err, res) => {
//       if (err) throw err;
//       console.log(res);
//       const employeeIds = [res[0].id, res[1].id];
//       connection.query(
//         'UPDATE employee SET employee.manager_id = ? WHERE role.id = ?',
//         employeeIds,
//         (err, res) => {
//           if (err) throw err;
//           console.log('');
//           console.table(res);
//           console.log('');
//           selectionFunc();
//         }
//       );
//     }
//   );
// }
