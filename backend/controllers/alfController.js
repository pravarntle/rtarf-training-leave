const axios = require('axios')

module.exports = {
  login: async (req, res, next) => {
    const loginData = {
      username: req.username,
      password: req.password
    }
    const url = `${process.env.VUE_APP_ALF_URL}alfresco/s/api/login`
    return await axios.post(url, loginData, { headers: { 'Content-Type': 'application/json' }})
  },
}