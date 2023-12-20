const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const userAuthenticate = require("../middleware/auth");
router.get("/getusers", userAuthenticate.authenticate, chatController.getUsers);
router.post(
  "/sendmessage",
  userAuthenticate.authenticate,
  chatController.sendMessage
);
module.exports = router;
