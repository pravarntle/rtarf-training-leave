const router = require('express').Router()
const jwt = require('jsonwebtoken')
// const authenticateToken = require('../configs/auth')

async function authToken(req) {
  console.log(req.headers)
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log(token)
  let status
  if (token == null) {
    status = 401
  } 
//   return res.sendStatus(401)
  jwt.verify(token, process.env.VUE_APP_SECRET, (err, user) => {
    console.log(err)
    if (err) {
        status = 403
    } else {
        status = 200
    }
//   return res.sendStatus(403)
    // req.user = user
    // next()
  })
  return await status
}

router.post('/token', async (req, res) => {
//   const user = req.user
//   console.log(user)
  const result = await authToken(req)
  if (result === 200) {
    res.send({ status: 200, statusText: 'token is valid'})
  } else if (result === 401) {
    res.send({ status: 401, statusText: 'no authorization'})
  } else if (result === 403) {
    res.send({ status: 403, statusText: 'token is invalid'})
  }
})

module.exports = router