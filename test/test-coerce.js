var fs = require('fs');
var parser = require('../index');
var assert = require('assert');

var file = __dirname + '/fixtures/coerce.xml';

var data = fs.readFileSync(file);

// With coercion
parser({reversible: true, coerce: true, object: true},function(err,result) {
	console.log(result.itemRecord.value);
	assert.strictEqual(result.itemRecord.value[0].longValue['$t'], 12345);
	assert.strictEqual(result.itemRecord.value[1].stringValue.number, false);
	assert.strictEqual(result.itemRecord.value[2].moneyValue.number, true);
	assert.strictEqual(result.itemRecord.value[2].moneyValue['$t'], 104.95);
}).end(data);

// Without coercion
parser({reversible: true, coerce: false, object: true},function(err,result) {
	assert.strictEqual(result.itemRecord.value[0].longValue['$t'], '12345');
	assert.strictEqual(result.itemRecord.value[1].stringValue.number, 'false');
	assert.strictEqual(result.itemRecord.value[2].moneyValue.number, 'true');
	assert.strictEqual(result.itemRecord.value[2].moneyValue['$t'], '104.95');
});