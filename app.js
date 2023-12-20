const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const sequelize = require("./database");

app.use(express.json());

const userRoute = require("./routes/userRoute");
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("public"));

app.post("/signup", userRoute);

app.post("/login", userRoute);

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
