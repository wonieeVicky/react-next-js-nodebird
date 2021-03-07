const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Post, Comment, User, Image, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (err) {
  console.log("uploads 폴더가 없으므로 생성한다.");
  fs.mkdirSync("uploads");
}

// 이미지 업로드를 위한 설정
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 비키

      done(null, basename + "_" + new Date().getTime() + ext); // 비키_12390123912.png
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

// POST /post
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  // formData내 text로만 데이터가 오므로 upload.none() 사용
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g); // hashTag 가져오기
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    if (hashtags) {
      // #을 slice로 빼고, toLowerCase 소문자로 저장해서 REACT, react 모두 검색되도록 한다.
      // hashtag에 등록을 할 때, 이미 등록되어 있으면 무시하고, 없는 해시태그일 경우에만 저장한다.
      // 때문에 create메서드가 아닌 findOrCreate라는 메서드를 사용해야한다.
      const result = await Promise.all(
        hashtags.map((tag) => Hashtag.findOrCreate({ where: { name: tag.slice(1).toLowerCase() } }))
      ); // [[#노드, true], [#리액트, false]]
      await post.addHashtags(result.map((v) => v[0])); // result가 이차원 배열로 들어오므로 v[0]으로 값만 넣어준다.
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, // 좋아요 누른사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(fullPost); // 생성된 데이터가 성공 시 반환된다.
  } catch (err) {
    console.error(err);
    next(error);
  }
});

// POST /post/images
router.post("/images", isLoggedIn, upload.array("image"), async (req, res, next) => {
  try {
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
  } catch (err) {
    console.error(err);
    next(err);
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
      PostId: parseInt(req.params.postId, 10), // req.params라는 메서드로 postId에 접근 가능
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment); // 생성된 데이터가 성공 시 반환된다.
  } catch (err) {
    console.error(err);
    next(error);
  }
});

// PATCH /post/1/like
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: parseInt(req.params.postId, 10) } });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    await post.addLikers(req.user.id); // db 조작할 떄는 반드시 await 붙여준다.
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// DELETE /post/1/unlike
router.delete("/:postId/unlike", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: parseInt(req.params.postId, 10) } });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    await post.removeLikers(req.user.id); // db 조작할 떄는 반드시 await 붙여준다.
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// DELETE /post/1
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    // 내가 쓴 게시글을 지우도록 보안 철저하게 처리
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
