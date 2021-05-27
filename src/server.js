const http = require('http')

const { BACKEND_PORT } = require('./utils/config')

const startServer = async () => {
  console.info('Easy Access Example Service')

  try {
    const openIdClient = await require('./services/openIdClient')()
    const session = require('koa-generic-session')({
      key: 'easyaccess-example',
      maxAge: 60 * 60 * 1000
    })

    // Webapp
    const app = require('./app')(session, openIdClient)

    const server = http.createServer(app.callback())
    const onError = (error) => {
      if (error.syscall !== 'listen') {
        throw error
      }
      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`[server] ${BACKEND_PORT} requires elevated privileges`)
          process.exit(1)
        case 'EADDRINUSE':
          console.error(`[server] ${BACKEND_PORT} is already in use`)
          process.exit(1)
        default:
          throw error
      }
    }

    const onListening = () => {
      const addr = server.address()
      const bind =
        typeof addr === 'string'
          ? `pipe ${addr}`
          : ` http://127.0.0.1:${addr.port}`

      console.info(`[server] Listening on :${bind}`)
    }

    server.listen(BACKEND_PORT)
    server.on('error', onError)
    server.on('listening', onListening)
  } catch (error) {
    console.error(`[server] ${error}`)
    console.error(error.stack)
    process.exit(1)
  }
}

startServer()
