const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  // id 값을 매칭하여 세션 유지
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 로그인 성공 후 deserializeUser가 매번 실행, 유저 정보를 DB에서 복구한다.
  // 실제 상세 데이터를 가져와야할 때 상위 done(null, user.id)를 아래의 deserializeUser에서 처리
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  local();
};
