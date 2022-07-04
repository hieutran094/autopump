import * as http from 'http'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { logger } from './utils/logger.js'
import routers from './routes/v1/index.js'
import initCron from './crons/index.js'
import middlewares from './middlewares/index.js'
import socketServer from './socket/index.js'

dotenv.config()
const bootstrap = async () => {
  try {
    const app = express()
    const server = http.Server(app)

    middlewares(app)
    routers(app)
    socketServer(server)

    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    logger.info('Connected to DB')

    server.listen(process.env.PORT || 80, () => {
      logger.info(`Server listening on port ${process.env.PORT}`)
    })

    initCron()
  } catch (e) {
    logger.error(e)
  }
}

bootstrap()
