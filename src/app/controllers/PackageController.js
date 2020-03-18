import * as Yup from 'yup';

// import Notification from '../schemas/Notification';

import Package from '../models/Package';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Signature from '../models/Signature';
import File from '../models/File';

import PackageMail from '../jobs/PackageMail';
import Queue from '../../lib/Queue';

class PackageController {
  /**
   * Listando os Pacotes
   */
  async index(req, res) {
    const { page = 1 } = req.query;

    const packages = await Package.findAll({
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
        {
          model: Signature,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    return res.json(packages);
  }

  /**
   * Criando Pacotes
   */
  async store(req, res) {
    // Validando os dados de entrada
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // Fim validação

    const { recipient_id, deliveryman_id, product } = req.body;

    // Checando se existe o destinatário
    const checkRecipientExists = await Recipient.findOne({
      where: {
        id: recipient_id,
      },
    });

    if (!checkRecipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }
    // Fim

    // Checando se existe o Entregador
    const checkDeliverymanExists = await Deliveryman.findOne({
      where: {
        id: deliveryman_id,
      },
    });

    if (!checkDeliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }
    // Fim

    // Criando o pacote
    const packages = await Package.create({
      recipient_id,
      deliveryman_id,
      product,
    });
    // Fim

    /**
     * Notificando o prestador de serviços
     */

    const { name, email } = await Deliveryman.findByPk(deliveryman_id);

    const customer = await Recipient.findByPk(recipient_id);

    // Enviando email
    await Queue.add(PackageMail.key, {
      name,
      email,
      product,
      customer,
    });
    // Fim

    return res.json(packages);
  }

  async update(req, res) {
    return res.json();
  }

  async destroy(req, res) {
    return res.json();
  }
}

export default new PackageController();
