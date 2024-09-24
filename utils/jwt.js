// 生成token
const jwt = require('jsonwebtoken')
const jwtKey = 'wx' // token生成的密匙，根据自己需求定义

const jwtSign = (data) => { // token生成函数，有效时间为一个小时
  const token = jwt.sign(data, jwtKey, { expiresIn: 10 * 1 })
  return token
}

const jwtCheck = (req, res, next) => { // token验证函数
  const token = req.headers.token
  jwt.verify(token, jwtKey, (err, data) => {
    if (err) {
      res.send({
        code: 'err',
        msg: 'token无效',
        data: null
      })
    } else {
      req.jwtInfo = data
      next()
    }
  })
}

module.exports = {
  jwtSign,
  jwtCheck
}
