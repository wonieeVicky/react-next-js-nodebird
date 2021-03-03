const express = require("express");
const { Post, User, Image, Comment } = require("../models");
const router = express.Router();

// GET /posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      // where: { id: lastId }, // lastId 방식
      limit: 10,
      order: [
        ["createdAt", "DESC"], // 생성일로 내림차순 정렬
        [Comment, "createdAt", "DESC"], // 댓글 생성일로 내림차순 정렬
      ],
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
            },
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

module.exports = router;
