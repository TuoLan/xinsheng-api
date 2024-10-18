const express = require("express");
const { jwtCheck } = require("../utils/jwt")
const router = express.Router(); //模块化路由
const Attachment = require('../models/Attachment');
const fs = require('fs')
const path = require('path')

// 文件上传路由
router.post('/upload', jwtCheck, (req, res) => {
  const { username } = req.userInfo
  const boundary = req.headers['content-type']?.split('boundary=')[1];
  if (!boundary) {
    return res.status(400).send('Invalid request: boundary not found');
  }

  const chunks = [];
  req.on('data', chunk => {
    chunks.push(chunk);
  });

  req.on('end', async () => {
    try {
      const buffer = Buffer.concat(chunks);
      const start = buffer.indexOf(`\r\n\r\n`) + 4; // 文件内容开始的位置
      const end = buffer.lastIndexOf(`\r\n--${boundary}`) - 2; // 文件内容结束的位置
      const fileBuffer = buffer.subarray(start, end);

      const filename = `upload_${Date.now()}.jpg`; // 假设文件是图片，实际应用中应解析真实文件名

      // 将文件保存到本地
      fs.writeFileSync(path.join(__dirname, '../../uploads', filename), fileBuffer);

      // 保存文件信息到数据库
      const saveData = {
        filename,
        mimetype: 'image/jpeg', // 这里假设文件类型，实际应从请求头解析
        size: fileBuffer.length
      }

      await Attachment.findOneAndUpdate(
        { username },
        { $set: saveData },
        { new: true, upsert: true }
      );
      res.send({
        code: 'ok',
        msg: '上传成功',
        data: req.protocol + '://' + req.get('host') + '/uploads/' + filename
      });
    } catch (error) {
      res.status(500).json({ message: 'Error processing file', error });
    }
  });
});

module.exports = router;
