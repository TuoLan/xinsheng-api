const express = require("express");
const { jwtCheck } = require("../utils/jwt")
const router = express.Router(); //模块化路由

router.get("/userInfo", jwtCheck, (req, res) => {
  res.send({
    code: 'ok',
    msg: '操作成功',
    data: {
      ...req.jwtInfo, // 仅发送解析后的 JWT 信息
      // 如果需要，可以在这里添加其他用户信息
    }
  });
});

module.exports = router;
