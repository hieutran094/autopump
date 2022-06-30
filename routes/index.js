import express from 'express'
import settingRepo from '../model/setting.js'
import moment from 'moment-timezone'
import { CronTime } from 'cron'
moment().tz('Asia/Ho_Chi_Minh').format()

const routers = express.Router()
routers.get('/', async (req, res) => {
  res.render('index.html')
})
routers.get('/health', (req, res) => {
  res.send('Server is running!')
})
routers.get('/setting', async (req, res, next) => {
  try {
    const setting = await settingRepo.findOne()
    res.status(200).send({ code: 200, success: true, data: setting })
  } catch (err) {
    next(err)
  }
})
routers.put('/setting', async (req, res, next) => {
  try {
    await settingRepo.findOneAndUpdate({}, req.body)
    const setting = await settingRepo.findOne()
    const cron = req.app.get('cron')
    const times = setting.startTime.split(':')
    const cronTime = new CronTime(`00 ${times[1]} ${times[0]} * * *`)
    cron.setTime(cronTime)
    if (!setting.timerOn && cron.running) {
      cron.stop()
    } else if (setting.timerOn && !cron.running) {
      cron.start()
    }
    res.status(200).send({ code: 200, success: true, data: setting, message: 'Update success' })
  } catch (err) {
    next(err)
  }
})
routers.post('/seeding/setting', async (req, res, next) => {
  try {
    let setting = await settingRepo.findOne()
    if (!setting) setting = await settingRepo.create({ timerOn: false, startTime: '05:00', time: 20 })
    res.status(200).send({ code: 200, success: true, data: setting, message: 'Create success' })
  } catch (err) {
    next(err)
  }
})
export default routers
