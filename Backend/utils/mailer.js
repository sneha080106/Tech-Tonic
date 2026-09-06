// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection on startup (optional but helpful for debugging)
transporter.verify((error) => {
  if (error) {
    console.error('Mailer config error:', error);
  } else {
    console.log('Mailer is ready to send emails');
  }
});

async function sendOrderConfirmation(toEmail, order) {
  const itemsHtml = order.items
    .map(item => `<li>${item.name} x ${item.quantity} — ₹${item.price}</li>`)
    .join('');

  const mailOptions = {
    from: `"MyStore" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Order Confirmed — #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #2e7d32;">Order Confirmed ✅</h2>
        <p>Hi there,</p>
        <p>Thanks for shopping with us! Your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Total: ₹${order.totalAmount}</strong></p>
        <p>We'll notify you again once it ships.</p>
        <hr />
        <p style="font-size: 12px; color: #888;">This is an automated email, please do not reply.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
  return info;
}

module.exports = sendOrderConfirmation;