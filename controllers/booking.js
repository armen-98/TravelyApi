const {
  Booking,
  BookingResource,
  Product,
  User,
  PaymentMethod,
} = require('../models');
const { Op } = require('sequelize');

// Get booking form
const getBookingForm = async (req, res) => {
  try {
    const { product_id } = req.query;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Get product
    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Format response based on booking style
    let formData = {
      price:
        product.priceDisplay || `${product.priceMin} - ${product.priceMax}`,
    };

    switch (product.bookingStyle) {
      case 'standard':
        formData = {
          ...formData,
          start_time: new Date().toISOString(),
          start_date: new Date().toISOString(),
        };
        break;

      case 'daily':
        formData = {
          ...formData,
          start_time: new Date().toISOString(),
          start_date: new Date().toISOString(),
          end_time: new Date().toISOString(),
          end_date: new Date().toISOString(),
        };
        break;

      case 'hourly':
        // Get available schedules
        formData = {
          ...formData,
          start_date: new Date().toISOString(),
          select_options: [
            { format: 'Morning', start: '08:00', end: '12:00' },
            { format: 'Afternoon', start: '13:00', end: '17:00' },
            { format: 'Evening', start: '18:00', end: '22:00' },
          ],
        };
        break;

      case 'slot':
        formData = {
          ...formData,
        };
        break;

      case 'table':
        formData = {
          ...formData,
          start_time: new Date().toISOString(),
          start_date: new Date().toISOString(),
          select_options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        };
        break;

      default:
        break;
    }

    res.status(200).json({
      success: true,
      data: formData,
    });
  } catch (error) {
    console.error('Error fetching booking form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking form',
      error: error.message,
    });
  }
};

// Calculate booking price
const calculatePrice = async (req, res) => {
  try {
    const {
      product_id,
      booking_style,
      adult,
      children,
      start_date,
      start_time,
      end_date,
      end_time,
      table_num,
    } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Get product
    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Calculate price based on booking style
    let price = Number.parseFloat(product.priceMin) || 0;
    let resources = [];

    switch (booking_style) {
      case 'standard':
        price = price * (adult || 1);
        break;

      case 'daily':
        if (start_date && end_date) {
          const startDate = new Date(start_date);
          const endDate = new Date(end_date);
          const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          price = price * days * (adult || 1);
        } else {
          price = price * (adult || 1);
        }
        break;

      case 'hourly':
        price = price * (adult || 1);
        break;

      case 'slot':
        price = price * (adult || 1);
        break;

      case 'table':
        if (table_num && Array.isArray(table_num)) {
          price = price * table_num.length;

          // Add resources for each table
          resources = table_num.map((table) => ({
            id: table,
            name: `Table ${table}`,
            qty: 1,
            total: price / table_num.length,
          }));
        } else {
          price = price;
        }
        break;

      default:
        break;
    }

    // Add child price if applicable
    if (children && children > 0) {
      price += Number.parseFloat(product.priceMin) * 0.5 * children;
    }

    res.status(200).json({
      success: true,
      data: {
        total: price,
        total_display: `$${price.toFixed(2)}`,
        currency: 'USD',
        resources,
      },
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate price',
      error: error.message,
    });
  }
};

// Create booking order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware
    const {
      product_id,
      booking_style,
      adult,
      children,
      start_date,
      start_time,
      end_date,
      end_time,
      table_num,
      payment_method,
      billing_first_name,
      billing_last_name,
      billing_phone,
      billing_email,
      billing_address_1,
    } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Get product
    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Calculate price based on booking style
    let price = Number.parseFloat(product.priceMin) || 0;
    let resources = [];

    switch (booking_style) {
      case 'standard':
        price = price * (adult || 1);
        break;

      case 'daily':
        if (start_date && end_date) {
          const startDate = new Date(start_date);
          const endDate = new Date(end_date);
          const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          price = price * days * (adult || 1);
        } else {
          price = price * (adult || 1);
        }
        break;

      case 'hourly':
        price = price * (adult || 1);
        break;

      case 'slot':
        price = price * (adult || 1);
        break;

      case 'table':
        if (table_num && Array.isArray(table_num)) {
          price = price * table_num.length;

          // Add resources for each table
          resources = table_num.map((table) => ({
            id: table,
            name: `Table ${table}`,
            qty: 1,
            total: price / table_num.length,
          }));
        } else {
          price = price;
        }
        break;

      default:
        break;
    }

    // Add child price if applicable
    if (children && children > 0) {
      price += Number.parseFloat(product.priceMin) * 0.5 * children;
    }

    // Get payment method
    let paymentMethod = null;
    if (payment_method) {
      paymentMethod = await PaymentMethod.findOne({
        where: { methodId: payment_method },
      });
    }

    // Create booking
    const booking = await Booking.create({
      title: product.title,
      date: new Date(),
      status: 'pending',
      statusColor: '#FFC107', // Yellow for pending
      paymentName: paymentMethod?.title || 'Cash',
      payment: payment_method || 'cash',
      total: price,
      currency: 'USD',
      totalDisplay: price,
      billFirstName: billing_first_name,
      billLastName: billing_last_name,
      billPhone: billing_phone,
      billEmail: billing_email,
      billAddress: billing_address_1,
      allowCancel: true,
      allowPayment: true,
      allowAccept: false,
      createdVia: 'app',
      createdBy: `${billing_first_name} ${billing_last_name}`,
      startDate: start_date ? new Date(start_date) : null,
      startTime: start_time || null,
      endDate: end_date ? new Date(end_date) : null,
      endTime: end_time || null,
      adult: adult || 0,
      children: children || 0,
      bookingStyle: booking_style,
      userId,
      productId: product_id,
      paymentMethodId: paymentMethod?.id,
    });

    // Create booking resources
    if (resources.length > 0) {
      for (const resource of resources) {
        await BookingResource.create({
          name: resource.name,
          quantity: resource.qty,
          total: resource.total,
          bookingId: booking.id,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking_id: booking.id,
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message,
    });
  }
};

// Get booking details
const getBookingDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: BookingResource,
          as: 'resources',
        },
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

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is authorized to view this booking
    if (booking.userId !== userId && booking.product.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking',
      });
    }

    // Format response
    const response = {
      booking_id: booking.id,
      title: booking.title,
      date: booking.date,
      status_name: booking.status,
      status_color: booking.statusColor,
      payment_name: booking.paymentName,
      payment: booking.payment,
      txn_id: booking.transactionID,
      total: booking.total,
      currency: booking.currency,
      total_display: `$${booking.total.toFixed(2)}`,
      billing_first_name: booking.billFirstName,
      billing_last_name: booking.billLastName,
      billing_phone: booking.billPhone,
      billing_email: booking.billEmail,
      billing_address_1: booking.billAddress,
      resources: booking.resources?.map((resource) => ({
        id: resource.id,
        name: resource.name,
        qty: resource.quantity,
        total: resource.total,
      })),
      allow_cancel: booking.allowCancel,
      allow_payment: booking.allowPayment,
      allow_accept: booking.allowAccept,
      created_on: booking.createdAt,
      paid_date: booking.paidOn,
      create_via: booking.createdVia,
      first_name: booking.user.firstName,
      last_name: booking.user.lastName,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details',
      error: error.message,
    });
  }
};

// Get booking list
const getBookingList = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: BookingResource,
          as: 'resources',
        },
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
    const formattedBookings = bookings.map((booking) => ({
      booking_id: booking.id,
      title: booking.title,
      date: booking.date,
      status_name: booking.status,
      status_color: booking.statusColor,
      payment_name: booking.paymentName,
      payment: booking.payment,
      txn_id: booking.transactionID,
      total: booking.total,
      currency: booking.currency,
      total_display: `$${booking.total.toFixed(2)}`,
      billing_first_name: booking.billFirstName,
      billing_last_name: booking.billLastName,
      billing_phone: booking.billPhone,
      billing_email: booking.billEmail,
      billing_address_1: booking.billAddress,
      resources: booking.resources?.map((resource) => ({
        id: resource.id,
        name: resource.name,
        qty: resource.quantity,
        total: resource.total,
      })),
      allow_cancel: booking.allowCancel,
      allow_payment: booking.allowPayment,
      allow_accept: booking.allowAccept,
      created_on: booking.createdAt,
      paid_date: booking.paidOn,
      create_via: booking.createdVia,
      first_name: booking.billFirstName,
      last_name: booking.billLastName,
    }));

    res.status(200).json({
      success: true,
      data: formattedBookings,
    });
  } catch (error) {
    console.error('Error fetching booking list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking list',
      error: error.message,
    });
  }
};

// Get booking request list (for product owners)
const getBookingRequestList = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    // Get products owned by user
    const products = await Product.findAll({
      where: { authorId: userId },
      attributes: ['id'],
    });

    const productIds = products.map((product) => product.id);

    // Get bookings for these products
    const bookings = await Booking.findAll({
      where: {
        productId: {
          [Op.in]: productIds,
        },
      },
      include: [
        {
          model: BookingResource,
          as: 'resources',
        },
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
      order: [['createdAt', 'DESC']],
    });

    // Format response
    const formattedBookings = bookings.map((booking) => ({
      booking_id: booking.id,
      title: booking.title,
      date: booking.date,
      status_name: booking.status,
      status_color: booking.statusColor,
      payment_name: booking.paymentName,
      payment: booking.payment,
      txn_id: booking.transactionID,
      total: booking.total,
      currency: booking.currency,
      total_display: `$${booking.total.toFixed(2)}`,
      billing_first_name: booking.billFirstName,
      billing_last_name: booking.billLastName,
      billing_phone: booking.billPhone,
      billing_email: booking.billEmail,
      billing_address_1: booking.billAddress,
      resources: booking.resources?.map((resource) => ({
        id: resource.id,
        name: resource.name,
        qty: resource.quantity,
        total: resource.total,
      })),
      allow_cancel: booking.allowCancel,
      allow_payment: booking.allowPayment,
      allow_accept: booking.allowAccept,
      created_on: booking.createdAt,
      paid_date: booking.paidOn,
      create_via: booking.createdVia,
      first_name: booking.user.firstName,
      last_name: booking.user.lastName,
    }));

    res.status(200).json({
      success: true,
      data: formattedBookings,
    });
  } catch (error) {
    console.error('Error fetching booking request list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking request list',
      error: error.message,
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is authorized to cancel this booking
    if (booking.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking',
      });
    }

    // Check if booking can be cancelled
    if (!booking.allowCancel) {
      return res.status(400).json({
        success: false,
        message: 'This booking cannot be cancelled',
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.statusColor = '#F44336'; // Red for cancelled
    booking.allowCancel = false;
    booking.allowPayment = false;
    booking.allowAccept = false;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
};

// Accept booking (for product owners)
const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is the product owner
    if (booking.product.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept this booking',
      });
    }

    // Check if booking can be accepted
    if (!booking.allowAccept) {
      return res.status(400).json({
        success: false,
        message: 'This booking cannot be accepted',
      });
    }

    // Update booking status
    booking.status = 'confirmed';
    booking.statusColor = '#4CAF50'; // Green for confirmed
    booking.allowAccept = false;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking accepted successfully',
    });
  } catch (error) {
    console.error('Error accepting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept booking',
      error: error.message,
    });
  }
};

module.exports = {
  getBookingForm,
  calculatePrice,
  createOrder,
  getBookingDetail,
  getBookingList,
  getBookingRequestList,
  cancelBooking,
  acceptBooking,
};
