//Tentative constructors for MySQL queries
function Employee(fname, lname, role, manager) {
  if (fname) this.first_name = fname;
  if (lname) this.last_name = lname;
  if (role) this.role_id = role;
  if (manager_id) this.manager_id = manager;
}

function Department(name) {
  if (name) this.name = name;
}

function Role(title, salary, department) {
  if (title) this.title = title;
  if (salary) this.salary = salary;
  if (department) this.department_id = department;
}

exports.Employee = Employee;
exports.Department = Department;
exports.Role = Role;

// From DB Tables (to reference)
// CREATE TABLE employee(
//   id INT AUTO_INCREMENT,
//   first_name VARCHAR(30),
//   last_name VARCHAR(30),
//   PRIMARY KEY(id),
//   FOREIGN KEY(role_id) REFERENCES role(id),
//   FOREIGN KEY(manager_id) REFERENCES employee(id)
//   );

//   CREATE TABLE role(
//   id INT AUTO_INCREMENT,
//   title VARCHAR(30),
//   salary DECIMAL,
//   FOREIGN KEY(department_id) REFERENCES department(id)
//   );

//   CREATE TABLE manager(
//   id INT AUTO_INCREMENT,
//   first_name VARCHAR(30),
//   last_name VARCHAR(30),
//   PRIMARY KEY(id),
//   FOREIGN KEY(department_id) REFERENCES department(id)
//   );

//   CREATE TABLE department(
//   id INT AUTO_INCREMENT,
//   name VARCHAR(30)
//   );