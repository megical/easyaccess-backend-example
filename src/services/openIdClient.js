const { Issuer, generators } = require('openid-client')
const { fromKeyLike } = require('jose/jwk/from_key_like')
const {
  AUTH_ENV_URL,
  REDIRECT_URL,
  CLIENT_ID,
  AUDIENCE,
  OPEN_ID_CLIENT_KEY
} = require('../utils/config')

module.exports = async () => {
  const issuer = await Issuer.discover(AUTH_ENV_URL)
  const webAppClient = new issuer.Client(
    {
      client_id: CLIENT_ID,
      token_endpoint_auth_method: 'private_key_jwt',
      token_endpoint_auth_signing_alg: 'RS256',
      redirect_uris: [REDIRECT_URL]
    },
    {
      keys: [
        {
          ...(await fromKeyLike(OPEN_ID_CLIENT_KEY)),
          kid: CLIENT_ID,
          use: 'sig'
        }
      ]
    }
  )

  const loginStart = async () => {
    const code_verifier = generators.codeVerifier()
    const code_challenge = generators.codeChallenge(code_verifier)

    const state = generators.state()
    const nonce = generators.nonce()

    const redirect = webAppClient.authorizationUrl({
      scope: 'openid',
      state,
      nonce,
      code_challenge,
      code_challenge_method: 'S256',
      audience: AUDIENCE
    })

    const loginData = {
      code_verifier,
      state,
      nonce
    }

    return { loginData, redirect }
  }

  const loginFinish = async (url, loginData) => {
    const params = webAppClient.callbackParams(url)
    const { state, nonce, code_verifier } = loginData

    const tokenSet = await webAppClient.callback(REDIRECT_URL, params, {
      state,
      nonce,
      code_verifier
    })

    return tokenSet
  }

  return {
    loginStart,
    loginFinish
  }
}
