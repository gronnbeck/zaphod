var async = require('../modules/FakeAsync')
, Q = require('q')
, fs = require('fs')

var loadConfig = function(filename) {
  var deferred = Q.defer()
  fs.exists(filename, function(exists) {
    if (exists) {
      fs.readFile(filename, function(err, data) {
          deferred.resolve(JSON.parse(data))
      })
    }
    else {
      deferred.resolve({})
    }
  })
  return deferred.promise
}

var writeConfig = function(filename, config, success) {
  var data = JSON.stringify(config)
  fs.writeFile(filename, data, function(err) {
    success()
  })
}

module.exports = {
  id: 'virtual script activtor',
  trigger: function(message) {
    return async(message.payload.indexOf('!scripts') == 0)
  },
  execute: function(message) {
    var filename = 'scripts.config.yml'
    , args = message.payload.split(' ')
    , deferred = Q.defer()

    if (args.length >= 2) {
      loadConfig(filename).then(function(config) {
        var cmd = args[1]
        if (cmd == 'activate' || cmd == 'deactivate') {
          var id = args[2]
          config[id] = cmd == 'activate'
          writeConfig(filename, config, function() {
            deferred.resolve({
              type: 'msg',
              to: message.to,
              payload: id + ' was ' + cmd + 'd',
              key: message.key
            })
          })

        }
      }, function(err) {
        console.log(err)
      })
    }

    return deferred.promise
  }
}
