const express = require("express");

const { Post, Comment, User, Image } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

// POST /post
router.post("/", isLoggedIn, async (req, res, next) => {
  console.log(req);
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, // passport의 deserializeUser를 통해 req.user.id에 접근 가능함
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
        },
        {
          model: User,
        },
      ],
    });
    res.status(201).json(fullPost); // 생성된 데이터가 성공 시 반환된다.
  } catch (err) {
    console.error(err);
    next(error);
  }
});

// POST /post/1/comment
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  // 위에 :postId를 통해 파라미터 주입: 주소 부분에서 동적으로 바뀌는 부분을 파라미터라고 함
  try {
    // 실제 있는 글에 코멘트를 추가하는지 여부에 대해 백엔드에서 검증 진행
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId, // req.params라는 메서드로 postId에 접근 가능
      UserId: req.user.id,
    });
    res.status(201).json(comment); // 생성된 데이터가 성공 시 반환된다.
  } catch (err) {
    console.error(err);
    next(error);
  }
});

// DELETE /post
router.delete("/", (req, res) => {
  res.json({ id: 1 });
});

module.exports = router;
