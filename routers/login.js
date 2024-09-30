const express = require("express");
const { db } = require("../dataBase");
let userCollection = db.collection('user')
//引入生成token
const jwt = require('jsonwebtoken')
const router = express.Router(); //模块化路由

router.post("/login", (req, res) => {
  const { username, password } = req.body
  const addData = {
    username,
    password,
    createTime: new Date()
  }
  //从表中查询账号
  userCollection.findOne({ username: addData.username }, (err, data) => {
    if (data) {
      if (data.password === password) {
        let token = jwt.sign(data, 'wx', { expiresIn: '1h' });
        res.send({
          code: 'ok',
          msg: '登陆成功',
          data: token
        })
      } else {
        res.send({
          code: 'err',
          msg: '用户名/密码错误',
          data: err
        })
      }
    } else {
      res.send({
        code: 'err',
        msg: '用户名不存在',
        data: err
      })
    }
  })
});

module.exports = router;
