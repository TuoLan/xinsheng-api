// 生成token
const jwt = require('jsonwebtoken')
const jwtKey = 'wx' // token生成的密匙，根据自己需求定义
const { db } = require("../dataBase");
let userCollection = db.collection('user')

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
      userCollection.findOne({ username: data.username }, (resErr, resData) => {
        if (resData) {
          req.userInfo = resData
        } else {
          req.userInfo = data
        }
        next()
      })
    }
  })
}

module.exports = {
  jwtCheck
}
