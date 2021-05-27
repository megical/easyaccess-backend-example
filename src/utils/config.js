const dotenv = require('dotenv')
const crypto = require('crypto')

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH })

const BACKEND_PORT = process.env.PORT ?? 8765

const AUTH_ENV_URL = process.env.AUTH_ENV_URL
const REDIRECT_URL = process.env.REDIRECT_URL

const CLIENT_ID = process.env.CLIENT_ID
const AUDIENCE = process.env.AUDIENCE

const validatePrivateKey = (key) => {
  const keyObject = crypto.createPrivateKey(key.replace(/\\n/g, '\n'))
  if (!keyObject) {
    throw Error('Invalid private key')
  }
  return keyObject
}

const OPEN_ID_CLIENT_KEY = validatePrivateKey(process.env.OPEN_ID_CLIENT_KEY)

const config = {
  BACKEND_PORT,
  AUTH_ENV_URL,
  REDIRECT_URL,
  CLIENT_ID,
  AUDIENCE,
  OPEN_ID_CLIENT_KEY
}

module.exports = config
