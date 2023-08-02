const os = require('os');
const express = require('express');
const mysql = require('mysql2');
const { Client } = require('pg')

const app = express();
const hostname = os.hostname();

const client = new Client({
  user: 'postgres', //'postgres',
  host: 'postgres', //'kubernetes pod name',
  database: 'postgres', //'gcare', 
  password: 'postgres', //'ndrevanth09',
  port: 5432,
})
client.connect(function(err) {
  if (err){
    // console.log(client)
    console.log("================error=====================");
    console.log(err);
    return;
  };
  console.log("Connected!");
});

app.get('/api', async (req, res) => {
  try {
 
      console.log('creating tables')
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
    console.log('created tables')
    const result = await client.query('SELECT * FROM employees');
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/create', async (req, res) => {
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
    console.error('Error executing query:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
    res.send("Hello Everyone. I am nodeapp communicating with postgres using DOKS and GH actions");
})

app.get('/home', (req, res) => {
    res.send(`Hostname is ${hostname}`);
})

app.listen(3000,() =>{
    console.log("server is running on port 3000");
});

