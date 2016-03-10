var fs = require('fs')
var http = require('http')
var path = require('path')
var url = require('url')
var mkdirp = require('mkdirp')
var Dat = require('./dat')

var DEST_DIR = path.join(process.cwd(), 'web2dat')

var dat = Dat({}) // TODO: use home dir dat or opts

module.exports = function web2dat (webUrl, opts, cb) {
  if ((typeof opts) === 'function') return web2dat(webUrl, {}, opts)
  if (!opts) opts = {}

  var host = url.parse(webUrl).host.replace('.', '_')
  var destDir = opts.dir || path.join(DEST_DIR, host)
  mkdirp(destDir)

  var fileName = url.parse(webUrl).path.split('/').pop()
  var fileStream = fs.createWriteStream(path.join(destDir, fileName))
  http.get(webUrl, function (resp) {
    resp.pipe(fileStream)
  })
  fileStream.on('close', add2Dat)

  function add2Dat () {
    dat.add(destDir, function (err, link) {
      if (err) return cb(err)
      console.log('dat created, link:', link)
      cb(null, destDir, dat)
    })
  }
}
