//Tentative constractors for MySQL queries
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
