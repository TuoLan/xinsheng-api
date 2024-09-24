const express = require("express");
const { format } = require('date-fns');
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
});

module.exports = router;
