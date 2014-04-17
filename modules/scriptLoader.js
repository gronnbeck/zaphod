var fs = require('fs')
, _ = require('underscore')

var isJavascript = function(file) {
  return file.indexOf('.js') != -1
}

var scriptFiles = function (dir) {
  var deferred = Q.defer()
  fs.readdir(dir, function(err, files) {
    if (err) {
      deferred.reject(err)
    }

    var filtered = _.filter(files, function(file) {
      return isJavascript(file)
    })
    deferred.resolve(filtered)
  })
  return deferred.promise
}

var loadLocalScripts = function() {
  var dir = 'scripts'
  return scriptFiles(dir).then(function(files) {
      return _.map(files, function(file) {
          return require('../' + dir + '/' + file)
      })
  })

}

exports.load = function() {
  return loadLocalScripts()
}
