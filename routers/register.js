const express = require("express");
const { db } = require("../dataBase");
const IHuyi = require("../utils/msg")
const router = express.Router(); //模块化路由
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: false },
  createTime: { type: Date, required: false },
  address: { type: Object, required: false },
  nickname: { type: String, required: false },
  phoneNumber: { type: String, required: true }
})
const VerifCodeSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  verifCode: { type: String, required: true }
})
const userCollection = mongoose.model('user', UserSchema, 'user');
const verifcodeCollection = mongoose.model('verifcode', VerifCodeSchema, 'verifcode');

router.post("/getVerifCode", async (req, res) => {
  const msgObj = new IHuyi('C76708893', '94505b752d0a28753c4a7ecace23374e')
  const { phoneNumber } = req.body
  // 生成6位随机数字验证码并保存
  const code = String(Math.floor(100000 + Math.random() * 900000))
  await verifcodeCollection.findOneAndUpdate(
    { phoneNumber },
    { verifCode: code },
    { new: true, upsert: true }
  )
  msgObj.send(phoneNumber, `您的验证码是：${code}，请尽快完成注册，如非本人操作，请忽略此短信`, () => {
    res.send({
      code: 'ok',
      msg: '发送成功',
      data: null
    })
  })
})

router.post("/register", async (req, res) => {
  const { username, phoneNumber, verifCode, password } = req.body
  const addData = {
    username,
    password,
    phoneNumber,
    userType: "person",
    createTime: new Date()
  }

  const verifCodeEntry = await verifcodeCollection.findOne({ phoneNumber });
  if (!verifCodeEntry || verifCodeEntry.verifCode !== verifCode) {
    return res.send({
      code: 'err',
      msg: '验证码错误或已过期',
      data: null,
    });
  }

  const existingUserByPhone = await userCollection.findOne({ phoneNumber: addData.phoneNumber });
  if (existingUserByPhone) {
    return res.send({
      code: 'err',
      msg: '手机号已被注册',
      data: null,
    });
  }

  //从表中查询账号
  const existingUser = await userCollection.findOne({ username: addData.username });
  if (existingUser) {
    return res.send({
      code: 'err',
      msg: '用户名已被注册',
      data: null
    });
  }

  // 插入新用户
  const newUser = await userCollection.create(addData); // 使用 create() 方法插入
  res.send({
    code: 'ok',
    msg: '注册成功',
    data: newUser
  });
});

module.exports = router;
