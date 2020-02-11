import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  // Método para criar um usuário
  async store(req, res) {
    // Validando dados de usuários
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Procuro se já existe um usuário com o email digitado
    const userExists = await User.findOne({ where: { email: req.body.email } });

    // Se existir, retorno erro
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // Se não existir, crio o usuario
    const { id, name, email } = await User.create(req.body);

    // Retorno os dados para o Front
    return res.json({ id, name, email });
  }

  // Método para editar um usuário
  async update(req, res) {
    // Validados os dados de edição de usuário
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Pego os dados digitados
    const { email, oldPassword } = req.body;

    // Procuro por um usuário no BD que tenha o ID que está no token
    const user = await User.findByPk(req.userId);

    // Se o email for digitado e se o email for diferente do email do banco
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      // Se existir o usuário já existir eu retorno erro
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // Se o usuario digitar a senha antiga e se a senha antiga for diferente da senha atual
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not mathc ' });
    }

    // faço o Update no usuario
    const { id, name } = await user.update(req.body);

    // Retorno os dados pro Front
    return res.json({ id, name, email });
  }
}

export default new UserController();
