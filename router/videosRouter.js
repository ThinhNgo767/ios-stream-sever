const express = require("express");

const authenticateToken = require("../middleware/authenticateToken");
const getDataFromMongoDB = require("../utils/getDataFromMongoDB");
const { db } = require("../utils/conect.mongo");

const videosRouter = express.Router();

videosRouter.use(authenticateToken);

videosRouter.get("/koreanbj", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalItems = await db.videos_kbj.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const videos = await getDataFromMongoDB(db.videos_kbj, {}, null, {
      limit,
      skip,
    });

    const infoVideos = videos.map((v) => {
      return { id: v.id, thumb: v.thumbUrl, tag: v.tag, anchor: v.anchor };
    });

    return res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      infoVideos: infoVideos,
    });
  } catch (error) {
    console.error("❌ Lỗi phân trang:", err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách videos" });
  }
});

videosRouter.get("/koreanbj/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const video = await db.videos_kbj.findOne({
      id: id,
    });

    if (!video) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }
    res.status(200).json({
      message: "Get successfully",
      url: video.videoUrl,
    });
  } catch (err) {
    res.status(500).json({
      message: "Resource is not existence!",
      error: err.message,
    });
  }
});

videosRouter.get("/realistic", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    const totalItems = await db.videos_real.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const videos = await getDataFromMongoDB(db.videos_real, {}, null, {
      limit,
      skip,
    });

    const infoVideos = videos.map((v) => {
      return { id: v.id, thumb: v.thumbUrl, tag: v.category, anchor: v.anchor };
    });

    return res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      videos: infoVideos,
    });
  } catch (error) {
    console.error("❌ Lỗi phân trang:", err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách videos" });
  }
});

videosRouter.get("/realistic/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const video = await db.videos_real.findOne({
      id: id,
    });

    if (!video) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }
    res.status(200).json({
      message: "Get successfully",
      url: video.videoUrl,
    });
  } catch (err) {
    res.status(500).json({
      message: "Resource is not existence!",
      error: err.message,
    });
  }
});

module.exports = videosRouter;
