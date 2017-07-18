'use strict'

var http = require('https')
require('dotenv').config()

module.exports = function (app, db, collection) {
  app.get('/search/:query', handleQuery)
  app.get('/latest', handleLatest)

  function handleQuery (req, res) {
    var query = req.params.query
    var offset = Number(req.query.offset) // Captures the # in ?offset=#
    if (isNaN(offset)) {
      offset = undefined
    }

    var apiPath = offset
      ? '/3/gallery/search/top/week/' + offset + '?q=' + query
      : '/3/gallery/search/top/week?q=' + query

    var apiOptions = {
      'method': 'GET',
      'hostname': 'api.imgur.com',
      'port': null,
      'path': apiPath,
      'headers': {
        'authorization': 'Client-ID ' + process.env.clientid
      }
    }

    var request = http.request(apiOptions, function (resp) {
      var chunks = []

      resp.on('data', function (chunk) {
        chunks.push(chunk)
      })

      resp.on('end', function () {
        var body = Buffer.concat(chunks)
        var data = body.data
        res.json(data)
      })
    })

    request.end()
  }

  function newURL (url, res) {
    var links = db.collection(collection)
    links.findOne({ 'fullUrl': url }, function (err, doc) {
      if (err) {
        res.json({
          'error': err
        })
      } else {
        if (doc) {
          res.json({
            'fullUrl': doc.fullUrl,
            'id': doc.id
          })
        } else {
          links.find().count().then(function (count) {
            var insert = {
              'fullUrl': url,
              'id': (count)
            }
            links.insert(insert, function (err, result) {
              if (err) {
                res.json({
                  'error': err
                })
              } else {
                res.json({
                  'fullUrl': insert.fullUrl,
                  'id': insert.id
                })
              }
            })
          })
        }
      }
    })
  }

  function handleLatest (req, res) {
    var inputid = req.params.id
    routeURL(+inputid, res)
  }

  function routeURL (id, res) {
    var links = db.collection(collection)
    links.findOne({
      'id': id
    }, function (err, doc) {
      if (err) {
        res.json({
          'error': err
        })
      } else if (doc) {
        res.redirect('https://' + doc.fullUrl)
      } else {
        res.json({
          'error': 'shortened URL does not exist'
        })
      }
    })
  }
}