const express = require("express");

const authenticateKey = require("../middleware/authenticateKey");

const videosRouter = require("./videosRouter");
const picturesRouter = require("./picturesRouter");
const authenticateRouter = require("./authenticateRouter");

const routers = express.Router();

routers.use("/auth", authenticateRouter);
routers.use("/videos", authenticateKey, videosRouter);
routers.use("/pictures", authenticateKey, picturesRouter);

module.exports = routers;
