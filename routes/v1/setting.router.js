import express from 'express'
import { settingController } from '../../controllers/index.js'

const router = express.Router()

router.route('/setting').get(settingController.getOne).put(settingController.updateOne)
router.route('/seeding/setting').post(settingController.createOne)

export default router
