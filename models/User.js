// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: false },
  createTime: { type: Date, required: false, default: Date.now }, // 添加默认值
  address: { type: Object, required: false },
  nickname: { type: String, required: false },
  phoneNumber: { type: String, required: true },
  businessLicense: { type: String, require: false }
});

const User = mongoose.model('User', UserSchema, 'user'); // 使用 'User' 作为模型名称

module.exports = User;
