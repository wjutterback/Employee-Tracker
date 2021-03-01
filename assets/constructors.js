function Employee(fname, lname, role, manager) {
  this.first_name = fname;
  this.last_name = lname;
  this.role_id = role;
  this.manager = manager;
}

function Department(name) {
  this.name = name;
}

function Role(title, salary, department) {
  this.title = title;
  this.salary = salary;
  this.department_id = department;
}

module.exports = {
  Employee: Employee,
  Department: Department,
  Role: Role
}