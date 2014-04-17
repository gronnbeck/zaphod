var fs = require('fs')
, _ = require('underscore')

var isJavascript = function(file) {
  return file.indexOf('.js') != -1
}

var scriptFiles = function (dir) {
  try {
    return _.filter(fs.readdirSync(dir), function(file) {
      return isJavascript(file)
    })
  } catch (e) {
    console.log('Could not find directory: ' + dir)
    return []
  }
}

var loadLocalScripts = function() {
  var dir = 'scripts'
  var files = scriptFiles(dir)
  return _.map(files, function(file) {
      return require('../' + dir + '/' + file)
  })
}

exports.load = function() {
  return loadLocalScripts()
}
