const fetch = require('node-fetch')

const handleError = async (res, url) => {
  if (res.status < 200 || res.status > 302) {
    // This will handle any errors that aren't network related (network related errors are handled automatically)
    const body = await res.json()
    console.error(JSON.stringify(body, null, 2))
    throw new Error(body.developerMessage)
  }
}

const post = async (url, body, authToken = '') => {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    }
  })
  await handleError(res, url)

  return res.json()
}

const get = async (url, authToken = '') => {
  const res = await fetch(url, {
    method: 'GET',
    Authorization: `Bearer ${authToken}`
  })
  await handleError(res, url)

  return res.json()
}

module.exports = {
  post,
  get
}
