var fs = require('fs')

exports.init = function(ws, config) {

  var connection = config.connection
  , keyPath = config.keyPath

  var establishConnection = function() {
    ws.send( JSON.stringify({
      type: 'connect',
      connection: config.connection,
      raw: config.raw
    }) );
  }

  return {
    connect: function() {
      fs.readFile(keyPath, function(err, data) {
        // establish new connection if no key is found
        if (err) {
          establishConnection();
          return;
        }

        // try to ro reconnect using the saved key
        var key = data.toString();
        ws.send( JSON.stringify({
          type: 'reconnect',
          key: key,
          raw: config.raw
        }));
      });
    },
    connected: function(key) {
      fs.writeFile(keyPath, key, function (err) {
        if (err)
          console.log('Error occured when trying to save connection key: ' + err);
      });
    },
    reconnect: function() {
      establishConnection();
    }
  }
}
