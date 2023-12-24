const User = require("../models/user");
const Message = require("../models/message");
const Group = require("../models/group");
const groupMessage = require("../models/groupMessages");

exports.createGroup = async (req, res) => {
  try {
    const groupName = req.body.groupName;
    const userId = req.user.id;
    console.log(groupName);
    const response = await Group.create({
      group_name: groupName,
      createdBy: userId,
    });
    await response.addUsers([userId]);

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
          through: "UserGroup",
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

exports.sendGroupMessage = async (req, res) => {
  try {
    console.log("backend send tounched");
    const message = req.body.message;
    const groupId = req.body.groupId;
    const userId = req.user.id;

    console.log(message, groupId, userId);

    const newMessage = await groupMessage.create({
      message_content: message,
      group_id: groupId,
      userId: userId,
    });

    //console.log(newMessage);

    res.status(201).json({ message: "Message sent successfully", newMessage });
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

// Assuming you have your Sequelize models defined (User, Group, UserGroup)

// Express route to handle adding users to a group
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
