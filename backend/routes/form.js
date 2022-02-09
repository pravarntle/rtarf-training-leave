const router = require('express').Router()
const axios = require('axios')
const authenticateToken = require('../configs/auth')
const FormData = require('form-data')
const base64 = require('base-64')
const encoded = base64.encode('training:demo')

router.post('/add', authenticateToken, async (req, res) => {
  const app = req.body.app
  const primaryKey = req.body.primaryKey
  const formData = req.body.formData
  const user = req.user
  let formParam = ''
  Object.keys(formData).forEach(function(key) {
    formParam = `${formParam}&${key}=${formData[key]}`
  })
  const url = encodeURI(`${process.env.VUE_APP_JOGET_URL}web/json/data/form/store/${app.appId}/${app.formId}/${primaryKey}?j_username=${user.userId}&hash=${user.jogetHashed}${formParam}`)
  console.log(url)
  await axios.post(url)
    .then((response) => {
      res.status(200).send(response.data)
    }).catch((error) => {
      res.status(500).send({ statusText: 'can not start process' })
    })
})

router.post('/jsonAdd', authenticateToken, async (req, res) => {
  const app = req.body.app
  const primaryKey = req.body.primaryKey
  const formData = req.body.formData
  const user = req.user
  var form = new FormData()
  Object.keys(formData).forEach(function(key) {
    form.append(key, formData[key])
  })
  const url = encodeURI(`${process.env.VUE_APP_JOGET_URL}web/json/data/form/store/${app.appId}/${app.formId}/${primaryKey}`)
  console.log(url)
  await axios.post(url, form, { headers: { 'Authorization': `Basic ${encoded}`, ...form.getHeaders() } })
    .then((response) => {
      res.status(200).send(response.data)
    }).catch((error) => {
      res.status(500).send({ statusText: 'can not start process' })
    })
})

router.post('/delete', authenticateToken, async (req, res, next) => {
  console.log(req.body)
  const app = req.body.app
  const primaryKey = req.body.primaryKey
  const user = req.user
  // console.log(encodeURI(`${process.env.VUE_APP_JOGET_URL}web/json/data/form/delete/${reqApp.appId}/${reqApp.formId}/${primaryKey}?j_username=${juser[permission].username}&j_password=${juser[permission].password}`))
  const result = await axios.post(encodeURI(`${process.env.VUE_APP_JOGET_URL}web/json/data/form/delete/${app.appId}/${app.formId}/${primaryKey}?j_username=${user.userId}&hash=${user.jogetHashed}`))
    return result
  })

module.exports = router