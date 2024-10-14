const express = require("express");
const { mongoose } = require("./dataBase");
const loginRouter = require("./routers/login");
const registerRouter = require("./routers/register");
const userInfoRouter = require("./routers/userInfo");
const orderRouter = require("./routers/order");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

// CORS 配置，允许多个来源
const allowedOrigins = ['http://localhost:5173', 'http://175.178.215.129'];

app.use(cors({
  origin: function (origin, callback) {
    // 如果请求来源在 allowedOrigins 列表中，或者没有来源（例如本地开发时的非浏览器请求），则允许
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // 如果你需要支持 cookie 等凭据
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// 路由配置
app.use("/api", loginRouter);
app.use("/api", registerRouter);
app.use("/api", userInfoRouter);
app.use("/api", orderRouter);

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
