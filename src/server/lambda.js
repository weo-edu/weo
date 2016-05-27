
import server from './server'
import logError from '@f/log-error'

require('source-map-support').install()

const fiveHundred = `
<html>
  <body>
    <h1>500</h1>
  </body>
</html>
`

exports.render = function (e, ctx, cb) {
  console.log('event', e)
  server(e).then(html => {
    cb(null, {body: html, type: 'text/html', status: 200})
  }, e => {
    logError(e)
    cb(null, {body: fiveHundred, type : 'text/html', status: 500})
  })
}
