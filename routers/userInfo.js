const express = require("express");
const { jwtCheck } = require("../utils/jwt")
const router = express.Router(); //模块化路由
const { db } = require("../dataBase");
let userCollection = db.collection('user')

router.get("/userInfo", jwtCheck, (req, res) => {
  delete req.userInfo.password
  res.send({
    code: 'ok',
    msg: '操作成功',
    data: {
      ...req.userInfo, // 仅发送解析后的 JWT 信息
      // 如果需要，可以在这里添加其他用户信息
    }
  });
});

router.post("/updateUserInfo", jwtCheck, (req, res) => {
  delete req.userInfo._id
  userCollection.updateOne({ username: req.body.username }, { $set: { ...req.userInfo, ...req.body } }).then(resp => {
    res.send({
      code: 'ok',
      msg: '操作成功',
      data: { ...req.userInfo, ...req.body }
    })
  }).catch(err => {
    res.send({
      code: 'err',
      msg: '更新失败',
      data: err
    })
  })
});

module.exports = router;
