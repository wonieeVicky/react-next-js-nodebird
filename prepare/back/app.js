const express = require("express");
const cors = require("cors");

const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models");

const app = express(); // 이후 app.use 메서드로 express 서버에 미들웨어를 장착한다.

// 서버 실행 시 db 시퀄라이즈 연결도 같이 된다.
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

// 하위 두 개는 프론트에서 보내는 정보를 req.body로 넣어주기 위한 설정이다.
app.use(
  cors({
    // origin: 'http://nodebird.com' // 향후 서비스에서는 해커들의 차단을 위해 origin 도메인에서만 호출되도록 설정
    // credentials: false, //
    origin: true, // true 설정 시 * 대신 보낸 곳의 주소가 자동으로 들어가 편리하다.
  })
); // 모든 요청에 cors 설정해준다.
app.use(express.json()); // Front에서 보낸 Json형식의 데이터를 req.body에 넣어준다.
app.use(express.urlencoded({ extended: true })); // Front에서 보낸 form.submit 형식의 데이터를 req.body에 넣어준다

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
app.use("/user", userRouter);

app.listen(3065, () => {
  console.log("서버 실행 중!");
});
