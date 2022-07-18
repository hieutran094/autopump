import Server from 'socket.io'
import { logger } from '../utils/logger.js'
import emitter from '../utils/event.js'
import {settingService} from '../services/index.js'

export default (expressServer) => {
  const device = { id: null, isOnline: false }
  const io = new Server(expressServer)
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

  io.on('connection', async (socket) => {
    try {
      if (socket.handshake.headers['user-agent'].includes('arduino') && device.isOnline) {
        const setting = await settingService.getOne()
        const socketData = {
          timerOn: setting.timerOn,
        }
        io.to(device.id).emit('sync-setting', socketData)
      }
      if (!socket.handshake.headers['user-agent'].includes('arduino') && device.isOnline) {
        io.emit('esp-online')
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
  emitter.on('event-socket-action', (data) => {
    io.to(device.id).emit('sync-trigger', data)
  })
  emitter.on('event-update-setting', (data) => {
    const socketData = {
      timerOn: data.timerOn,
    }
    io.to(device.id).emit('sync-setting', socketData)
  })
  return io
}
