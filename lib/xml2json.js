var expat = require('node-expat');

module.exports = function(options) {
// This object will hold the final result.
var obj = {};
var currentObject = {};
var ancestors = [];
var currentElementName = null;

function startElement(name, attrs) {
    currentElementName = name;
    currentObject[options.nameKey] = name;

    if(options.coerce) {
        // Looping here in stead of making coerce generic as object walk is unnecessary
        for(var key in attrs) {
            attrs[key] = options.coerce(attrs[key]);
        }
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
}

function text(data) {
    if (options.trim) {
        data = data.trim();
    }

    if (options.sanitize) {
        data = options.sanitize(data);
    }
    
    if (options.coerce) {
      currentObject[options.textKey] = options.coerce((currentObject[options.textKey] || '') + data);
    } else {
      currentObject[options.textKey] += data;
    }
}

function endElement(name) {
    if (currentElementName !== name) {
        delete currentObject[options.textKey];
    }
    // This should check to make sure that the name we're ending
    // matches the name we started on.
    var ancestor = ancestors.pop();
    if (!options.reversible) {
        if ((options.textKey in currentObject) && (Object.keys(currentObject).length == 1)) {
            if (ancestor[name] instanceof Array) {
                ancestor[name].push(ancestor[name].pop()[options.textKey]);
            } else {
                ancestor[name] = currentObject[options.textKey];
            }
        }
    }

    currentObject = ancestor;
}

/**
 * Parses xml to json using node-expat.
 * @param {String|Buffer} xml The xml to be parsed to json.
 * @param {Object} _options An object with options provided by the user.
 * The available options are:
 *  - object: If true, the parser returns a Javascript object instead of
 *            a JSON string.
 *  - reversible: If true, the parser generates a reversible JSON, mainly
 *                characterized by the presence of the property $t.
 *  - sanitize_values: If true, the parser escapes any element value in the xml
 * that has any of the following characters: <, >, (, ), #, #, &, ", '.
 *
 * @return {String|Object} A String or an Object with the JSON representation
 * of the XML.
 */

return {
    startElement : startElement,
    text : text,
    endElement : endElement,
    currentObject : currentObject,
};
}