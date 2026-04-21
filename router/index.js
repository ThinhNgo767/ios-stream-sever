const express = require("express");

const authenticateKey = require("../middleware/authenticateKey");

const videosRouter = require("./videosRouter");
const picturesRouter = require("./picturesRouter");
const authenticateRouter = require("./authenticateRouter");
const usersRouter = require("./usersRouter");
const hashtagRouter = require("./hashtagRouter");

const routers = express.Router();

routers.use("/auth", authenticateRouter);
routers.use("/user", usersRouter);
routers.use("/hashtag", hashtagRouter);
routers.use("/videos", authenticateKey, videosRouter);
routers.use("/pictures", authenticateKey, picturesRouter);

module.exports = routers;
