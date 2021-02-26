const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

function department(dept) {
  connection.query(
    `SELECT ? FROM department`,
    { name: dept.name },
    (err, res) => {
      if (err) throw err;
      console.table(res);
      console.log(res);
      const valueArray = Object.values(res[0]);
      if (valueArray[0] === 1) {
        console.log('Sales found in database');
      } else if (valueArray[0] === [0]) {
        console.log('Sales not found in DB');
      }
    }
  );
  // connection.query(
  //   'INSERT INTO department SET ?',
  //   {
  //     name: dept.name,
  //   },
  //   (err, res) => {
  //     if (err) throw err;
  //     console.log(res);
  //     console.log(`${res.affectedRows} department added`);
  //   }
  // );
}

function addEmployee(employee) {
  connection.query(
    'INSERT INTO employee SET ?',
    {
      first_name: employee.first_name,
      last_name: employee.last_name,
      role_id: employee.role,
      manager_id: employee.manager_id,
    },
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} employee added`);
    }
  );
}

function viewEmployee() {
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.table(res);
  });
}
module.exports = {
  department: department,
  addEmployee: addEmployee,
  viewEmployee: viewEmployee,
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
