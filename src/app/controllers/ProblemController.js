import DeliveryProblem from '../models/DeliveryProblem';
import Package from '../models/Package';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const problems = await DeliveryProblem.findAll({
      attributes: ['id', 'description'],
      // limito 20 registros por pagina
      limit: 20,
      // pulo de 20 em 20 registros para paginação
      offset: (page - 1) * 20,
      include: [
        {
          model: Package,
          as: 'package',
          attributes: ['id', 'product'],
        },
      ],
    });
    return res.json(problems);
  }
}

export default new DeliveryProblemController();
