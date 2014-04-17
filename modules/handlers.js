var _ = require('underscore')
, scriptLoader = require('./scriptLoader')

exports.init = function(ws, scripts) {
  return {
    userCommand: function(message) {
      scriptLoader.load().then(function(scripts) {
        _.each(scripts, function(script) {
          return script.trigger(message)

          .then(function(bool) {
            if (!bool) return { type: 'void' }
            return script.execute(message)
          })

          .then(function(res) {
            if (res.type != 'void') {
              ws.send(JSON.stringify(res))
            }
          })
        })
      })
    }
  }
}
