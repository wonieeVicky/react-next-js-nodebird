const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models"); // db.User를 가져옴
const router = express.Router();

// POST /user/login
// 미들웨어 확장: req, res, next를 사용하기 위해 passport.authenticate 함수를 감싸준다.
router.post("/login", (req, res, next) => {
  // err, user, info는 done의 3가지 인자를 의미한다.
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.err(err);
      return next(err); // status 500
    }
    if (info) {
      return res.status(401).send(info.reason); // 401 허가되지 않음 - http 상태코드 공부하기
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.json(user);
    });
  })(req, res, next);
});

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
