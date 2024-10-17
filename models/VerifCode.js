const mongoose = require('mongoose');

const VerifCodeSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  verifCode: { type: String, required: true }
})

const VerifCode = mongoose.model('verifcode', VerifCodeSchema, 'verifcode');

module.exports = VerifCode;
