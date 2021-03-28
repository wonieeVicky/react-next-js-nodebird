const express = require('express');
const { Op } = require('sequelize');
const { Post, User, Image, Comment, Sequelize } = require('../models');
const router = express.Router();

// GET /posts
router.get('/', async (req, res, next) => {
  try {
    const where = {};
    // 초기 로딩이 아닐 떄
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // Op.lt(조건)
    }
    const posts = await Post.findAll({
      where, // lastId 방식
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
              order: [['createdAt', 'DESC']],
            },
          ],
        },
        {
          model: User,
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Post,
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
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

// 내가 팔로잉한 사람들의 게시글
router.get('/related', async (req, res, next) => {
  try {
    const followings = await User.findAll({
      attributes: ['id'],
      include: [
        {
          model: User,
          as: 'Followers',
          where: { id: req.user.id },
        },
      ],
    });
    // SubQuery를 안다면 Sequelize literal로 쿼리를 직접 넣어도됨
    const where = {
      UserId: { [Op.in]: followings.map((v) => v.id) }, // 배열 안의 조건이 해당하는 조건이면 성공
    };
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // Op.lt(조건)
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
              order: [['createdAt', 'DESC']],
            },
          ],
        },
        {
          model: User,
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Post,
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
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

// 관계없는 유저들의 게시글
router.get('/unrelated', async (req, res, next) => {
  try {
    const followings = await User.findAll({
      attributes: ['id'],
      include: [
        {
          model: User,
          as: 'Followers',
          where: { id: req.user.id },
        },
      ],
    });
    const where = {
      UserId: { [Op.notIn]: followings.map((v) => v.id).concat(req.user.id) },
    };
    // 초기 로딩이 아닐 떄
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // Op.lt(조건)
    }
    const posts = await Post.findAll({
      where, // lastId 방식
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
              order: [['createdAt', 'DESC']],
            },
          ],
        },
        {
          model: User,
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Post,
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
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
