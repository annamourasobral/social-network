import express, { Request, Response } from "express";
import mysql, { QueryError, ResultSetHeader } from "mysql2";
import { Pool, RowDataPacket } from "mysql2/promise";

const pool: Pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "social_network",
  })
  .promise();

const authRouter = express.Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

  try {
    const [result]: [ResultSetHeader, unknown] = await pool.query(
      `INSERT INTO users (name, username, email, password)
        VALUES (?, ?, ?, ?)`,
      [name, username, email, password]
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
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [result]: [RowDataPacket[], unknown] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!result) {
      res.status(404).json({ message: "Email not found" });
      return;
    }
    const user = result[0];

    if (user.password !== password) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to login" });
  }
});

export default authRouter;
