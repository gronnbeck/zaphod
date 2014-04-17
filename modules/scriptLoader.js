var Q = require('q')

var async = function(result) {
  var deferred = Q.defer()
  deferred.resolve(result)
  return deferred.promise
}

exports.load = function() {
  return [
    {
      trigger: function(message) {
        return async(message.from == 'nplol-bot-marvin')
      },
      execute: function(message) {
        return async({
          key: message.key,
          type: 'msg',
          to: message.to,
          payload: 'Please ignore Marvin. He is depressed.'
        })
      }
    },
    {
      trigger: function(message) {
        return async(message.from == 'kengr' &&
          message.payload.indexOf('!nick') == 0)
      },
      execute: function(message) {
        var args = message.payload.split(' ')
        if (args.length > 1) {
          return async({
            key: message.key,
            type: 'raw',
            cmd: ['NICK', args[1]]
          })
        }
        else return async({
          type: 'void'
        })
      }
    }
  ]
}
