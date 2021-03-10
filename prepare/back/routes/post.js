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

// GET /post/1
router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send("존재하지 않는 게시글입니다.");
    }

    const fullPost = await Post.findOne({
      where: {
        id: post.id,
      },
      include: [
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
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
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
    console.log(fullPost);
    res.status(200).json(fullPost);
  } catch (err) {
    console.error(err);
    next(error);
  }
});

// POST /post/1/retweet
router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }

    // 나의 글을 리트윗하거나 다른 사람이 나의 글을 리트윗한 것을 다시 내가 리트윗 하는 것은 막는다.
    // 위에서 Post.findOne으로 Post as Retweet을 include해주었기 때문에 post.Retweet을 사용할 수 있다.
    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send("자신의 글은 리트윗 할 수 없습니다.");
    }

    // 다른 게시글을 리트윗하거나 다른 사람이 다른 게시글을 리트윗한 것을 다시 리트윗 하는 것은 가능하다.
    // post.RetweetId가 있으면 이미 리트윗한 글, 만약 아니라면 null이 되므로 post.id로 지정.
    const retweetTargetId = post.RetweetId || post.id;

    // 이미 리트윗한 글인지 확인
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send("이미 리트윗한 글입니다.");
    }

    // 아래 코드만으로는 구체적으로 어떤 게시글이 리트윗 되었는지 알 수 없다.
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });

    // 따라서 리트윗 게시글의 정보를 가져오기 위해 넣어준다.
    // 가져오는 데이터가 많아 include 정보가 많아지면 속도가 매우 느려진다.
    // 따라서 추가 이벤트로 데이터를 확인할 수 있는 것은 분리해주는 것이 좋다. (리트윗 게시글의 코멘트는 별도 이벤트로 분리)
    const retweetWithPrevPost = await Post.findOne({
      where: {
        id: retweet.id,
      },
      include: [
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
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(retweetWithPrevPost);
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
