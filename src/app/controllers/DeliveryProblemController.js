import DeliveryProblem from '../models/DeliveryProblem';
import Package from '../models/Package';

class DeliveryProblemController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      where: {
        package_id: req.params.id,
      },
      attributes: ['id', 'description'],
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

  async store(req, res) {
    const { description } = req.body;

    const problems = await DeliveryProblem.create({
      package_id: req.params.id,
      description,
    });
    return res.json(problems);
  }
}

export default new DeliveryProblemController();
