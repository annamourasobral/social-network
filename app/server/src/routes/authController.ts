import dotenv from "dotenv";
import { Request, Response } from "express";
import mysql from "mysql2";
import { Pool, QueryError, ResultSetHeader } from "mysql2/promise";

dotenv.config();

const pool: Pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const [result]: [ResultSetHeader, unknown] = await pool.query(
      `INSERT INTO users (name, email, password, timeline)
      VALUES (?, ?, ?, ?)`,
      [name, email, password, "[]"]
    );

    if (!result || result.affectedRows !== 1) {
      res.status(404).json({ message: "Failed to create user" });

      return;
    }

    const id = result.insertId;
    res
      .status(201)
      .json({ message: `User with id ${id} created successfully` });
  } catch (error) {
    if ((error as QueryError).code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Email is being used by another user" });
      return;
    }

    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

const authController = { signUp };

export { authController };
