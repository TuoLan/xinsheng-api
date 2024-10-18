const express = require("express");
const { jwtCheck } = require("../utils/jwt")
const router = express.Router(); //模块化路由
const User = require('../models/User');

router.get("/userInfo", jwtCheck, (req, res) => {
  delete req.userInfo.password
  res.send({
    code: 'ok',
    msg: '操作成功',
    data: req.userInfo
  });
});

router.post("/updateUserInfo", jwtCheck, (req, res) => {
  delete req.userInfo._id
  delete req.body._id
  if (req.body.businessLicense) req.body.userType = 'merchant'
  const saveDatas = Object.assign(req.userInfo, req.body)
  User.updateOne({ username: req.body.username }, { $set: saveDatas }).then(resp => {
    res.send({
      code: 'ok',
      msg: '操作成功',
      data: saveDatas
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
