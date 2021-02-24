module.exports = (sequelize, DataTypes) => {
  // MySQL에는 users 테이블 생성
  const Comment = sequelize.define(
    "Comment",
    {
      content: {
        type: DataTypes.TEXT, // 글자를 무제한으로 받는다.
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", // 이모티콘까지 넣으려면 utf8mb4로 저장
    }
  );
  Comment.associate = (db) => {};
  return Comment;
};
