const brevo = require('@getbrevo/brevo');
require('dotenv').config();

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

async function sendOrderConfirmation(toEmail, order) {
  const itemsHtml = (order.items || [])
    .map(item => `<li>${item.name} x ${item.quantity} — ₹${item.price}</li>`)
    .join('');

  const sendSmtpEmail = {
    sender: { name: 'MyStore', email: process.env.SENDER_EMAIL }, // verified email
    to: [{ email: toEmail }],
    subject: `Order Confirmed — #${order._id}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #2e7d32;">Order Confirmed ✅</h2>
        <p>Hi there,</p>
        <p>Thanks for shopping with us! Your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Total: ₹${order.totalAmount}</strong></p>
        <hr />
        <p style="font-size: 12px; color: #888;">This is an automated email, please do not reply.</p>
      </div>
    `,
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent:', data);
    return data;
  } catch (err) {
    console.error('Email failed:', err.response ? err.response.body : err);
    throw err;
  }
}

module.exports = sendOrderConfirmation;