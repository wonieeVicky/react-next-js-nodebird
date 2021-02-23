const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development"; // 환경변수 설정 - 배포할 땐 Production으로 바꿔준다.
const config = require("../config/config")[env];
const db = {};

// sequelize가 mysql2라는 드라이브에 아래 config정보를 넣어줘서 Node와 MySQL을 연결해준다.
const sequelize = new Sequelize(config.database, config.username, config.password, config);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
