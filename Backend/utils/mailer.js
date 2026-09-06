const SibApiV3Sdk = require('@getbrevo/brevo');
require('dotenv').config();

let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendOrderConfirmation(toEmail, order) {
  const itemsHtml = (order.items || [])
    .map(item => `<li>${item.name} x ${item.quantity} — ₹${item.price}</li>`)
    .join('');

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = { name: 'MyStore', email: process.env.SENDER_EMAIL };
  sendSmtpEmail.to = [{ email: toEmail }];
  sendSmtpEmail.subject = `Order Confirmed — #${order._id}`;
  sendSmtpEmail.htmlContent = `
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
  `;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent:', data);
    return data;
  } catch (err) {
    console.error('Email failed:', err);
    throw err;
  }
}

module.exports = sendOrderConfirmation;