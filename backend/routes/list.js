const router = require('express').Router()
const axios = require('axios')
const md5 = require('md5')
const authenticateToken = require('../configs/auth')

const adminUser = process.env.VUE_APP_J_ADMIN_USER
const adminPassHashed = md5(process.env.VUE_APP_J_ADMIN_USER + '::' + md5(process.env.VUE_APP_J_ADMIN_PASSWORD))

router.post('/get', authenticateToken, async (req, res) => {
    const app = req.body.app
    const payload = req.payload
    let params = ''
    if (req.body.search) {
      const search = req.body.search
      search.forEach((param) => {
        params = `${params}&${param.paramName}=${param.paramValue}`
      })
    }
    const url = encodeURI(`${process.env.VUE_APP_JOGET_URL}web/json/data/list/${app.appId}/${app.listId}/?j_username=${adminUser}&hash=${adminPassHashed}${params}`)
    await axios.post(url)
      .then((response) => {
        res.status(200).send(response.data)
      }).catch((error) => {
        res.status(500).send({ statusText: 'can not start process' })
      })
})

router.post('/getAll', authenticateToken, async (req, res) => {
  const app = req.body.app
  const user = req.user
  const url = encodeURI(`${process.env.VUE_APP_JOGET_URL}web/json/data/list/${app.appId}/${app.listId}/?j_username=${adminUser}&hash=${adminPassHashed}`)
  await axios.post(url)
    .then((response) => {
      res.status(200).send(response.data)
    }).catch((error) => {
      res.status(500).send({ statusText: 'can not start process' })
    })
})

module.exports = router