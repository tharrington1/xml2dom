# Stream implementation of xml2json

This package is a stream implementation of the xml2json function of the [node-xml2json](https://github.com/buglabs/node-xml2json) package.  The package exports only one function that takes options as a first argument and a standard node callback as the second argument.   If only one argument is given, it's expected to be a callback function.

Example:
```javascript
var parser = require('xmls2json');

parser({coerce:true},function(err,json) {
  console.log(json)
}).end("<foo>bar</foo>");
```

For further information see the [README.md](https://github.com/buglabs/node-xml2json/blob/master/README.md) of the original repo.

(The MIT License)

Copyright 2012 BugLabs. All rights reserved.
Copyright 2013 Ziggy Jonsson  (stream implementation)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.