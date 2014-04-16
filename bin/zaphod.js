#!/usr/local/bin/node

var _ = require('underscore')
, GetOpt = require('node-getopt')
, yaml = require('js-yaml')
, fs = require('fs')
, zaphod = require('../modules/zaphod')
, getopt = new GetOpt([
		['p', 'port='],
		['u', 'url=']
	])
, opt = getopt.parse(process.argv)

var loadConfig = function(path) {
	try {
  	return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
	} catch (e) {
  	return {}
	}
}


var defaults = {
	url: 'ws://localhost',
	port: 8080
}

var parsedConfig = loadConfig('$HOME/.zaphod.yaml')
, yamlConfig = _.defaults(parsedConfig, defaults)
, config = _.defaults(opt.options, yamlConfig)


console.log('Starting bot with config: ')
console.log(JSON.stringify(config, null, 4))

var url = config.url + ':' + config.port
, keyPath = 'zaphod.key'

zaphod.connect(url, keyPath)
