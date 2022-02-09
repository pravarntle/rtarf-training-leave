const router = require('express').Router()
const authenticateToken = require('../configs/auth')
const { exec } = require('child_process')

router.get('/storage', authenticateToken, async (req, res) => {
  let totalSize
  let size
  exec('df -h /', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    const result = stdout.split(' ')
    const resultLength = result.length
    result.forEach((item, index) => {
      if (item === 'Size') {
        totalSize = result[(resultLength/2)+index-1]
      }
    })
    exec('du -hs /opt/alfresco/', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return
      }
      const result = stdout.split('\t')
      size = result[0]
      res.send({ total: totalSize, used: size })
    })
  })
})

module.exports = router