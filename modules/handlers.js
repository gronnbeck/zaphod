var _ = require('underscore')

exports.init = function(ws) {

  var filter = function(scripts, message) {
    return _.filter(scripts, function(script) {
      return script.trigger(message)
    })
  }
  , execute = function(scripts, message) {
    return _.map(scripts, function(script) {
      return script.execute(message)
    })
  }
  , rejectVoid = function(results) {
    return _.reject(results, function(result) {
      return result.type == 'void'
    })
  }
  , scripts = [
    {
      trigger: function(message) {
        return  message.from == 'nplol-bot-marvin'
      },
      execute: function(message) {
        return {
          key: message.key,
          type: 'msg',
          to: message.to,
          payload: 'Please ignore Marvin. He is depressed.'
        }
      }
    },
    {
      trigger: function(message) {
        return message.from == 'kengr' &&
          message.payload.indexOf('!nick') == 0
      },
      execute: function(message) {
        var args = message.payload.split(' ')
        if (args.length > 1) {
          return {
            key: message.key,
            type: 'raw',
            cmd: ['NICK', args[1]]
          }
        }
        else return {
          type: 'void'
        }
      }
    }
  ]
  return {
    userCommand: function(message) {
      var hits = filter(scripts, message)
      , results = execute(hits, message)
      , send = rejectVoid(results)

      _.each(send, function(msg) {
        ws.send(JSON.stringify(msg))
      })

    }
  }
}
