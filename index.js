const os = require('os');
const express = require('express');
const mysql = require('mysql2');
const { Client } = require('pg')
const path = require('path')

const app = express();
const hostname = os.hostname();

// Set the 'public' folder as the static directory to serve HTML, CSS, and JS files0
// app.use(express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/*----------------Connection of Database--------------------*/

//-----------------This is DOKS and PV config----------------------
const client = new Client({
  user: 'postgres', //'postgres',
  host: 'postgres', //'kubernetes pod name',
  database: 'postgres', //'gcare', 
  password: 'postgres', //'ndrevanth09',
  port: 5432,
})

// const client = new Client({
//   user: 'postgres', //'postgres',
//   host: 'localhost', //'kubernetes pod name',
//   database: 'postgres', //'gcare', 
//   password: 'ndrevanth09', //'ndrevanth09',
//   port: 5432,
// });
client.connect(function (err) {
  if (err) {
    console.log(err);
    return;
  };
  console.log("Connected to Database!");
});

/*----------------API views--------------------*/
app.get('/', async (req, res) => {
  try {
    // Create the employees table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        salary DECIMAL(10, 2)
      )
    `;
    await client.query(createTableQuery);
    const result = await client.query('SELECT * FROM employees');
    // res.json(result.rows);
    //console.log(result.rows);
    res.render('index', { "result" : result.rows });
  } catch (err) {
    //console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/home', (req, res) => {
  res.render('home', {});
});

app.get('/add', async (req, res) => {
  try {
    // Create the employees table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        salary DECIMAL(10, 2)
      )
    `;
    await client.query(createTableQuery);

    // Perform the SELECT query
    const selectQuery = 'SELECT * FROM employees';
    const selectResult = await client.query(selectQuery);

    // Add a new employee (row) to the table
    const addEmployeeQuery = `
      INSERT INTO employees (name, department, salary)
      VALUES ('John Doe', 'Engineering', 75000.00)
    `;
    await client.query(addEmployeeQuery);

    // Perform the SELECT query again to include the newly added employee
    const updatedSelectResult = await client.query(selectQuery);

    // Send the result of the SELECT query with the newly added employee
    res.send(updatedSelectResult.rows);
  } catch (err) {
    //console.error('Error executing query:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/list', async (req, res) => {
  try {

    // //console.log('creating tables')
    // Create the employees table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS employees (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          department VARCHAR(255),
          salary DECIMAL(10, 2)
        )
      `;
    await client.query(createTableQuery);
    // //console.log('created tables')
    const result = await client.query('SELECT * FROM employees');
    // //console.log(result);
    res.json(result.rows);
  } catch (err) {
    //console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log("the server is running on port 3000");
});


