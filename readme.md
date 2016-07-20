# Web2Dat

**Currently Outdated**. Please check out [url-dat](https://github.com/joehand/url-dat) for now (puts a single url into a Dat).

Clone a (static) website, create hash, and share via dat (optional)

## Usage

```javascript
var web2dat = require('web-to-dat')
web2dat('http://google.com', function (err, outDir, dat) {
  if (err) throw err
  console.log('Site scraped to:', outDir)
  console.log('Dat link:', dat.link)

  // Start sharing via Dat (not shared by default)
  dat.joinSwarm(function (err) {
    if (err) throw err
    console.log('Sharing Link')
  })
})
```

### Uses

* Use as a p2p CDN? 
* Make a new browser that only browses static sites via p2p
* Mirror all github pages


