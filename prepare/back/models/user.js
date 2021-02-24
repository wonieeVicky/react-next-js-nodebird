module.exports = (sequelize, DataTypes) => {
  // MySQL에는 users 테이블 생성
  const User = sequelize.define(
    "User",
    {
      // id가 기본적으로 들어있다.(MySQL에서 자동으로 넣어준다.)
      // 하위 key, value가 각각의 컬럼들에 대한 정보이다.
      // 데이터 타입은 주로 INTEGER, FLOAT, TEXT, BOOLEAN, DATETIME를 사용한다.
      email: {
        type: DataTypes.STRING(30), // 30글자 이내의 문자
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30), // 30글자 이내의 문자
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100), // 비밀번호는 암호화하므로 길이를 길게 잡는다.
        allowNull: false, // 필수
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // charset, collate 설정으로 한글 저장 활성화
    }
  );
  User.associate = (db) => {};
  return User;
};
