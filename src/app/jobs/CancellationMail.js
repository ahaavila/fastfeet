import Mail from '../../lib/Mail';

class PackageMain {
  get key() {
    return 'CancellationMail';
  }

  // Vai ser chamado para o envio de cada email
  async handle({ data }) {
    const { name, email, product } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Mercadoria Cancelada',
      template: 'cancellation',
      context: {
        name,
        product,
      },
    });
  }
}

export default new PackageMain();
