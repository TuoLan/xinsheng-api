const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router(); // 模块化路由
const User = require('../models/User');

router.post("/login", async (req, res) => {
  const { username, phoneNumber, password } = req.body;
  // 从数据库中查找用户
  const usersUser = await User.findOne({ username }).exec();
  const phonesUser = await User.findOne({ phoneNumber }).exec();
  const user = usersUser || phonesUser

  if (user) {
    // 验证密码
    if (user.password === password) {
      // 生成 token
      const token = jwt.sign({ id: user._id, username: user.username }, 'wx', { expiresIn: '30d' });
        res.send({
          code: 'ok',
          msg: '登录成功',
          data: token
        });
      } else {
        res.send({
          code: 'err',
          msg: '用户名/手机号/密码错误',
          data: null
        });
      }
    } else {
      res.send({
        code: 'err',
        msg: '用户名不存在',
        data: null
      });
  }
});

module.exports = router;
