module.exports = (sequelize, DataTypes) => {
  // MySQL에는 users 테이블 생성
  const Post = sequelize.define(
    "Post",
    {
      content: {
        type: DataTypes.TEXT, // 글자를 무제한으로 받는다.
        allowNull: false,
      },
      // RetweetId
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", // 이모티콘까지 넣으려면 utf8mb4로 저장
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment); // 작성 글은 여러 코멘트를 가지고 있다.
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag); // 하나의 게시글은 여러개의 해시태그를 가짐
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // 사용자 - 게시글 좋아요 관계
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // 리트윗 관계: 어떤 게시글이 어떤 게시글의 리트윗 게시글
  };
  return Post;
};
