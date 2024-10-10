const express = require("express");
const { mongoose } = require("./dataBase");
const loginRouter = require("./routers/login");
const registerRouter = require("./routers/register");
const userInfoRouter = require("./routers/userInfo");
const orderRouter = require("./routers/order");

const app = express();

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  //res.header('Access-Control-Allow-Headers',"token", 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", loginRouter); // 注入登录路由模块
app.use("/api", registerRouter);
app.use("/api", userInfoRouter);
app.use("/api", orderRouter);

app.listen('8889', '0.0.0.0', () => {
  console.log("启动成功")
})

// 连接错误
mongoose.connection.on('error', (err) => {
  console.log('数据库连接错误:', err);
});

// 连接成功
mongoose.connection.on('connected', () => {
  console.log('数据库连接成功！');
});

module.exports = app;
