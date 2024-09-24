const express = require("express");

const router = express.Router(); //模块化路由

router.post("/login", (req, res) => {
  const { username, password } = req.body
  console.log(req);
  res.send({
    code: 'err',
    msg: 'test',
    data: { username, password }
  })

});

module.exports = router;
