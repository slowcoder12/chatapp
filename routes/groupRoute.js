const express = require("express");
const router = express.Router();
const userAuthenticate = require("../middleware/auth");
const groupController = require("../controllers/groupController");

router.post(
  "/creategroup",
  userAuthenticate.authenticate,
  groupController.createGroup
);

router.get(
  "/getgroups",
  userAuthenticate.authenticate,
  groupController.getgroups
);

router.post(
  "/sendGmessage",
  userAuthenticate.authenticate,
  groupController.sendGroupMessage
);

router.get("/getGmessages/:groupId", groupController.getGMessages);

router.post(
  "/adduserstogroup/:groupId",
  userAuthenticate.authenticate,
  groupController.adduserstogroup
);

// router.get(
//   "/getGroupsForUser/:userId",
//   userAuthenticate.authenticate,
//   groupController.getGroupsForUser
// );

module.exports = router;
