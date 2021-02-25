const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models"); // db.User를 가져옴
const router = express.Router();

// POST /user/ => front saga의 axios.post("http://localhost:3065/user"); 와 연결된다.
router.post("/", async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
