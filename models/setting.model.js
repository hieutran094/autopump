import mongoose from 'mongoose'
const Schema = mongoose.Schema
const settingSchema = new Schema({
  timerOn: Boolean,
  startTime: String,
  time: Number,
})
export default mongoose.model('setting', settingSchema, 'settings')
