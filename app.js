const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const sequelize = require("./database");
const User = require("./models/user");
const Message = require("./models/message");
const Group = require("./models/group");
const GroupMessage = require("./models/groupMessages");

app.use(express.json());

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const groupRoute = require("./routes/groupRoute");
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("public"));

app.post("/signup", userRoute);

app.post("/login", userRoute);

app.get("/getusers", chatRoute);
app.post("/sendmessage", chatRoute);
app.get("/getMessages", chatRoute);

app.post("/creategroup", groupRoute);
app.get("/getgroups", groupRoute);

app.post("/sendGmessage", groupRoute);
app.get("/getGmessages/:groupId", groupRoute);

app.post("/adduserstogroup/:groupId", groupRoute);

// app.get("/getGroupsForUser/:userId", groupRoute);

User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: "UserGroup" });
Group.belongsToMany(User, { through: "UserGroup" });

User.hasMany(GroupMessage);
GroupMessage.belongsTo(User);

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
