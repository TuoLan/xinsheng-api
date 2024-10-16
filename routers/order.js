const express = require("express");
const { jwtCheck } = require("../utils/jwt")
const paginate = require("../utils/paginationHelper")
const router = express.Router(); //模块化路由
const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order')

router.get("/getOrderList", jwtCheck, async (req, res) => {
  const { page, pageSize, status } = req.query
  const { username, userType } = req.userInfo
  let whereStr = {}
  if (!status || status === 'all') {
    whereStr = userType === 'admin' ? {} : { "creater.username": username };
  } else {
    whereStr = userType === 'admin' ? { status } : { "creater.username": username, status };
  }
  const datas = await paginate(Order, page, pageSize, whereStr, { createdTime: -1 });
  // const datas = await Order.find(whereStr).sort({ createdTime: -1 });
  res.send({
    code: 'ok',
    msg: '操作成功',
    data: datas
  })
});

router.get("/getOrderDetail", jwtCheck, async (req, res) => {
  const { id } = req.query
  const whereId = new mongoose.Types.ObjectId(id);
  const whereStr = { "_id": whereId };
  const datas = await Order.findOne(whereStr)
  res.send({
    code: 'ok',
    msg: '操作成功',
    data: datas
  })
});

router.post("/saveOrder", jwtCheck, async (req, res) => {
  const { username } = req.userInfo;
  const { _id, ...saveBody } = req.body;
  let sumNum = saveBody.smallNum + saveBody.bigNum

  if (sumNum < 20) {
    return res.send({
      code: 'err',
      msg: '货值总和(大杯+小杯)需大于等于20杯!',
      data: null
    });
  }

  if ((new Date()) > (new Date(saveBody.reservationTime)) && saveBody.status === 'ordered') {
    return res.send({
      code: 'err',
      msg: '预约配送时间超过当前时间，请修改！',
      data: null
    });
  }
  try {
    saveBody.reservationTime = new Date(saveBody.reservationTime).toISOString();

    if (_id) {
      // TODO: 编辑
      const whereId = new mongoose.Types.ObjectId(String(_id));
      saveBody.creater._id = new mongoose.Types.ObjectId(String(saveBody.creater._id));
      saveBody.createdTime = new Date(saveBody.createdTime).toISOString();
      // 使用 findOneAndUpdate 获取更新后的文档
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: whereId },
        { $set: saveBody },
        { new: true } // 返回更新后的文档
      );

      if (!updatedOrder) {
        return res.send({
          code: 'err',
          msg: '订单更新失败',
          data: null
        });
      }

      res.send({
        code: 'ok',
        msg: '操作成功',
        data: updatedOrder
      });
    } else {
      // TODO: 新增
      // 查找用户
      const user = await User.findOne({ username });
      const currentTime = new Date()
      if (!(user.phoneNumber && user.address && user.address.detail)) {
        return res.send({
          code: 'err',
          msg: '请前往“个人中心”设置“联系方式”和“收货地址”!',
          data: null
        });
      }
      // 创建新订单
      const newOrder = new Order({
        ...saveBody,
        creater: user,
        createdTime: currentTime.toISOString()
      });

      const result = await newOrder.save();

      if (!result) {
        return res.send({
          code: 'err',
          msg: '订单创建失败',
          data: null
        });
      }

      res.send({
        code: 'ok',
        msg: '操作成功',
        data: result
      });
    }
  } catch (err) {
    console.error("订单保存出错:", err);
    res.send({
      code: 'err',
      msg: '操作失败',
      data: err
    });
  }
});



module.exports = router;
