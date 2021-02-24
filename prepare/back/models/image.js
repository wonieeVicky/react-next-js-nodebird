module.exports = (sequelize, DataTypes) => {
  // MySQL에는 users 테이블 생성
  const Image = sequelize.define(
    "Image",
    {
      src: {
        type: DataTypes.STRING(200), // URL이 길어질 수 있으므로 200자로 잡는다.
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  Image.associate = (db) => {};
  return Image;
};
