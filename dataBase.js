
const mongoose = require('mongoose')
mongoose.connect('mongodb://xinsheng:welcome1@175.178.215.129/xinsheng?retryWrites=true&w=majority&appName=Cluster0')
let db = mongoose.connection

module.exports = { mongoose, db }