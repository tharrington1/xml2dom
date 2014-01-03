var Process = require('./lib/xml2json'),
	expat = require('node-expat');

var defaults = {
  object: false,
  reversible: false,
  coerce: true,
  sanitize: true,
  trim: true
};

module.exports = function (options,callback) {
  if (arguments.length == 1) {
    callback = options;
    options = {};
  }

  options = options || {};

  // Insert default options
  Object.keys(defaults).forEach(function(key) {
    if (options[key] === undefined) options[key] = defaults[key];
  });

  var process = Process(options);

  return new expat.Parser('UTF-8')
    .on('startElement', process.startElement)
    .on('text', process.text)
    .on('endElement', process.endElement)
    .on('end',function() {
      callback(null,process.currentObject);
    })
    .on('error',function(e) {
      callback(e);
    });
};
