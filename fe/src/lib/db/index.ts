import mysql from "mysql2/promise";

declare global {
  var _mysqlPool: mysql.Pool | undefined;
}

const pool =
  global._mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST_1,
    port: process.env.DB_PORT_1 ? Number(process.env.DB_PORT_1) : 3306,
    user: process.env.DB_USER_1,
    password: process.env.DB_PASSWORD_1,
    database: process.env.DB_NAME_1,
    waitForConnections: true,
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== "production") {
  global._mysqlPool = pool;
}

export default pool;
