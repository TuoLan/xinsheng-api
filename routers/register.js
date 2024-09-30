const express = require("express");
const { db } = require("../dataBase");
let userCollection = db.collection('user')
const router = express.Router(); //模块化路由

router.post("/register", (req, res) => {
  const { username, password } = req.body
  const addData = {
    username,
    password,
    createTime: new Date()
  }

  //从表中查询账号
  userCollection.findOne({ username: addData.username }, (err, data) => {
    if (data) {
      res.send({
        code: 'err',
        msg: '用户名已注册',
        data: null
      })
    } else {
      userCollection.insertOne(addData, (err, result) => {
        if (result) {
          res.send({
            code: 'ok',
            msg: '注册成功',
            data: result
          })
        } else {
          res.send({
            code: 'err',
            msg: '注册失败',
            data: err
          })
        }
      })
    }
  })
});

module.exports = router;
