// 生成token
const jwt = require('jsonwebtoken')
const jwtKey = 'wx' // token生成的密匙，根据自己需求定义

const jwtCheck = (req, res, next) => { // token验证函数
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  jwt.verify(token, jwtKey, (err, data) => {
    if (err) {
      res.status(401).send({ // 使用 401 状态码表示未授权
        code: 'tokenError',
        msg: 'token无效',
        data: null
      });
    } else {
      req.jwtInfo = data
      next()
    }
  })
}

module.exports = {
  jwtCheck
}
