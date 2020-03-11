import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverys = await Deliveryman.findAll({
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverys);
  }

  async store(req, res) {
    // Validando as entradas
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    // Fim validação

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    // validando os campos do update
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    // fim validação

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    const deliverymans = await deliveryman.update(req.body);

    return res.json(deliverymans);
  }

  async destroy(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    const deliverymans = await deliveryman.destroy();
    return res.json(deliverymans);
  }
}

export default new DeliverymanController();
