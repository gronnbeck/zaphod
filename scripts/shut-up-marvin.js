var async = require('../modules/FakeAsync')

module.exports = {
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
}
