var Process = require('./lib/xml2json'),
	expat = require('node-expat');
 
var defaults = {
  /**
   * For every value encountered (attribute or text value), this conversion 
   * function will be called with that value along with the name of the 
   * attribute this value belongs to and the containing element name. In the 
   * case of text values, the attributeName will be equal to options.textKey.
   */
  convert: function(value, attributeName, elementName) {
    /*
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
    */
    return value;
  },
  trim: true,
  arrayNotation: false,
  textKey: '$text',
  nameKey: '$name',
  attrsKey: '$'
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
