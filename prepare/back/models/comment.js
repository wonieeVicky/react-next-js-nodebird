module.exports = (sequelize, DataTypes) => {
  // MySQL에는 users 테이블 생성
  const Comment = sequelize.define(
    "Comment",
    {
      content: {
        type: DataTypes.TEXT, // 글자를 무제한으로 받는다.
        allowNull: false,
      },
      // UserId: 1,
      // PostId: 3
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", // 이모티콘까지 넣으려면 utf8mb4로 저장
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User); // 코멘트는 어떤 유저에 속해있다.
    db.Comment.belongsTo(db.Post); // 코멘트는 어떤 글에 속해있다.
  };
  return Comment;
};
