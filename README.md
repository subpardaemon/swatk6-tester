# swatk6-tester
A lightweight testing package using the assumptions (expected vs actual) model. The report can be displayed or retrieved as a special array.

It can check the following:
- strict equality between the expected and actual item;
- underflows (not enough tests were done; only possible if you use the pre-set expectation format);
- overflows (more results that expected; only possible if you use the pre-set expectation format).

Caution: since it's possible to call `matchResponses()` and then carrying on adding more responses, the next `matchResponses()` call will carry on testing only the new values. 
Therefore if a test must pass the entire roster, make sure you quit at the first `false` return from `matchResponses()`.
Also, it's possible to `rewind()` the test index, after which `matchResponses()` will test the entire suite from the start.

## Usage

`npm install --save @swatk6/tester`

```javascript
const tester = require('@swatk6/tester');

tester.addResponse(true,false,'should fail');
...
if (tester.matchResponses()===false) {
    process.exit(1);
} else {
    process.exit(0);
}
```

For a detailed example, see test.js in this package.

## Reference

### Methods

`new tester()`

Constructor.

`addResponse(result[,expected[,label])`
- **result** `<*>`: the actual result we got from an operation
- **expected** `<*>`: the result we expected from that operation; only strict equality will pass; optional, defaults to 'N/A'
- **label** `<String>`: optional label, defaults to 'response #NN', where NN is the current index of the test items
- returns the tester object itself, allowing for chaining

`blockSync(msecs)`
- **msecs** `<Number>`: how many milliseconds to block for
- returns the tester object itself, allowing for chaining

Block execution of the current script. Great for testing timeouts. Exact millisecond precision is not guaranteed.

`getReport()`
- returns an `<Array>` of `<Object>`s where each object have the following properties:
  - step: `<Number|null>` which step of the test is the message about (`null` for generic entries or overflows)
  - type: `'mismatch_missing'|'mismatch_value'|'mismatch_overflow'|'ok'|'result_errors'`
  - expects: 
    - `'mismatch_missing'|'mismatch_value'|'ok'`: the required value
    - `'mismatch_overflow'`: undefined
    - `'result_errors'`: 0
  - actual:
    - `'mismatch_missing'|'mismatch_value'|'ok'`: the value we got
    - `'mismatch_overflow'`: the overflowing values as an Array
    - `'result_errors'`: number of steps that failed
 - label: the label for this step, or `'overflow'`, `'success'`, or `'failure'`

`matchResponses(): <Boolean>`
- returns true if there were no errors in the test, or false if there were

This format requires you to specify the `expected` argument for each `addResponse()` call.

`matchResponses(responseSet): <Boolean>`
- **responseSet** `<Array>`: an array of expected result values
- returns true if there were no errors in the test, or false if there were

In this format you pre-set an array of expected values, and match your current responses to that set. This allows detection of underflows (ie. an exception occurred that left a lot of expected responses void) or overflows (more responses were received than desired).

`reset()`
- returns the tester object itself, allowing for chaining

Resets the entire test object; allows for reuse of the object.

`rewind()`
- returns the tester object itself, allowing for chaining

Rewinds the `matchResponses()` current test index, allowing for re-testing the entire response chain.

`setQuiet(isQuiet)`
- **isQuiet** `<Boolean>`: if `false`, test results are console.logged, if `true`, the test suite works without console output
- returns the tester object itself, allowing for chaining

## Author

(c) 2018. Andras Kemeny, @subpardaemon
