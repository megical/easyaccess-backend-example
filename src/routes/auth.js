const Router = require('@koa/router')
const router = new Router()

module.exports = ({ loginStart, loginFinish }) => {
  const login = async (ctx) => {
    await ctx.regenerateSession()

    const { loginData, redirect } = await loginStart()
    
    ctx.session.data = loginData
    ctx.redirect(redirect)
  }

  const complete = async (ctx) => {
    const loginData = ctx.session.data
    await ctx.regenerateSession()

    const tokenSet = await loginFinish(ctx.url, loginData)
    
    ctx.session.idToken = tokenSet.id_token
    ctx.session.accessToken = tokenSet.access_token
    ctx.session.claims = tokenSet.claims()

    ctx.redirect('/')
  }

  const logout = async (ctx) => {
    ctx.session = null
    ctx.redirect('/')
  }

  router.get('/login', login)
  router.get('/complete', complete)
  router.get('/logout', logout)

  router.prefix('/auth')
  return router
}
