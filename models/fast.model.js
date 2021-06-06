const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let fastSchema = new Schema({
  goalType: { type: String, enum: ['16:8', '18:6', '20:4'], default: '16:8' },
  fastState: { type: String, default: 'initial' },
  startedAt: { type: Date, default: new Date() },
  endingAt: { type: Date, default: new Date() },
  endedAt: { type: Date, default: new Date() },
  fastingTime: { type: String },
  totalFastingTime: { type: String },
  date: { type: String, default: new Date() },

  token: String,
});

module.exports = mongoose.model('Fast', fastSchema);
