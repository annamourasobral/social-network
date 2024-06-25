import express, { Request, Response } from "express";
import mysql, { ResultSetHeader, RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";
import { User } from "../../types";

const pool: Pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "social_network",
  })
  .promise();

const usersRouter = express.Router();

usersRouter.get("/", async (req: Request, res: Response) => {
  const [users]: [RowDataPacket[], unknown] = await pool.query(
    "SELECT * FROM users"
  );

  res.status(201).json({
    users: users.map((u) => u.username),
  });

  return users as User[];
});

usersRouter.get("/:id", async (req: Request, res: Response) => {
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
        username: user.username,
        email: user.email,
        timeline: user.timeline,
        createdAt: user.createdAt,
      },
    });

    return {
      username: user.username,
      name: user.name,
      email: user.email,
      timeline: user.timeline,
    };
  } catch (error) {
    console.error("Error retrieving user", error);
    res.status(404).json({ message: `User with id ${id} not found` });
    return;
  }
});

usersRouter.post("/:id/timeline", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { post } = req.body;
  const { author, content } = post;

  try {
    const [result]: [ResultSetHeader, unknown] = await pool.query(
      `INSERT INTO posts (user_id, author, content)
        VALUES (?, ?, ?)`,
      [id, author, content]
    );

    if (!result || result.affectedRows !== 1) {
      res.status(404).json({ message: "Failed to post" });

      return;
    }

    res.status(201).json({ message: `User with id ${id} posted successfully` });
  } catch (error) {
    console.log("Error posting", error);
  }
});

usersRouter.post(
  "/:follower_id/follow/:followed_id",
  async (req: Request, res: Response) => {
    const { follower_id, followed_id } = req.params;

    try {
      const [result]: [ResultSetHeader, unknown] = await pool.query(
        `INSERT INTO followers (follower_id, followed_id)
        VALUES (?, ?)`,
        [follower_id, followed_id]
      );

      if (!result || result.affectedRows !== 1) {
        res.status(404).json({ message: "Failed to follow user" });

        return;
      }

      res
        .status(201)
        .json({ message: `User with id ${followed_id} followed successfully` });
    } catch (error) {
      console.log("Error following", error);
      res.status(404).json({ message: "Failed to follow user" });
    }
  }
);

export default usersRouter;
