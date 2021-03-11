const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Op } = require("sequelize");
const { User, Post, Image, Comment } = require("../models"); // db.User, db.Post를 가져옴
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
// const db = require("../models");
const router = express.Router();

// GET /user
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword); // 로그인 한 유저일 경우
    } else {
      res.status(200).json(null); // 로그인 하지 않은 유저일 경우
    }
  } catch (err) {
    console.error(err);
    next(error);
  }
});

// GET /user/1 (id 1번 유저 정보 가져오기)
router.get("/:userId", async (req, res, next) => {
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
    });
    if (fullUserWithoutPassword) {
      // 개인정보 침해 예방
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;

      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다.");
    }
  } catch (err) {
    console.error(err);
    next(error);
  }
});

// POST /user/ => front saga의 axios.post("http://localhost:3065/user"); 와 연결된다.
router.post("/", isNotLoggedIn, async (req, res, next) => {
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

// GET /user/:userId/posts
router.get("/:userId/posts", async (req, res, next) => {
  try {
    const where = { UserId: req.params.userId };
    // 초기 로딩이 아닐 떄
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // Op.lt(조건)
    }
    const posts = await Post.findAll({
      where, // lastId 방식
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            { model: Image },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /user/login
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.err(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id", "nickname"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id", "nickname"],
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

// POST /user/logout
router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.status(200).send("ok");
});

// PATCH /nickname
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      { where: { id: req.user.id } }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// PATCH /user/1/follow
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다.");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// DELETE /user/1/follow
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다.");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// DELETE /user/follower/1
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } }); // 그 사람을 먼저 찾고
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다."); // 없는 사람을 차단하려고 함!
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// GET /user/followers - 내가 팔로워한 사람 목록 가져오기
router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // 나를 먼저 찾고
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다.");
    }
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// GET /user/followings - 내가 팔로잉한 사람 목록 가져오기
router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // 나를 먼저 찾고
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다.");
    }
    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
