const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
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
        modelName: "User",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post); // 한 사람이 여러 개의 글을 쓸 수 있다.
    db.User.hasMany(db.Comment); // 한 사람이 여러 개의 댓글을 쓸 수 있다.
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); // 사용자 - 게시글 좋아요 관계
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  }
};
