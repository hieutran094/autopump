import cors from 'cors'
import express from 'express'
import * as path from 'path'
import bodyParser from 'body-parser'
import history from 'connect-history-api-fallback'
import errorHandler from './error.js'
import { httpLogger } from '../utils/logger.js'
export default (app) => {
  const __dirname = path.resolve()
  app.use(history())
  app.use(cors({ origin: '*' }))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(express.static(path.join(__dirname, 'client/dist')))
  app.use(errorHandler)
  app.use(httpLogger)
  return app
}
