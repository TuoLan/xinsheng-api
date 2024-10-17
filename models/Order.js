const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  bigNum: { type: Number, require: true },
  smallNum: { type: Number, require: true },
  status: { type: String, required: true },
  reservationTime: { type: Date, required: true },
  paymentType: { type: String, required: true },
  createdTime: { type: Date, required: true },
  creater: { type: Object, required: true },
  reasonDetail: { type: String, required: false },
  details: { type: String, required: false },
});

const Order = mongoose.model('order', OrderSchema, 'order');

module.exports = Order;
