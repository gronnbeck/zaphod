var fs = require('fs')
, async = require('../modules/FakeAsync')
, Q = require('q')
, request = require('request')

var download = function(url) {
  var options = {
      url: url,
      headers: {
          'User-Agent': 'request'
      }
  }

  var deferred = Q.defer()

  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          deferred.resolve(JSON.parse(body))
      }
  }

  request(options, callback)

  return deferred.promise

}

module.exports = {
  id: 'download script',
  trigger: function(message) {
    return async(message.payload.indexOf('!download') == 0)
  },
  execute: function(message) {
    var deferred = Q.defer()
    , args = message.payload.split(' ')
    if (args.length < 3) {
      deferred.resolve({
        key: message.key,
        type: 'msg',
        payload: 'Missing arguments for !download. ' +
        'Use the following format !download <id> <url>',
        to: message.to
      })
    } else {
      download(args[2])
      .then(function(data) {
        fs.writeFile('scripts/dl/' + args[1], JSON.stringify(data), function (err) {
          if (err) console.log(err)
        })
      })
      deferred.resolve({
        key: message.key,
        type: 'msg',
        payload: 'Successfully downloaded ' + args[1],
        to: message.to
      })
    }

    return deferred.promise
  }
}
