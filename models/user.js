const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
      },
      password: {
        type: Sequelize.STRING(255),
      },
      provider: {
        type: Sequelize.STRING(255),
        defaultValue: 'local',
      },
      role: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
        // 0 : 이메일 발송
        // 1 : 일반 사용자
        // 2 : 관리자
      },
      channelId: {
        type: Sequelize.STRING(255),
      },
      signupToken: {
        type: Sequelize.TEXT,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  
};