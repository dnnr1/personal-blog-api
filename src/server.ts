import express from "express";
import cors from "cors";
import "dotenv/config";

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.send("Application is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
