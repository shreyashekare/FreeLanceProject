const mysql = require('mysql')

const conn = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'taskmanager',
})

conn.connect((err) => {
  if (err) throw err
  console.log('Db Connected')
})

module.exports = conn
