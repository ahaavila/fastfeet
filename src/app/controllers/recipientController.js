import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  // Método de criação do destinatário
  async store(req, res) {
    // Validando dados de usuários
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string()
        .required()
        .min(9)
        .max(9),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Crio o Destinatário
    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    // retorno os dados para o front
    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async update(req, res) {
    // Pego os dados digitados
    // const id = req.params;

    // Procuro o destinatário dentro do banco
    const recipient = await Recipient.findOne({ where: { id: req.params.id } });

    // Se ele não existir, retorno erro
    if (!recipient) {
      return res.status(401).json({ error: 'Recipient not found' });
    }

    // Se existir, edito ele
    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    // Retorno os dados para o front
    return res.json({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientController();
