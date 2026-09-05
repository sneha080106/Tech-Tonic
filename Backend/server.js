const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const sendOrderConfirmation = require('./utils/mailer');

const app = express();

app.use(cors());
app.use(express.json());

// Frontend ki static files serve karo
app.use(express.static(path.join(__dirname, '../Frontend')));

// Order API route
app.post('/api/orders', async (req, res) => {
  try {
    const { email, paymentMethod, items, totalAmount } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const order = {
      _id: 'ORD' + Date.now(),
      email,
      paymentMethod,
      items,
      totalAmount,
    };

    sendOrderConfirmation(email, order)
      .then(() => console.log('Confirmation email sent to', email))
      .catch(err => console.error('Email failed:', err.message));

    res.status(201).json({ success: true, message: 'Order placed', order });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Koi bhi route jo API na ho, index.html serve karo (fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));