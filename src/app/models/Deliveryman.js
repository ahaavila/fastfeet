import Sequelize, { Model } from 'sequelize';

class Deliveryman extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  // Função que vai fazer o relacionamento entre o Deliveryman e o File models
  static associate(models) {
    // relacionamento que o models User pertence ao models File, atraves da foreing key avatar_id
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default Deliveryman;
