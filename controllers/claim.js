const { Claim, Product, User, PaymentMethod } = require('../models');

// Submit claim
const submitClaim = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      id: product_id,
      first_name: billing_first_name,
      last_name: billing_last_name,
      phone: billing_phone,
      email: billing_email,
      memo,
    } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: res.__('product_id_required'),
      });
    }

    // Get product
    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: res.__('product_not_found'),
      });
    }

    if (!product.useClaim) {
      return res.status(400).json({
        success: false,
        message: res.__('product_not_allow_claim'),
      });
    }

    // Check if user already has a claim for this product
    const existingClaim = await Claim.findOne({
      where: {
        userId,
        productId: product_id,
      },
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: res.__('has_claim'),
      });
    }

    // Get payment method
    // let paymentMethod = null;
    // if (payment_method) {
    //   paymentMethod = await PaymentMethod.findOne({
    //     where: { methodId: payment_method },
    //   });
    // }

    // Create claim
    const claim = await Claim.create({
      title: product.title,
      status: 'pending',
      address: product.address,
      statusColor: '#FFC107', // Yellow for pending
      priceDisplay:
        product.priceDisplay || `${product.priceMin} - ${product.priceMax}`,
      date: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      // paymentName: paymentMethod?.title || 'Cash',
      // payment: payment_method || 'cash',
      total: Number.parseFloat(product.priceMin) || 0,
      currency: 'USD',
      totalDisplay:
        product.priceDisplay || `${product.priceMin} - ${product.priceMax}`,
      billFirstName: billing_first_name,
      billLastName: billing_last_name,
      billPhone: billing_phone,
      billEmail: billing_email,
      // billAddress: billing_address_1,
      allowCancel: true,
      allowPayment: true,
      allowAccept: false,
      createdVia: 'app',
      createdBy: `${billing_first_name} ${billing_last_name}`,
      userId,
      productId: product_id,
      // paymentMethodId: paymentMethod?.id,
    });

    res.status(200).json({
      success: true,
      message: 'Claim submitted successfully',
      data: {
        claim_id: claim.id,
      },
    });
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit claim',
      error: error.message,
    });
  }
};

// Get claim list
const getClaimList = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const claims = await Claim.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
        },
        {
          model: PaymentMethod,
          as: 'paymentMethod',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Format response
    const formattedClaims = claims.map((claim) => ({
      claim_id: claim.id,
      title: claim.title,
      status_name: claim.status,
      address: claim.address,
      status_color: claim.statusColor,
      total_display: claim.totalDisplay,
      date: claim.date,
      due_date: claim.dueDate,
      payment_name: claim.paymentName,
      payment: claim.payment,
      txn_id: claim.transactionID,
      total: claim.total,
      currency: claim.currency,
      billing_first_name: claim.billFirstName,
      billing_last_name: claim.billLastName,
      billing_phone: claim.billPhone,
      billing_email: claim.billEmail,
      billing_address_1: claim.billAddress,
      allow_cancel: claim.allowCancel,
      allow_payment: claim.allowPayment,
      allow_accept: claim.allowAccept,
      created_on: claim.createdAt,
      paid_date: claim.paidOn,
      create_via: claim.createdVia,
      first_name: claim.billFirstName,
      last_name: claim.billLastName,
    }));

    res.status(200).json({
      success: true,
      data: formattedClaims,
    });
  } catch (error) {
    console.error('Error fetching claim list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch claim list',
      error: error.message,
    });
  }
};

// Get claim details
const getClaimDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const claim = await Claim.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'product',
        },
        {
          model: User,
          as: 'user',
        },
        {
          model: PaymentMethod,
          as: 'paymentMethod',
        },
      ],
    });

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Check if user is authorized to view this claim
    if (claim.userId !== userId && claim.product.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this claim',
      });
    }

    // Format response
    const response = {
      claim_id: claim.id,
      title: claim.title,
      status_name: claim.status,
      address: claim.address,
      status_color: claim.statusColor,
      total_display: claim.totalDisplay,
      date: claim.date,
      due_date: claim.dueDate,
      payment_name: claim.paymentName,
      payment: claim.payment,
      txn_id: claim.transactionID,
      total: claim.total,
      currency: claim.currency,
      billing_first_name: claim.billFirstName,
      billing_last_name: claim.billLastName,
      billing_phone: claim.billPhone,
      billing_email: claim.billEmail,
      billing_address_1: claim.billAddress,
      allow_cancel: claim.allowCancel,
      allow_payment: claim.allowPayment,
      allow_accept: claim.allowAccept,
      created_on: claim.createdAt,
      paid_date: claim.paidOn,
      create_via: claim.createdVia,
      first_name: claim.user.firstName,
      last_name: claim.user.lastName,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching claim details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch claim details',
      error: error.message,
    });
  }
};

// Pay claim
const payClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const claim = await Claim.findByPk(id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Check if user is authorized to pay this claim
    if (claim.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to pay this claim',
      });
    }

    // Check if claim can be paid
    if (!claim.allowPayment) {
      return res.status(400).json({
        success: false,
        message: 'This claim cannot be paid',
      });
    }

    // Update claim status
    claim.status = 'paid';
    claim.statusColor = '#4CAF50'; // Green for paid
    claim.allowPayment = false;
    claim.paidOn = new Date();
    claim.transactionID = `TXN-${Date.now()}`;

    await claim.save();

    res.status(200).json({
      success: true,
      message: 'Claim paid successfully',
    });
  } catch (error) {
    console.error('Error paying claim:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pay claim',
      error: error.message,
    });
  }
};

// Cancel claim
const cancelClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const claim = await Claim.findByPk(id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Check if user is authorized to cancel this claim
    if (claim.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this claim',
      });
    }

    // Check if claim can be cancelled
    if (!claim.allowCancel) {
      return res.status(400).json({
        success: false,
        message: 'This claim cannot be cancelled',
      });
    }

    // Update claim status
    claim.status = 'cancelled';
    claim.statusColor = '#F44336'; // Red for cancelled
    claim.allowCancel = false;
    claim.allowPayment = false;
    claim.allowAccept = false;

    await claim.save();

    res.status(200).json({
      success: true,
      message: 'Claim cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling claim:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel claim',
      error: error.message,
    });
  }
};

// Accept claim (for product owners)
const acceptClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const claim = await Claim.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
    });

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Check if user is the product owner
    if (claim.product.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept this claim',
      });
    }

    // Check if claim can be accepted
    if (!claim.allowAccept) {
      return res.status(400).json({
        success: false,
        message: 'This claim cannot be accepted',
      });
    }

    // Update claim status
    claim.status = 'accepted';
    claim.statusColor = '#4CAF50'; // Green for accepted
    claim.allowAccept = false;

    await claim.save();

    // Update product claim verification
    await Product.update(
      { claimVerified: true },
      { where: { id: claim.productId } },
    );

    res.status(200).json({
      success: true,
      message: 'Claim accepted successfully',
    });
  } catch (error) {
    console.error('Error accepting claim:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept claim',
      error: error.message,
    });
  }
};

module.exports = {
  submitClaim,
  getClaimList,
  getClaimDetail,
  payClaim,
  cancelClaim,
  acceptClaim,
};
