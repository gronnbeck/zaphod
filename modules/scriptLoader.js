
exports.load = function() {
  return [
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
}
