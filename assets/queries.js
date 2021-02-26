function addEmployee(employee) {
const query = connection.query(
  'INSERT INTO employee SET ?',
  {
    first_name: employee.first_name,
    last_name: employee.last_name,
    role_id: employee.role,
    manager_id: employee.manager_id
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
