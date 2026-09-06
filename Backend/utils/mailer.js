require('dotenv').config();

async function sendOrderConfirmation(toEmail, order) {
  const itemsHtml = (order.items || [])
    .map(item => `<li>${item.name} x ${item.quantity} — ₹${item.price}</li>`)
    .join('');

  const emailPayload = {
    sender: { name: 'MyStore', email: process.env.SENDER_EMAIL },
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
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(emailPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Email failed:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    console.log('Email sent:', data);
    return data;
  } catch (err) {
    console.error('Email failed:', err);
    throw err;
  }
}

module.exports = sendOrderConfirmation;