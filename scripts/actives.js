var async = require('../modules/FakeAsync')
, Q = require('q')
, fs = require('fs')
, loader = require('../modules/scriptLoader')

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
      loader.loadConfig(filename).then(function(config) {
        var cmd = args[1]
        if (cmd == 'activate' || cmd == 'deactivate') {
          var id = args[2]
          config[id] = cmd == 'activate'
          loader.writeConfig(filename, config, function() {
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
