const { response } = require('express')
const passport = require('passport')
// Test
const passportJWT   = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy
const userController = require('../controllers/userController')
const alfController = require('../controllers/alfController')
const md5 = require('md5')
//
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, cb) => {
  // userController.test()
  //   .then((res) => {
  //     console.log(res)
  //   })
  const alfLogin = {
    username: username,
    password: password
  }
  await alfController.login(alfLogin)
    .then(async (res) => {
      const ticket = res.data.data.ticket
      const hashed = md5(username + '::' + md5(password))
        const loginData = {
          username: username,
          password: hashed
        }
        await userController.login(loginData)
          .then((response) => {
            console.log('Login Joget')
            // console.log(response)
            let iat = Number(new Date())
            if (response.status === 200) {
              let userData = response
              
              userController.profile(loginData.username)
                .then((response) => {
                  const  rtarfUser = {
                    username: userData.data.username,
                    hashed: loginData.password,
                    isAdmin: userData.data.isAdmin,
                    iat: iat,
                    displayName: `${response.data.data['user.firstName']} ${response.data.data['user.lastName']}`,
                    ticket: ticket,
                    department: response.data.data['department.name'],
                    jogetGroups: [],
                  }
                  userController.getGroup(loginData.username)
                    .then((response) => {
                      if (response.data.total !== 0) {
                        if (response.data.data.length > 1) {
                          rtarfUser.jogetGroups = response.data.data
                        } else {
                          rtarfUser.jogetGroups.push(response.data.data)
                        }
                      }
                      return cb(null, rtarfUser, { message: 'Logged In Successfully' })
                    })
                })
            }
          }).catch(err => cb(err))
    })
  }
))

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : process.env.VUE_APP_SECRET
}, (jwtPayload, cb) => {
  try {
    // find the user in db if needed
    if(jwtPayload.id == user.id) {
      return cb(null, user);
    } else {
      return cb(null, false);
    }
  } catch (error) {
    return cb(error, false);
  }
  //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.  
//   return UserModel.findOneById(jwtPayload.id)
//     .then(user => {
//       return cb(null, user)
//     }).catch(err => {
//       return cb(err)
//     })
//   }
}
))
