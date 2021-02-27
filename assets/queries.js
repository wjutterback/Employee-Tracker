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
            valueArray.push(Object.values(i));
          });
          //https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
          const merged = [].concat.apply([], valueArray);
          if (merged.indexOf(1) !== -1) {
            console.log(`${dept.name} department found in database`);
            resolve(merged.indexOf(1) + 1);
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

function updateEmployeeRole(employee) {
  const varArray = employee.name.split(' ');
  connection.query(
    'SELECT employee.role_id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?',
    varArray,
    (err, res) => {
      if (err) throw err;
      console.log('');
      console.table(res);
      console.log('');
      const employeeRoleId = [employee.updateRole, res[0].role_id];
      connection.query(
        'UPDATE role SET role.title = ? WHERE role.id = ?',
        employeeRoleId,
        (err, res) => {
          if (err) throw err;
          console.log(
            `${employee.name}'s role updated to ${employee.updateRole}`
          );
        }
      );
    }
  );
}

function updateEmployeeManager(employee) {
  varArray1 = employee.name.split(' ');
  varArray2 = employee.updateManager.split(' ');
  connection.query(
    'SELECT employee.id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?',
    varArray1,
    (err, res) => {
      if (err) throw err;
      console.log(res);
      const employeeId = res[0].id;
      connection.query(
        'SELECT employee.id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?',
        varArray2,
        (err, res) => {
          if (err) throw err;
          const managerId = res[0].id;
          const updateArr = [managerId, employeeId];
          connection.query(
            'UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?',
            updateArr,
            (err, res) => {
              if (err) throw err;
              console.log(
                `${employee.name}'s manager updated to ${employee.updateManager}`
              );
            }
          );
        }
      );
    }
  );
}

module.exports = {
  department: department,
  addRole: addRole,
  updateEmployeeRole: updateEmployeeRole,
  updateEmployeeManager: updateEmployeeManager,
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
