import Server from 'socket.io'
import { logger } from '../utils/logger.js'
import emitter from '../utils/event.js'

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
  emitter.on('event-socket-action', (data) => {
    io.to(device.id).emit('sync-trigger', data)
  })
  return io
}
