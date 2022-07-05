import { settingService } from '../services/index.js'
import emitter from '../utils/event.js'
const getOne = async (req, res, next) => {
  try {
    const setting = await settingService.getOne()
    res.status(200).send({ code: 200, success: true, data: setting })
  } catch (err) {
    next(err)
  }
}

const updateOne = async (req, res, next) => {
  try {
    const setting = await settingService.updateOne(req.body)
    emitter.emit('event-update-setting', setting)
    res.status(200).send({ code: 200, success: true, data: setting, message: 'Update success' })
  } catch (err) {
    next(err)
  }
}

const createOne = async (req, res, next) => {
  try {
    const onceData = { timerOn: false, startTime: '05:00', time: 20 }
    const setting = await settingService.createOne(onceData)
    res.status(200).send({ code: 200, success: true, data: setting, message: 'Create success' })
  } catch (err) {
    next(err)
  }
}

export { getOne, createOne, updateOne }
