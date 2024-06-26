import mysql from "mysql2";

export const connectDB = async () => {
  const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "social_network",
  });

  pool.getConnection((err, connection) => {
    if (err) {
      console.log({ error: err.message });
    }

    console.log("Connected to MySQL database");
    connection.release();
  });
};
