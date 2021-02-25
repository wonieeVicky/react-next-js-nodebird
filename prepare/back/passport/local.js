const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // login 전략을 세운다.
          // 1. 이메일이 있는지 확인
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            // done으로 성공여부의 결과를 판단해준다.(서버 에러, 성공, 클라이언트 에러)
            return done(null, false, { reason: "존재하지 않는 이메일입니다!" });
          }

          // 2. 비밀번호 확인
          const result = await bcrypt.compare(password, user.password);

          if (result) {
            // 3. 성공 처리
            return done(null, user);
          }

          // 4. 비밀번호 실패 여부 alert
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          // 5. 서버에러일 경우 첫번째 인자에 error를 넣어준다.
          return done(error);
        }
      }
    )
  );
};
