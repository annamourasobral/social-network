import dotenv from "dotenv";
import { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { User } from "../types";

dotenv.config();

const pool: Pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const getUsers = async (req: Request, res: Response) => {
  const [users]: [RowDataPacket[], unknown] = await pool.query(
    "SELECT * FROM users"
  );

  res.status(201).json({
    users: users,
  });

  return users as User[];
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [users]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );

    const user: RowDataPacket = users[0];
    res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
        timeline: user.timeline,
        createdAt: user.createdAt,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      timeline: user.timeline,
    };
  } catch (error) {
    console.error("Error retrieving user", error);
    res.status(404).json({ message: `User with id ${id} not found` });
    return;
  }
};

const usersController = {
  getUsers,
  getUser,
};

export { usersController };