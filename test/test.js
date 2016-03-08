var fs = require('fs')
var os = require('os')
var path = require('path')
var rimraf = require('rimraf')
var test = require('tape')
var web2dat = require('../')

var TEST_SITE = 'http://www.aaronsw.com/'

test('basic web scrape', function (t) {
  var opts = {
    destDir: path.join(os.tmpdir(), 'web2datTest')
  }
  web2dat(TEST_SITE, opts, function cloneDone (err, outDir, dat) {
    t.ifError(err, 'no clone error')
    t.same(
      dat.link,
      '32f8488647dc8d74d86b1f8b04de77434b543596068786130d7d2f14108bd306',
      'Link is correct'
    )
    fs.stat(outDir, function dirExits (err, stats) {
      if (err) throw err
      t.ok(stats, 'out dir exists')
      rimraf(outDir, function (err) {
        if (err) throw err
        t.end()
      })
    })
  })
})

test('Scrape to Dat Share', function (t) {
  var opts = {
    destDir: path.join(os.tmpdir(), 'web2datTest2')
  }
  web2dat(TEST_SITE, opts, function cloneDone (err, outDir, dat) {
    t.ifError(err, 'no clone error')
    dat.joinSwarm(function swarmJoined (err, swarm) {
      t.ifError(err, 'no swarm join err')
      t.ok(swarm, 'swarm exists') // TODO: Download test?
      dat.close(function (err) {
        if (err) throw err
        rimraf(outDir, function (err) {
          if (err) throw err
          t.end()
        })
      })
    })
  })
})
