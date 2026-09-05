// controllers/orderController.js
const sendOrderConfirmation = require('../utils/mailer');
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);

    // Fire and forget — don't make the user wait on email sending
    sendOrderConfirmation(req.body.email, order)
      .then(() => console.log('Confirmation email sent'))
      .catch(err => console.error('Failed to send email:', err.message));

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};