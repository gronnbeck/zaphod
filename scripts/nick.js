var async = require('../modules/FakeAsync')

module.exports = {
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
