import cors from 'cors'
import bodyParser from 'body-parser'
import errorHandler from './error.js'
import { httpLogger } from '../utils/logger.js'
export default (app) => {
  app.use(cors({ origin: '*' }))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(errorHandler)
  app.use(httpLogger)
  return app
}
