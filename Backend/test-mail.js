// test-mail.js
const sendOrderConfirmation = require('./utils/mailer');

sendOrderConfirmation('yourtestemail@gmail.com', {
  _id: 'TEST123',
  items: [{ name: 'T-Shirt', quantity: 2, price: 499 }],
  totalAmount: 998,
}).then(() => console.log('Done')).catch(console.error);