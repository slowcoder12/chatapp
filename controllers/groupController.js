const User = require("../models/user");

const Group = require("../models/group");
const groupMessage = require("../models/groupMessages");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: process.env.IAM_REGION,
  endpoint: "s3.amazonaws.com",
});

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

exports.createGroup = async (req, res) => {
  try {
    const groupName = req.body.groupName;
    const userId = req.user.id;
    console.log(groupName);
    const response = await Group.create({
      group_name: groupName,
      createdBy: userId,
    });

    await response.addUsers([userId], { through: { isAdmin: true } });

    res.status(201).json({ response, message: "group created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error occurred in creating a group" });
  }
};

exports.getgroups = async (req, res) => {
  const userId = req.user.id;
  try {
    const groups = await User.findByPk(userId, {
      include: [
        {
          model: Group,
          through: "UserGroups",
          as: "groups",
        },
      ],
    });

    res.status(200).json(groups.groups);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error occurred in fetching groups" });
  }
};

const sendGroupMessageMiddleware = upload.single("image");

exports.sendGroupMessage = async (req, res) => {
  try {
    // Apply the middleware to handle form data
    sendGroupMessageMiddleware(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: "Error processing form data" });
      }

      console.log("backend send touched");
      const message = req.body.message;
      const groupId = req.body.groupId;
      const userId = req.user.id;
      const imageFile = req.file;

      console.log(message, groupId, userId, imageFile);

      let imageUrl;

      // Check if an image file is provided
      if (imageFile) {
        const uploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: `group-messages/${groupId}/${imageFile.originalname}`, // Adjust the key as needed
          Body: imageFile.buffer,
        };

        const s3UploadResponse = await s3.upload(uploadParams).promise();
        console.log("s3 upload", s3UploadResponse);

        imageUrl = s3UploadResponse.Location;
      }

      const newMessage = await groupMessage.create({
        message_content: message,
        group_id: groupId,
        userId: userId,
        imageUrl: imageUrl, // Set imageUrl whether or not an image is uploaded
      });

      io.to(`group-${groupId}`).emit("newGroupMessage", {
        groupId: groupId,
        message: newMessage,
      });

      res
        .status(201)
        .json({ message: "Message sent successfully", newMessage });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message" });
  }
};

exports.getGMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    const messages = await groupMessage.findAll({
      where: { group_id: groupId },
    });
    console.log(messages);
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred in fetching messages" });
  }
};

exports.adduserstogroup = async (req, res) => {
  const groupId = req.params.groupId;
  const { userIds } = req.body;
  console.log("Userssssssssss iiiddd", userIds);
  try {
    // Find the group
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Find the users to add
    const usersToAdd = await User.findAll({
      where: {
        id: userIds,
      },
    });

    // Add users to the group
    const response = await group.addUsers(usersToAdd);
    console.log("users response from backend", response);
    return res
      .status(200)
      .json({ message: "Users added to the group successfully" });
  } catch (err) {
    console.error("Error adding users to the group", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserNames = async (req, res) => {
  try {
    const userIds = req.body.userIds;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    const users = await User.findAll({
      attributes: ["id", "name"],
      where: {
        id: userIds,
      },
    });

    const userNameMap = {};
    users.forEach((user) => {
      userNameMap[user.id] = user.name;
    });

    res.status(200).json(userNameMap);
  } catch (err) {
    console.error("Error fetching user names", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.makeAdminsInGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const { userIds } = req.body;
  console.log("Making users admins in group", userIds);

  try {
    // Find the group
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Find the users to make admins
    const usersToMakeAdmin = await User.findAll({
      where: {
        id: userIds,
      },
    });

    // Make users admins in the group
    const response = await group.addUsers(usersToMakeAdmin, {
      through: { isAdmin: true },
    });
    console.log("Users made admins in the group", response);

    return res
      .status(200)
      .json({ message: "Users made admins in the group successfully" });
  } catch (err) {
    console.error("Error making users admins in the group", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.removeUsersFromGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const { userIds } = req.body;

  try {
    // Find the group
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Find the users to remove
    const usersToRemove = await User.findAll({
      where: {
        id: userIds,
      },
    });

    // Remove users from the group
    const response = await group.removeUsers(usersToRemove);
    console.log("Users removed from the group", response);

    return res
      .status(200)
      .json({ message: "Users removed from the group successfully" });
  } catch (err) {
    console.error("Error removing users from the group", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getGroupMembers = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    // Find the group
    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: User,
          through: "UserGroups",
          as: "users",
        },
      ],
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const members = group.users.map((user) => {
      return {
        id: user.id,
        name: user.name,
      };
    });

    res.status(200).json(members);
  } catch (err) {
    console.error("Error fetching group members", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
