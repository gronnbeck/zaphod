#!/usr/local/bin/node

var _ = require('underscore')
, GetOpt = require('node-getopt')
, zaphod = require('../modules/zaphod')
, getopt = new GetOpt([
		['p', 'port='],
		['u', 'url=']
	])
, opt = getopt.parse(process.argv)
, defaults = {
	url: 'ws://localhost',
	port: 8080
}
, config = _.defaults(opt.options, defaults)


console.log('Starting bot with config: ')
console.log(JSON.stringify(config, null, 4))

var url = config.url + ':' + config.port
, keyPath = 'zaphod.key'

zaphod.connect(url, keyPath)
