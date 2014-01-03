var fs = require('fs');
var path = require('path');
var xmljs = require('../index');
var assert = require('assert');

var fixturesPath = './fixtures';

fs.readdir(fixturesPath, function(err, files) {
    for (var i in files) {
        var file = files[i];
        var ext = path.extname(file);

        if (ext == '.xml') {
            var basename = path.basename(file, '.xml');

            var data = fs.readFileSync(fixturesPath + '/' + file);
            var options = {reversible: true}

            var  data2 =  fs.readFileSync(fixturesPath + '/' + file);
            if (file.indexOf('spacetext') >= 0) {
                options = {trim: false, coerce: false};
            } else if (file.indexOf('coerce') >= 0) {
                options = {coerce: false};
            } else if (file.indexOf('domain') >= 0) {
                options = {coerce: false};
            } else if (file.indexOf('large') >= 0) {
                options = {coerce: false, trim: true, sanitize: false};
            } else if (file.indexOf('array-notation') >= 0) {
                options =  {arrayNotation: true};
            } else {
                options =  {trim: false};
            }

            var jsonFile = basename + '.json';
            var expected = fs.readFileSync(fixturesPath + '/' + jsonFile) + '';

            if (expected) {
                expected = expected.trim();
            }

            xmljs(options,function(err,d) {
                assert.deepEqual(JSON.stringify(d),expected,jsonFile + ' and ' + file + ' are different');
            }).end(data)

            /*console.log(result);
            console.log('============ Expected ===============');
            console.log(expected)*/
            //assert.deepEqual(result, expected, jsonFile + ' and ' + file + ' are different');
            console.log('[xml2json: ' + file + '->' + jsonFile + '] passed!');
        } 
    }
});

