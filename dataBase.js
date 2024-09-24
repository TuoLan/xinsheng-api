
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://lantuo51:HpEnHjHRQNA9dnmj@cluster0.n68lb.mongodb.net/xinsheng?retryWrites=true&w=majority&appName=Cluster0')
let db = mongoose.connection

module.exports = { mongoose, db }