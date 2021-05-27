const Router = require('@koa/router')
const router = new Router()

module.exports = () => {
  router.get('/userInfo', async (ctx) => {
    ctx.body = {
      idToken: ctx.session.idToken,
      claims: ctx.session.claims
    }
  })

  router.prefix('/private')
  return router
}
