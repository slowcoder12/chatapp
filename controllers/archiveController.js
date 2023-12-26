const ArchivedGroupMessage = require("../models/archivemodel");
const { Op } = require("sequelize");
const groupMessage = require("../models/groupMessages");

const moveAndDeleteOldMessages = async () => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const oldMessages = await groupMessage.findAll({
    where: {
      createdAt: {
        [Op.lt]: oneDayAgo,
      },
    },
  });

  await ArchivedGroupMessage.bulkCreate(oldMessages.map((msg) => msg.toJSON()));
  await groupMessage.destroy({
    where: {
      createdAt: {
        [Op.lt]: oneDayAgo,
      },
    },
  });
};

moveAndDeleteOldMessages();

module.exports = moveAndDeleteOldMessages;
