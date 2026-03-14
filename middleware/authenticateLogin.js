const bcrypt = require("bcrypt");

const authenticateLogin = async (body, data) => {
  try {
    // Tìm user mà không tiết lộ thông tin không cần thiết
    const findUser = data.find(
      (res) =>
        res.username === body.usernameOrEmail ||
        res.email === body.usernameOrEmail,
    );

    // Phản hồi chung cho cả 2 trường hợp sai username/password
    if (
      !findUser ||
      !(await bcrypt.compare(body.password, findUser.password))
    ) {
      throw new Error("Invalid credentials");
    }

    if (findUser.status === false) {
      throw new Error("Account has been locked");
    }
    const { _id, userId, role, key, tokenVersion } = findUser;

    // Trả về thông tin cần thiết (không bao gồm password)
    return {
      _id,
      userId,
      role,
      key,
      tokenVersion,
    };
  } catch (error) {
    console.error("Login error:", error);

    if (error.message === "Invalid credentials") {
      throw error;
    }
    if (error.message === "Account has been locked") {
      throw error;
    }
    throw new Error("Authentication failed");
  }
};

module.exports = authenticateLogin;
