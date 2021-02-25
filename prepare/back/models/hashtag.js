module.exports = (sequelize, DataTypes) => {
  // MySQL에는 users 테이블 생성
  const Hashtag = sequelize.define(
    "Hashtag",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", // 이모티콘까지 넣으려면 utf8mb4로 저장
    }
  );
  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" }); // 하나의 해시태그는 여러개의 글을 가짐
  };
  return Hashtag;
};
