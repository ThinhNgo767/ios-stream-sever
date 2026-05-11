require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const { connectDB } = require("../utils/conect.mongo");
const routers = require("../router/index");

app.use(
  cors({
    origin: ["https://ksc88.net", "https://hashtag.ksc88.net"],
    credentials: true,
  }),
);

app.use(express.json()); // Để parse JSON body từ ReactJS
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

app.use("/api/v1", routers);

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello My App Server",
    success: true,
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Error data!",
    success: false,
  });
});

app.listen(port, "0.0.0.0", () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
