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

connection.connect(async (err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  selection();
});

const selection = async () => {
  let action = await inquirer(questions.employeeAction);
  connection.end();
};
