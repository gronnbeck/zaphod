var fs = require('fs')

exports.init = function(ws) {

  var establishConnection = function(ws) {
    ws.send( JSON.stringify({
      type: 'connect',
      connection: {
        server: 'irc.freenode.net',
        nick: 'nplol-zaphod',
        channels: ['#pekkabot']
      },
      raw: true
    }));
  }

  return {
    connect: function(keyPath) {
      fs.readFile(keyPath, function(err, data) {
        // establish new connection if no key is found
        if (err) {
          establishConnection(ws);
          return;
        }

        // try to ro reconnect using the saved key
        var key = data.toString();
        ws.send( JSON.stringify({
          type: 'reconnect',
          key: key,
          raw: true
        }));
      });
    },
    connected: function(savePath, key) {
      fs.writeFile(savePath, key, function (err) {
        if (err)
          console.log('Error occured when trying to save connection key: ' + err);
      });
    },
    reconnect: function() {
      establishConnection(ws);
    }
  }
}
