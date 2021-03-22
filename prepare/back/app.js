const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');
const hpp = require('hpp');
const helmet = require('helmet');

dotenv.config();
const app = express(); // 이후 app.use 메서드로 express 서버에 미들웨어를 장착한다.

// 서버 실행 시 db 시퀄라이즈 연결도 같이 된다.
db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

passportConfig();

// 배포용 설정
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // combined를 사용하면 더 자세한 로그를 볼 수 있다.
  app.use(hpp()); // 필수
  app.use(helmet()); // 필수
} else {
  app.use(morgan('dev'));
}

// cors 설정
app.use(
  cors({
    origin: ['http://localhost:3026', 'nodebird.com', 'http://52.79.115.13'],
    credentials: true,
  })
);
app.use('/', express.static(path.join(__dirname, 'uploads'))); // 운영체제에 맞게 알아서 해주는 path.join을 사용해 localhost:3065/uploads에 접근할 수 있도록 해준다.
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
app.get('/', (req, res) => {
  res.send('hello express'); // 문자열 응답
});
app.get('/api', (req, res) => {
  res.send('hello api'); // 문자열 응답
});

app.use('/post', postRouter); // postRouter api path에 /post가 접두어(prefix)로 붙는다.
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(80, () => {
  console.log('서버 실행 중!');
});
