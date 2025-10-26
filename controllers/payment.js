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

// Confirm subscription and set user pro status
const { Subscription, User } = require('../models');

const confirmSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const {
      transactionId,
      productId,
      platform,
      plan,
      price,
      currency,
      purchaseDate,
      expiryDate,
      status = 'active',
      rawReceipt,
    } = req.body || {};

    if (!transactionId) {
      return res
        .status(400)
        .json({ success: false, message: 'transactionId is required' });
    }

    // Upsert subscription by transactionId
    let subscription = await Subscription.findOne({ where: { transactionId } });
    if (subscription) {
      await subscription.update({
        userId,
        productId,
        platform,
        plan,
        price,
        currency,
        purchaseDate,
        expiryDate,
        status,
        rawReceipt,
      });
    } else {
      subscription = await Subscription.create({
        userId,
        transactionId,
        productId,
        platform,
        plan,
        price,
        currency,
        purchaseDate,
        expiryDate,
        status,
        rawReceipt,
      });
    }

    // Set user as pro
    const user = await User.findByPk(userId);
    if (user) {
      user.isPro = true;
      await user.save();
    }

    return res
      .status(200)
      .json({ success: true, data: { subscription, user } });
  } catch (error) {
    console.error('confirmSubscription error', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to confirm subscription' });
  }
};

const failSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { transactionId, rawReceipt, productId, platform, plan } =
      req.body || {};
    if (!transactionId) {
      return res
        .status(400)
        .json({ success: false, message: 'transactionId is required' });
    }

    const subscription = await Subscription.create({
      userId: userId || null,
      transactionId,
      productId,
      platform,
      plan,
      status: 'failed',
      rawReceipt,
    });

    return res.status(200).json({ success: true, data: { subscription } });
  } catch (error) {
    console.error('failSubscription error', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to save failed subscription' });
  }
};

module.exports = {
  getPaymentSettings,
  confirmSubscription,
  failSubscription,
};
