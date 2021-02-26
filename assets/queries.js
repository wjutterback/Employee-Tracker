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
            console.log(`${dept.name} found in database`);
            resolve(merged.indexOf(1) + 1);
          } else {
            console.log(
              `${dept.name} not found in database, creating new department`
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
      console.log(`New ${role.title} added`);
    }
  );
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT * FROM role WHERE title = '${role.title}' AND salary = '${role.salary}';`,
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
  console.log('employee in queries', employee);
  connection.query(
    //TODO: this query will not be accurate/will not work if more than one manager role exists, needs a better query
    `SELECT * FROM employee WHERE employee.first_name = '${employee.manager}' AND employee.role_id = '1'`,
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
        }
      );
    }
  );
}

function viewEmployee(department, manager) {
  if (department === true) {
    connection.query(
      'SELECT employee.first_name, employee.last_name, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id',
      (err, res) => {
        if (err) throw err;
        console.log('');
        console.table(res);
      }
    );
  }else if (manager === true){
    connection.query(
      `SELECT employee1.first_name AS 'First Name', employee1.last_name AS 'Last Name', employee.first_name AS Manager FROM employee as employee1 INNER JOIN employee ON employee1.manager_id = employee.id;`,
      (err, res) => {
        if (err) throw err;
        console.log('');
        console.table(res);
        console.log('');
      }
    );
  } else {
    connection.query('SELECT * FROM employee', (err, res) => {
      if (err) throw err;
      console.log('');
      console.table(res);
    });
  }
}
module.exports = {
  department: department,
  addEmployee: addEmployee,
  viewEmployee: viewEmployee,
  addRole: addRole,
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
