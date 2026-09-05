const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sendOrderConfirmation = require('./utils/mailer');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/orders', async (req, res) => {
  try {
    const { email, paymentMethod, items, totalAmount } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Abhi database nahi hai, toh temporary Order ID bana rahe hain
    const order = {
      _id: 'ORD' + Date.now(),
      email,
      paymentMethod,
      items,
      totalAmount,
    };

    // Email bhejo
    sendOrderConfirmation(email, order)
      .then(() => console.log('Confirmation email sent to', email))
      .catch(err => console.error('Email failed:', err.message));

    res.status(201).json({ success: true, message: 'Order placed', order });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));