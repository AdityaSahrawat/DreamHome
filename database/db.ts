import mysql from "mysql2/promise";

// Load environment variables
// const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT } = process.env;

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "mySQLpass@25?@#",
  database: "dreamHome",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to run queries
export async function query(sql: string, values: any[] = []) {
  const [results] = await pool.execute(sql, values);
  return results;
}
