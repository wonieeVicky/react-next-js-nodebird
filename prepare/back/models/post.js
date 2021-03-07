module.exports = (sequelize, DataTypes) => {
  // MySQL에는 users 테이블 생성
  const Post = sequelize.define(
    "Post",
    {
      content: {
        type: DataTypes.TEXT, // 글자를 무제한으로 받는다.
        allowNull: false, // 어떤 값이든 들어있어야 한다.
      },
      // RetweetId
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci", // 이모티콘까지 넣으려면 utf8mb4로 저장
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImages, post.getImages
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addRetweet
  };
  return Post;
};
