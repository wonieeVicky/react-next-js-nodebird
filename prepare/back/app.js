const express = require("express");
const postRouter = require("./routes/post");
const app = express();

// url /에 보내는 get 메서드
app.get("/", (req, res) => {
  res.send("hello express"); // 문자열 응답
});
app.get("/api", (req, res) => {
  res.send("hello api"); // 문자열 응답
});

app.get("/api/posts", (req, res) => {
  res.json([
    { id: 1, content: "hello1" },
    { id: 2, content: "hello2" },
    { id: 3, content: "hello3" },
  ]); // json 객체 응답
});

app.use("/post", postRouter); // postRouter api path에 /post가 접두어(prefix)로 붙는다.

app.listen(3065, () => {
  console.log("서버 실행 중");
});
