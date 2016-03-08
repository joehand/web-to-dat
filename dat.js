var Hyperdrive = require('hyperdrive')
var Level = require('level')
var Swarm = require('discovery-swarm')
var swarmDefault = require('datland-swarm-defaults')

var walker = require('folder-walker')
var each = require('stream-each')

module.exports = Dat

function Dat (opts) {
  if (!(this instanceof Dat)) return new Dat(opts)
  var self = this
  if (!opts) opts = {}
  if (!opts.db) opts.db = './dat.db' // TODO: do better
  self.db = Level(opts.db)
  self.drive = Hyperdrive(self.db)
  self.swarm = Swarm(
    swarmDefault({
      stream: function () {
        return self.drive.createPeerStream()
      }
    })
  )
}

Dat.prototype.add = function (dir, cb) {
  if (!dir) return Error('Directory Required')
  var self = this
  var archive = self.drive.add(dir)
  var fileStream = walker(dir)
  each(fileStream, function (item, next) {
    archive.appendFile(item.filepath, item.basename, function (err) {
      if (err) throw err
      next()
    })
  }, doneAppending)

  function doneAppending (err) {
    if (err) return cb(err)
    archive.finalize(function (err) {
      if (err) return cb(err)
      self.link = archive.id.toString('hex')
      cb(null, self.link)
    })
  }
}

Dat.prototype.joinSwarm = function (opts, cb) {
  var self = this
  if ((typeof opts) === 'function') return self.joinSwarm({}, opts)
  if (!opts) opts = {}
  var port = Number(opts.port) || 0
  self.swarm.once('listening', function (err) {
    if (err) return cb(err)
    self.swarm.join(new Buffer(self.link, 'hex'))
    cb(null, self.swarm)
  })
  self.swarm.listen(port)
}

Dat.prototype.close = function (cb) {
  this.drive.core.db.close()
  this.swarm.destroy(cb)
}
