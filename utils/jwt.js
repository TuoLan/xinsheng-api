// 生成token
const jwt = require('jsonwebtoken')
const jwtKey = 'wx' // token生成的密匙，根据自己需求定义
const User = require('../models/User');

const jwtCheck = (req, res, next) => { // token验证函数
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  jwt.verify(token, jwtKey, async (err, data) => {
    if (err) {
      res.status(401).send({ // 使用 401 状态码表示未授权
        code: 'tokenError',
        msg: 'token无效',
        data: null
      });
    } else {
      const user = await User.findOne({ username: data.username });
      if (user) {
        req.userInfo = user
      } else {
        req.userInfo = data
      }
      next()
    }
  })
}

module.exports = {
  jwtCheck
}
