const express = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const authenticateLogin = require("../middleware/authenticateLogin");
const authenticateToken = require("../middleware/authenticateToken");

const getDataFromMongoDB = require("../utils/getDataFromMongoDB");
const hashPassword = require("../utils/hasPassword");

const { db } = require("../utils/conect.mongo");

const authenticateRouter = express.Router();

authenticateRouter.post("/sig-in", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing input data!",
    });
  }

  const users = await getDataFromMongoDB(db.users);

  try {
    const existingUser = await authenticateLogin(req.body, users);

    const { _id, userId, role, key, tokenVersion } = existingUser;

    const payload = {
      _id,
      userId,
      role,
      tokenVersion,
    };

    const SECRET_KEY = process.env.SECRET_KEY;

    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login is successfully",
      success: true,
      accessToken: token,
      secretKey: key,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

authenticateRouter.get("/me", authenticateToken, async (req, res) => {
  const { _id } = req.user;

  const user = await db.users.findOne(
    {
      _id: new ObjectId(String(_id)),
    },
    {
      projection: {
        password: 0,
        security_code: 0,
        resetToken: 0,
        tokenVersion: 0,
      },
    },
  );

  res.json({
    userInfo: user,
  });
});

authenticateRouter.post("/verify-code", authenticateToken, async (req, res) => {
  const { security_code } = req.body;

  if (!security_code) {
    return res.status(400).json({
      message: "Body missing data!",
    });
  }

  try {
    const user = await db.users.findOne({
      _id: new ObjectId(String(req.user._id)),
    });

    if (
      !user ||
      !(await bcrypt.compare(req.body.security_code, user.security_code))
    )
      return res.status(400).json({
        success: false,
        message: "Security codes do not match!",
      });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = authenticateRouter;
