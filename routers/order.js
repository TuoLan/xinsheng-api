const express = require("express");
const { jwtCheck } = require("../utils/jwt")
const router = express.Router(); //模块化路由
const { db } = require("../dataBase");
let userCollection = db.collection('user')
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  bigNum: { type: Number, require: true },
  smallNum: { type: Number, require: true },
  status: { type: String, required: true },
  reservationTime: { type: Date, required: true },
  paymentType: { type: String, required: true },
  createdTime: { type: Date, required: true },
  creater: { type: Object, required: true }, // 确保 creater 字段的结构
  // 其他字段可以根据需要添加
});

const orderCollection = mongoose.model('order', OrderSchema, 'order');

router.get("/getOrderList", jwtCheck, async (req, res) => {
  const { username, userType } = req.userInfo
  const whereStr = userType === 'admin' ? {} : { "creater.username": username };
  const datas = await orderCollection.find(whereStr).sort({ createdTime: -1 });
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
  const datas = await orderCollection.findOne(whereStr)
  res.send({
    code: 'ok',
    msg: '操作成功',
    data: datas
  })
});

router.post("/saveOrder", jwtCheck, async (req, res) => {
  const { username } = req.userInfo;
  const { _id, ...saveBody } = req.body;

  try {
    saveBody.reservationTime = new Date(saveBody.reservationTime).toISOString();

    if (_id) {
      // TODO: 编辑
      const whereId = new mongoose.Types.ObjectId(String(_id));
      saveBody.creater._id = new mongoose.Types.ObjectId(String(saveBody.creater._id));
      saveBody.createdTime = new Date(saveBody.createdTime).toISOString();
      // 使用 findOneAndUpdate 获取更新后的文档
      const updatedOrder = await orderCollection.findOneAndUpdate(
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
      const user = await userCollection.findOne({ username });
      const currentTime = new Date()
      if (!(user.phoneNumber && user.address && user.address.detail)) {
        return res.send({
          code: 'err',
          msg: '请前往“个人中心”设置“联系方式”和“收货地址”!',
          data: null
        });
      }
      // 创建新订单
      const newOrder = new orderCollection({
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
