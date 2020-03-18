import Mail from '../../lib/Mail';

class PackageMain {
  get key() {
    return 'PackageMail';
  }

  // Vai ser chamado para o envio de cada email
  async handle({ data }) {
    const { name, email, product, customer } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Mercadoria pronta para ser retirada',
      template: 'createPackage',
      context: {
        name,
        product,
        customer: customer.name,
        street: customer.street,
        number: customer.number,
        complement: customer.complement,
        state: customer.state,
      },
    });
  }
}

export default new PackageMain();
