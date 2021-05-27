const Koa = require('koa')
const path = require('path')
const send = require('koa-send')
const Router = require('@koa/router')

module.exports = (session, openIdClient, app = new Koa()) => {
  app.keys = ['cookie_key']
  app.use(session)

  // Error handler
  const errorHandler = async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.message
    }
  }
  app.use(errorHandler)

  // -- Mount apis
  const v1Router = new Router()
  v1Router.prefix('/api/v1')

  v1Router.use(async (ctx, next) => {
    if (!ctx.session?.claims) {
      return ctx.throw(401)
    }
    await next()
  })

  const privateRouter = require('./routes/private')()
  v1Router.use(privateRouter.routes())
  v1Router.use(privateRouter.allowedMethods())

  app.use(v1Router.routes())
  app.use(v1Router.allowedMethods())

  // Easy Access login routes
  const authRouter = require('./routes/auth')(openIdClient)
  app.use(authRouter.routes())
  app.use(authRouter.allowedMethods())

  app.use(async (ctx, next) => {
    if (ctx.path.startsWith('/api')) {
      return ctx.throw(404)
    }
    await next()
  })

  // static ui files
  const staticFiles = path.resolve(__dirname, '../ui/public')
  app.use(async (ctx) => {
    const path = ctx.path
    try {
      await send(ctx, path, {
        root: staticFiles,
        index: 'index.html',
        maxage: 60 * 60 * 1000
      })
    } catch (error) {
      if (path.startsWith('/static') || path.startsWith('/build')) {
        return ctx.throw(404)
      }
      await send(ctx, '/index.html', { root: staticFiles })
    }
  })

  return app
}
