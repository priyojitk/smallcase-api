//env credentials
require("dotenv").config();
import express from "express";
import cors from "cors";
import apiRouter from "./routes/api.v1";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

// Configuring the database
require("./config/db/index");

//Routes
app.use("/api/v1", apiRouter);

app.get("/status", (req, res) => {
  res.json({ status: "Server is up & OK" });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
