const router = require('express').Router()
const axios = require('axios')
const authenticateToken = require('../configs/auth')

router.post('/file/view', authenticateToken, async (req, res) => {
    const user = req.user
    
    const result = await axios.get(`${process.env.VUE_APP_ALF_URL}alfresco/api/-default-/public/alfresco/versions/1/nodes/${process.env.VUE_APP_DEFAULT_NEWS}?alf_ticket=${user.ticket}`)
    console.log(result.data)
    res.send(result.data)
//   const app = req.body.app
//   const user = req.user
//   const url = `${process.env.VUE_APP_JOGET_URL}web/json/workflow/process/start/${app.appId}:latest:${app.processDefId}?j_username=${user.userId}&hash=${user.jogetHashed}`
//   await axios.post(url)
//     .then((response) => {
//        res.status(200).send(response.data)
//     }).catch((error) => {
//        res.status(500).send({ statusText: 'can not start process' })
//     })
})
module.exports = router