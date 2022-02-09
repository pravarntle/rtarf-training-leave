const axios = require("axios");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const base64 = require('base-64')
const adminUser = {
  username: process.env.VUE_APP_J_ADMIN_USER,
  hashed: md5(
    process.env.VUE_APP_J_ADMIN_USER +
      "::" +
      md5(process.env.VUE_APP_J_ADMIN_PASSWORD)
  )
};

function generateAccessToken(data) {
  return jwt.sign(data, process.env.VUE_APP_SECRET, { expiresIn: "3600s" });
}

module.exports = {
  login: async (req, res) => {
    const header = req.headers.authorization;
    const base64String = header.split(" ")[1];
    const credential = Buffer.from(base64String, "base64").toString();
    const username = credential.split(":")[0]
    const password = credential.split(":")[1]
    const hashPassword = md5(username + "::" + md5(password))
    
    // API for authentication to JOGET Workflow
    await axios.post(`${process.env.VUE_APP_JOGET_URL}web/json/directory/user/sso?j_username=${username}&hash=${hashPassword}`)
      .then(async (response) => {
        try {
          if (response.data.token) {
            // encode to Base64
            const encoded =  base64.encode(`${username}:${password}`)
            // API for user's profile data
            const userdata = await axios.post(`${process.env.VUE_APP_JOGET_URL}web/json/directory/admin/employment/list?name=${username}&j_username=${adminUser.username}&hash=${adminUser.hashed}`)
            
            // API for user's group
            const groupdata = await axios.post(`${process.env.VUE_APP_JOGET_URL}web/json/directory/admin/user/group/list?userId=${username}&j_username=${adminUser.username}&hash=${adminUser.hashed}`)
            
            // verify group data
            let group = []
            if (groupdata.data.total === 1) {
              group.push(groupdata.data.data)
            } else if (groupdata.data.total > 1) {
              group = groupdata.data.data
            }
            // collect user profile
            const user = {
              username: username,
              firstname: userdata.data.data['user.firstName'],
              lastname: userdata.data.data['user.lastName'],
              fullname: `${userdata.data.data['user.firstName']} ${userdata.data.data['user.lastName']}`,
              department: userdata.data.data['department.name'],
              organization: userdata.data.data['organization.name'],
              group: group,
            }
            const datatoken = user // create data for generate JWT token
            datatoken.hashed = hashPassword // add hashed password attribute to datatoken
            datatoken.encoded = encoded // add Base64 Encode attribute to datatoken
            const token = generateAccessToken(datatoken) // generate a token from datatoken
            user.token = token // add token to user profile
            res.status(200).send({ statusText: 'Login Successful', data: user }) // return user profile data
          }
        } catch (err) { // CATCH for ERROR unknown reason.
          res.status(500).send('Error, Something went wrong')
        }
      }).catch((err) => { // CATCH when authentication failed
        console.log(err)
        res.status(403).send('Unauthorized')
      })
  }
};
