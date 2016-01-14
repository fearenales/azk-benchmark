#!/usr/bin/env node
require('source-map-support').install();

var path = require('path');

var AzkBenchmarkCli = require('../lib/src/cli/index');
var cli = new AzkBenchmarkCli();

cli.createCli({ path: path.join(__dirname, 'usage.txt') });
