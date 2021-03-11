const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Post, Hashtag, Image, Comment, User } = require("../models");

// GET /hashtag/노드
router.get("/:hashtag", async (req, res, next) => {
  try {
    const where = {};
    // 초기 로딩이 아닐 떄
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // Op.lt(조건)
    }
    const posts = await Post.findAll({
      where, // lastId 방식
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Hashtag, where: { name: decodeURIComponent(req.params.hashtag) } }, // include 안에 넣어준 모델에 where를 적용할 수도 있다.
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

module.exports = router;
