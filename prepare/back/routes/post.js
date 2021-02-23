// 노드에서는 import, export를 쓰지않고 require와 module.exports를 사용한다.
// 프론트에서도 import, export를 webpack이 require와 module.exports로 변환해주는 개념임
// 향후에는 import, export로 합쳐질 것으로 예상한다.
const express = require("express");

const router = express.Router();

// POST /post
router.post("/", (req, res) => {
  res.json({ id: 1, content: "hello1" });
});
// DELETE /post
router.delete("/", (req, res) => {
  res.json({ id: 1 });
});

module.exports = router;
