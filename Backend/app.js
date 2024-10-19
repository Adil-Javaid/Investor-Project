require("dotenv").config();
require("./DataBase/connection");

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
const bonusRoutes = require("./routes/BonusRoutes");


app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(express.json());
app.use("/api/bonus", bonusRoutes);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
