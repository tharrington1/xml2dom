var Process = require('./lib/xml2json'),
	expat = require('node-expat');

/**
 * Simple sanitization map. It is not intended to sanitize
 * malicious element values.
 */
var sanitationChars = {
                '<': '&lt;',
                '>': '&gt;',
                '(': '&#40;',
                ')': '&#41;',
                '#': '&#35;',
                '&': '&amp;',
                '"': '&quot;',
                "'": '&apos;' };
 
var defaults = {
  object: false,
  reversible: false,
  coerce: function(value) {
    var num = Number(value);
    if (!isNaN(num)) {
        return num;
    }
    var _value = value.toLowerCase();
    if (_value == 'true') {
        return true;
    }
    if (_value == 'false') {
        return false;
    }
    return value;
  },
  sanitize: function(value) {
    if (typeof value !== 'string') {
        return value;
    }
    Object.keys(sanitationChars).forEach(function(key) {
        value = value.replace(key, sanitationChars[key]);
    });
    return value;
  }
  trim: true,
  arrayNotation: false,
  textKey: '$text',
  nameKey: '$name'
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
