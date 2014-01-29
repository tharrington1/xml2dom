var expat = require('node-expat');

/**
 * Parses xml to json using node-expat.
 * @param {Object} options An object with options provided by the user.
 * @return {Object} An Object with the JSON representation
 * of the XML.
 */
module.exports = function(options) {
// This object will hold the final result.
var obj = {};
var currentObject = {};
if (options.parentKey) {
  currentObject[options.parentKey] = null;
}
if (options.nameKey) {
  currentObject[options.nameKey] = '';
}

var stringify = function() {
  var replacer = function(key, value) {
    if (key === "$parent") {
      return undefined;
    }
    return value;
  };
  return JSON.stringify(this,replacer,2);
};

currentObject.stringify = stringify;

var ancestors = [];
var currentElementName = null;

function startElement(name, attrs) {
    currentElementName = name;

    // Convert each attribute value according to the user-provided conversion
    // function
    for(var key in attrs) {
        attrs[key] = options.convert(attrs[key], key, name);
    }

    attrs.stringify = stringify;

    // If options.attrsKey is set then store the attributes as a property under
    // the key options.attrsKey
    if (options.attrsKey && Object.keys(attrs).length > 0) {
      tmp = {};
      tmp[options.attrsKey] = attrs;
      attrs = tmp;
    }

    if (options.parentKey) {
      attrs.$parent = currentObject;
    }

    if (! (name in currentObject)) {
        if(options.arrayNotation) {
            currentObject[name] = [attrs];
        } else {
            currentObject[name] = attrs;
        }
    } else if (! (currentObject[name] instanceof Array)) {
        // Put the existing object in an array.
        var newArray = [currentObject[name]];
        // Add the new object to the array.
        newArray.push(attrs);
        // Point to the new array.
        currentObject[name] = newArray;
    } else {
        // An array already exists, push the attributes on to it.
        currentObject[name].push(attrs);
    }

    // Store the current (old) parent.
    ancestors.push(currentObject);

    // We are now working with this object, so it becomes the current parent.
    if (currentObject[name] instanceof Array) {
        // If it is an array, get the last element of the array.
        currentObject = currentObject[name][currentObject[name].length - 1];
    } else {
        // Otherwise, use the object itself.
        currentObject = currentObject[name];
    }
    
    // Set the element's name field
    if (options.nameKey) {
      currentObject[options.nameKey] = name;
    }
}

function text(data) {
    if (!options.textKey) {
      return;
    }
    if (options.trim) {
        data = data.trim();
    }
    if (!currentObject[options.textKey]) {
      currentObject[options.textKey] = data;
    } else {
      currentObject[options.textKey] += data;
    }
}

function endElement(name) {
    // An XML element is not supposed to contain text *and* one or more child 
    // elements at the same time. I believe this is by convention. The condition
    // (currentElementName !== name) is true when a child element was found, in 
    // which case the correct behavior is to delete the text (which is most 
    // likely whitespace).
    if (currentElementName !== name) {
        delete currentObject[options.textKey];
    }

    if (currentObject[options.textKey]) {
      // There is no more text to be appended, so it's time to call the 
      // conversion function
      currentObject[options.textKey] = options.convert(
        currentObject[options.textKey],
        options.textKey, currentElementName);
    }

    // This should check to make sure that the name we're ending
    // matches the name we started on.
    var ancestor = ancestors.pop();
    currentObject = ancestor;
}

return {
    startElement : startElement,
    text : text,
    endElement : endElement,
    currentObject : currentObject,
};
};