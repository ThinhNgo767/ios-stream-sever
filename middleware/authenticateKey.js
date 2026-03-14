const bcrypt = require("bcrypt");

const authenticateKey = async (req, res, next) => {
  const SECRET_API_KEY = process.env.SECRET_API_KEY;

  const key = req.headers["x-api-key"];

  try {
    if (!key || !(await bcrypt.compare(SECRET_API_KEY, key))) {
      res.status(404).json({
        message: "API key is not existence!",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: "Server error!",
      error: error.message,
    });
  }
};

module.exports = authenticateKey;
