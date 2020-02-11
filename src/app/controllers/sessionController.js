import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  // Método para criação de Session
  async store(req, res) {
    // Validando os dados de entrada de Session
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Pego os dados do body
    const { email, password } = req.body;

    // Procuro por um usuário no BD que tenha o email digitado
    const user = await User.findOne({ where: { email } });

    // Se não tiver, retorna erro
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Se o password for incorreto, retorna erro
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // Se o usuario foi encontrado e a senha bateu, eu então gero o token
    const { id, name } = user;

    // Retorno os dados para o front
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
