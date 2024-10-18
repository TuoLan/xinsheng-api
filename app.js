const express = require("express");
const app = express();
const mongoose = require('mongoose')
const loginRouter = require("./routers/login");
const registerRouter = require("./routers/register");
const userInfoRouter = require("./routers/userInfo");
const orderRouter = require("./routers/order");
const uploadRouter = require("./routers/upload")
const bodyParser = require("body-parser");

mongoose.connect('mongodb://xinsheng:welcome1@81.71.49.35/xinsheng?retryWrites=true&w=majority&appName=Cluster0')

// 仅开放环境使用：允许 CORS 请求
// const cors = require("cors");
// app.use(cors({
//   origin: '*', // 允许的前端地址
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的方法
//   allowedHeaders: ['Content-Type', 'Authorization'], // 允许的头
//   credentials: true // 支持 cookie 传递等认证信息
// }));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// 路由配置
app.use("/api", loginRouter);
app.use("/api", registerRouter);
app.use("/api", userInfoRouter);
app.use("/api", orderRouter);
app.use("/api", uploadRouter)

// 启动服务器
app.listen('8889', '0.0.0.0', () => {
  console.log("服务器启动成功，监听端口 8889");
});

// 数据库连接错误处理
mongoose.connection.on('error', (err) => {
  console.log('数据库连接错误:', err);
});

// 数据库连接成功处理
mongoose.connection.on('connected', () => {
  console.log('数据库连接成功！');
});

module.exports = app;
