const Sequelize = require('sequelize');
module.exports = class Video extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(255),
      },
      thumbnails: {
        type: Sequelize.STRING(255),
      },
      channelId: {
        type: Sequelize.STRING(255),
      },
      channelTitle: {
        type: Sequelize.STRING(255),
      },
      description: {
        type: Sequelize.STRING(255),
      },
      url: {
        type: Sequelize.STRING(255),
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Video',
      tableName: 'videos',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
};