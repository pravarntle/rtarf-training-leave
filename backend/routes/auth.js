const router = require('express').Router()
const user = require('../controllers/userController')

/* POST login. */
router.post('/login', (req, res, next) => {
  user.login(req, res)
})

module.exports = router