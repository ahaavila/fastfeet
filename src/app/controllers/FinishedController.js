import { parseISO } from 'date-fns';
import * as Yup from 'yup';

import Package from '../models/Package';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class FinishedController {
  /**
   * Listo as encomendas de um entregador que já foram entregues
   */
  async index(req, res) {
    const { page = 1 } = req.query;

    const packages = await Package.findAll({
      where: {
        deliveryman_id: req.params.id,
        end_date: {
          $ne: null,
        },
      },
      attributes: ['id', 'product', 'start_date', 'end_date'],
      // limito 20 registros por pagina
      limit: 20,
      // pulo de 20 em 20 registros para paginação
      offset: (page - 1) * 20,
      order: ['product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'city'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(packages);
  }

  /**
   * Atualizo a encomenda com o end_date
   */
  async update(req, res) {
    // Validando os dados de entrada
    const schema = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // Fim validação

    const { end_date, signature_id } = req.body;

    const date = parseISO(end_date);

    const packages = await Package.findByPk(req.params.id);

    const pack = await packages.update({
      end_date: date,
      signature_id,
    });

    return res.json(pack);
  }
}

export default new FinishedController();
