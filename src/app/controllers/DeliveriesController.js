// import * as Yup from 'yup';
import { parseISO } from 'date-fns';

import Package from '../models/Package';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import DeliveryProblem from '../models/DeliveryProblem';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveriesController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const packages = await Package.findAll({
      where: {
        deliveryman_id: req.params.id,
        start_date: null,
        canceled_at: null,
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

  async update(req, res) {
    const { start_date } = req.body;

    const hourStart = parseISO(start_date);

    const packages = await Package.findByPk(req.params.id);

    const pack = await packages.update({
      start_date: hourStart,
    });

    return res.json(pack);
  }

  async delete(req, res) {
    const { package_id } = await DeliveryProblem.findByPk(req.params.id);

    if (!package_id) {
      return res.status(400).json({ Error: 'Package does not found' });
    }

    const packages = await Package.findOne({
      where: {
        id: package_id,
      },
    });

    packages.canceled_at = new Date();

    await packages.save();

    const { name, email } = await Deliveryman.findOne({
      where: {
        id: packages.deliveryman_id,
      },
    });

    // Enviando email
    await Queue.add(CancellationMail.key, {
      name,
      email,
      product: packages.product,
    });

    return res.json({ ok: true });
  }
}

export default new DeliveriesController();
