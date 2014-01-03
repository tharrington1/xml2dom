var fs = require('fs');
var parser = require('../index');
var assert = require('assert');

var xml = fs.readFileSync('./fixtures/array-notation.xml');
var expectedJson = JSON.parse( fs.readFileSync('./fixtures/array-notation.json') );

var json = parser({object: true, arrayNotation: true},function(err,json) {
	assert.deepEqual(json, expectedJson);
}).end(xml);


console.log('xml2json options.arrayNotation passed!');
