import express from 'express'
import settingRouter from './setting.router.js'
import healthRouter from './health.router.js'

export default (app) => {
  const routers = express.Router()
  routers.get('/', async (req, res) => {
    res.render('index.html')
  })
  routers.use(healthRouter)
  routers.use(settingRouter)
  app.use('/api/v1/', routers)
  return app
}
