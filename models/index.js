const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Video = require('./video');
const MyBox = require('./mybox');

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.Video = Video;
db.MyBox = MyBox;

User.init(sequelize);
Video.init(sequelize);
MyBox.init(sequelize);

///User.associate(db);
//MyBox.associate(db);
//Video.associate(db);

module.exports = db;
