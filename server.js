import cors from 'cors'
import * as path from 'path'
import * as http from 'http'
import dotenv from 'dotenv'
import express from 'express'
import Server from 'socket.io'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import history from 'connect-history-api-fallback'
import errorHandler from './middleware/error.js'
import { logger, httpLogger } from './utils/logger.js'
import routers from './routes/index.js'
import settingRepo from './model/setting.js'
import { CronJob } from 'cron'

const app = express()
const server = http.Server(app)
const io = new Server(server)
const __dirname = path.resolve()
dotenv.config()

app.use(httpLogger)
app.use(history())
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'client/dist')))
app.use('/', routers)
app.use(errorHandler)
let device = {
  id: null,
  isOnline: false,
}

io.use(async (socket, next) => {
  if (!socket.handshake.headers['user-agent'].includes('arduino')) {
    next()
  } else {
    socket.espIsOnline = true
    device.id = socket.id
    device.isOnline = true
    next()
  }
})

io.on('connection', (socket) => {
  try {
    if (socket.handshake.headers['user-agent'].includes('arduino') && device.isOnline) {
      if (!socket.handshake.headers['user-agent'].includes('arduino') && device.isOnline) {
        io.emit('esp-online')
      }
    }
  } catch (e) {
    logger.error(e)
  }
  socket.on('sync-data', (data) => {
    io.emit('sync-data', data)
  })
  socket.on('disconnect', () => {
    if (device.id === socket.id) {
      io.emit('esp-offline')
      device.isOnline = false
    }
  })
})

const bootstrap = async () => {
  try {
    const dbUrl = process.env.DB_URL
    await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    logger.info('Connected to DB')
    server.listen(process.env.PORT || 80, () => {
      logger.info(`Server listening on port ${process.env.PORT}`)
    })
    const setting = await settingRepo.findOne()
    const times = setting.startTime.split(':')
    const cron = new CronJob(
      `00 ${times[1]} ${times[0]} * * *`,
      async () => {
        io.to(device.id).emit('sync-trigger', { isOn: true })
        await new Promise((resolve) => setTimeout(resolve, Number(setting.time) * 60 * 1000))
        io.to(device.id).emit('sync-trigger', { isOn: false })
      },
      null,
      false,
      'Asia/Ho_Chi_Minh'
    )
    app.set('cron', cron)
    if (setting.timerOn) {
      cron.start()
      logger.info('Created cron')
    }
  } catch (e) {
    logger.error(e)
  }
}

bootstrap()
