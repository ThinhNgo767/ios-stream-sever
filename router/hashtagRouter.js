const express = require("express");
const { ObjectId } = require("mongodb");

const { db } = require("../utils/conect.mongo");
const filteredUpdate = require("../utils/filteredUpdate");

const hashtagRouter = express.Router();

// get all hashtag
hashtagRouter.get("/", async (req, res) => {
  try {
    const { tag } = req.query;

    const query = tag ? { tag: tag } : {};

    const hashtag = await db.hashtag.find(query).toArray();

    if (hashtag.length === 0) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json({
      message: "Get successfully",
      data: hashtag,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error occurred",
      error: err.message,
    });
  }
});

// create new hashtag
hashtagRouter.post("/", async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "No data provided!",
    });
  }

  const newHashtag = {
    ...req.body,
  };

  try {
    const hashtag = await db.hashtag.insertOne(newHashtag);

    if (!hashtag) {
      return res.status(404).json({
        message: "Insert failed!",
      });
    }
    const insertHashtag = { _id: hashtag.insertedId, ...req.body };

    res.status(200).json({
      message: "Create new successfully",
      data: insertHashtag,
    });
  } catch (err) {
    res.status(500).json({
      message: "Create failure!",
      error: err.message,
    });
  }
});

hashtagRouter.post("/many", async (req, res) => {
  const hashtagsUpload = req.body;

  if (!Array.isArray(hashtagsUpload) || hashtagsUpload.length === 0) {
    return res
      .status(400)
      .json({ message: "Dữ liệu gửi lên không hợp lệ hoặc trống." });
  }

  try {
    const result = await db.hashtag.insertMany(hashtagsUpload);

    res.status(201).json({
      message: "Tải lên hashtag thành công!",
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds,
    });
  } catch (error) {
    console.error("Lỗi khi chèn hashtags vào MongoDB:", error);
    res.status(400).json({
      message: error.message,
    });
  }
});

//update hashtag
hashtagRouter.put("/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      message: "Missing ID",
    });
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "No data provided!",
    });
  }

  try {
    const playload = await filteredUpdate(req.body, db.hashtag, id);

    const updateHashtag = await db.hashtag.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: playload,
      },
    );
    if (updateHashtag.modifiedCount === 0) {
      return res.status(404).json({
        message: "Data does not change",
      });
    }
    res.status(200).json({
      message: "Update successfully",
      data: playload,
    });
  } catch (err) {
    res.status(500).json({
      message: "Update failure!",
      error: err.message,
    });
  }
});

// delete hashtag
hashtagRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const hashtag = await db.hashtag.deleteOne({
      _id: new ObjectId(id),
    });

    if (hashtag.deletedCount === 0) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json({
      message: "Delete successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Delete failure!",
      error: err.message,
    });
  }
});

module.exports = hashtagRouter;
