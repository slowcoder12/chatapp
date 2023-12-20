const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const sequelize = require("./database");
const User = require("./models/user");
const Message = require("./models/message");

app.use(express.json());

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("public"));

app.post("/signup", userRoute);

app.post("/login", userRoute);

app.get("/getusers", chatRoute);
app.post("/sendmessage", chatRoute);

User.hasMany(Message);
Message.belongsTo(User);

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
