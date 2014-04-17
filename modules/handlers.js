var _ = require('underscore')
, scriptLoader = require('./scriptLoader')

exports.init = function(ws, scripts) {

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
  , scripts = scriptLoader.load()
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
