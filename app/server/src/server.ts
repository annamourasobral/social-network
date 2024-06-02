import express, { Express } from "express";

const app: Express = express();

const port = 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
