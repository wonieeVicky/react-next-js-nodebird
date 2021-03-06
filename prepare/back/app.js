const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const db = require("./models");
const passportConfig = require("./passport");

dotenv.config();
const app = express(); // 이후 app.use 메서드로 express 서버에 미들웨어를 장착한다.

// 서버 실행 시 db 시퀄라이즈 연결도 같이 된다.
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();

app.use(morgan("dev"));
// cors 설정
app.use(
  cors({
    // origin: 'http://nodebird.com' // 향후 서비스에서는 해커들의 차단을 위해 origin 도메인에서만 호출되도록 설정
    credentials: true, // access-control-allow-credentials가 true가 되어 다른 도메인 간 쿠키 전달이 가능해진다.
    origin: "http://localhost:3026", // true 설정 시 * 대신 보낸 곳의 주소가 자동으로 들어가 편리하다.
  })
);
app.use("/", express.static(path.join(__dirname, "uploads"))); // 운영체제에 맞게 알아서 해주는 path.join을 사용해 localhost:3065/uploads에 접근할 수 있도록 해준다.
// req.body에 데이터 넣어주기 위한 설정
app.use(express.json()); // Front에서 보낸 Json형식의 데이터를 req.body에 넣어준다.
app.use(express.urlencoded({ extended: true })); // Front에서 보낸 form.submit 형식의 데이터를 req.body에 넣어준다
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// url /에 보내는 get 메서드
app.get("/", (req, res) => {
  res.send("hello express"); // 문자열 응답
});
app.get("/api", (req, res) => {
  res.send("hello api"); // 문자열 응답
});

app.use("/post", postRouter); // postRouter api path에 /post가 접두어(prefix)로 붙는다.
app.use("/posts", postsRouter);
app.use("/user", userRouter);

app.listen(3065, () => {
  console.log("서버 실행 중!");
});
