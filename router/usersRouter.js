const express = require("express");
const { ObjectId } = require("mongodb");

const { db } = require("../utils/conect.mongo");

const authenticateToken = require("../middleware/authenticateToken");

const usersRouter = express.Router();

usersRouter.use(authenticateToken);

usersRouter.get("/status", async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await db.users.findOne({ _id: new ObjectId(String(_id)) });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

usersRouter.post("/chage-active", async (req, res) => {
  const { isActive } = req.body;
  const user = req.user;

  try {
    const updateAcitve = await db.users.updateOne(
      { _id: new ObjectId(String(user._id)) },
      { $set: { isActive: isActive } },
    );
    if (updateAcitve.matchedCount === 0) {
      return res.json({
        success: false,
        message: "failed",
      });
    }
    res.json({
      success: true,
      message: "ok!",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "failed",
    });
  }
});

module.exports = usersRouter;
