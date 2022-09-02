const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Stat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'uid' });
    }
  }
  Stat.init({
    uid: DataTypes.INTEGER,
    correct_answers: DataTypes.INTEGER,
    wrong_answers: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Stat',
  });
  return Stat;
};
