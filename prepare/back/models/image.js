const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Image extends Model {
  static init(sequelize) {
    return super.init(
      {
        src: {
          type: DataTypes.STRING(200), // URL이 길어질 수 있으므로 200자로 잡는다.
          allowNull: false,
        },
      },
      {
        modelName: "Image",
        tableName: "images",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static associate(db) {
    db.Image.belongsTo(db.Post);
  }
};
