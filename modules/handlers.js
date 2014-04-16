exports.init = function(ws) {
  return {
    userCommand: function(message) {
      console.log(message)
      if (message.from == 'nplol-bot-marvin') {
        ws.send(JSON.stringify({
          key: message.key,
          type: 'msg',
          to: message.to,
          payload: 'Please ignore Marvin. He is depressed.'
        }));
      }
      else if (message.from == 'kengr') {
        if (message.payload.indexOf('!nick') == 0) {
          var args = message.payload.split(' ')
          if (args.length > 1) {
            console.log('sending message')
            ws.send(JSON.stringify({
              key: message.key,
              type: 'raw',
              cmd: ['NICK', args[1]]
            }))
          }
        }
      }
    }
  }
}
