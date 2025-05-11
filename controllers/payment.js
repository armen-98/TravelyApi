const { Payment, PaymentMethod, BankAccount } = require('../models');

// Get payment settings
const getPaymentSettings = async (req, res) => {
  try {
    // Get payment settings
    const payment = await Payment.findOne({
      include: [
        {
          model: PaymentMethod,
          as: 'methods',
        },
        {
          model: BankAccount,
          as: 'accounts',
        },
      ],
    });

    if (!payment) {
      // Create default payment settings if not found
      const newPayment = await Payment.create({
        use: false,
        term: '',
        urlSuccess: '',
        urlCancel: '',
      });

      return res.status(200).json({
        success: true,
        data: {
          use: false,
          term_condition_page: '',
          url_success: '',
          url_cancel: '',
          list: [],
          bank_account_list: [],
        },
      });
    }

    // Format response
    const response = {
      use: payment.use,
      term_condition_page: payment.term,
      url_success: payment.urlSuccess,
      url_cancel: payment.urlCancel,
      list: payment.methods.map((method) => ({
        method: method.methodId,
        title: method.title,
        desc: method.description,
        instruction: method.instruction,
      })),
      bank_account_list: payment.accounts.map((account) => ({
        acc_name: account.name,
        acc_number: account.number,
        bank_name: account.bankName,
        bank_sort_code: account.bankCode,
        bank_iban: account.bankIban,
        bank_swift: account.bankSwift,
      })),
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment settings',
      error: error.message,
    });
  }
};

module.exports = {
  getPaymentSettings,
};
