exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); // 원래 next는 에러를 처리하기 위해 사용하였으나, 다음 미들웨어로 가기 위해서 사용하기도 한다.
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인하지 않은 사용자만 접근 가능합니다.");
  }
};
