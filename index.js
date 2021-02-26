require('dotenv').config();
const inquirer = require('./assets/prompt');
const questions = require('./assets/questions');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  selection();
});

const selection = async () => {
  let { selection } = await inquirer(questions.employeeAction);
  console.log(selection);
  switch (selection) {
    case 'Exit':
      console.log('Quitting selection');
      break;
    case 'Add Employee':
      let addEmployee = await inquirer(questions.addEmployee);
      console.log(addEmployee);
      break;
  }

  connection.end();
};
