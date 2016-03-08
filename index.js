var path = require('path')
var scraper = require('website-scraper')
var urlSlug = require('url-slug')
var Dat = require('./dat')

var DEST_DIR = path.join(__dirname, 'sites')

var dat = Dat({})

module.exports = function web2dat (url, opts, cb) {
  console.log('starting')
  if ((typeof opts) === 'function') return web2dat(url, {}, opts)
  if (!opts) opts = {}

  var slug = urlSlug(url, {separator: '_'})
  // TODO: this should be an option in urlSlugger...
  slug = slug.replace('http_', '').replace('https_', '')
  var destDir = opts.destDir || path.join(DEST_DIR, slug + '_' + Date.now())
  var scrapeOpts = {
    urls: [url],
    directory: destDir,
    sources: [
      {selector: 'img', attr: 'src'},
      {selector: 'link[rel="stylesheet"]', attr: 'href'},
      {selector: 'script', attr: 'src'}
    ]
  }

  scraper.scrape(scrapeOpts, function (err, result) {
    if (err) return cb(err)
    console.log('site scraped to: ', destDir)
    dat.add(destDir, function (err, link) {
      if (err) return cb(err)
      console.log('dat created, link:', link)
      cb(null, destDir, dat)
    })
  })
}
