module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert payment
    const payments = await queryInterface.bulkInsert(
      'Payments',
      [
        {
          use: true,
          term: 'By proceeding with the payment, you agree to our terms and conditions.',
          urlSuccess: '/payment/success',
          urlCancel: '/payment/cancel',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true },
    );

    // Get payment ID
    const paymentId = payments[0].id;

    // Insert payment methods
    await queryInterface.bulkInsert('PaymentMethods', [
      {
        methodId: 'stripe',
        title: 'Credit Card (Stripe)',
        description: 'Pay securely with your credit card via Stripe',
        instruction: 'Enter your card details to complete the payment',
        paymentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        methodId: 'paypal',
        title: 'PayPal',
        description: 'Pay securely with your PayPal account',
        instruction: 'You will be redirected to PayPal to complete the payment',
        paymentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        methodId: 'bank_transfer',
        title: 'Bank Transfer',
        description: 'Pay via bank transfer',
        instruction:
          'Please transfer the amount to our bank account and provide the transaction ID',
        paymentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        methodId: 'cash',
        title: 'Cash on Arrival',
        description: 'Pay with cash when you arrive',
        instruction: 'No advance payment needed. Pay when you arrive.',
        paymentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert bank accounts
    return queryInterface.bulkInsert('BankAccounts', [
      {
        name: 'Listar Inc.',
        number: '1234567890',
        bankName: 'Bank of America',
        bankCode: 'BOFA',
        bankIban: 'US1234567890',
        bankSwift: 'BOFAUS3N',
        paymentId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('BankAccounts', null, {});
    await queryInterface.bulkDelete('PaymentMethods', null, {});
    return queryInterface.bulkDelete('Payments', null, {});
  },
};
