/**
 * Quick and dirty test class.
 * (c) 2018. Andras Kemeny <subpardaemon@gmail.com>
 * LICENCE: MIT
 * @constructor
 * @returns {swatk6_tester} 
 */
function swatk6_tester() {
    this.reset();
}
/**
 * Reset the test suite.
 * @returns {swatk6_tester}
 */
swatk6_tester.prototype.reset = function() {
    this.responses = [];
    this.descs = [];
    this.expected = [];
    this._lastindex = null;
    this._quiet = false;
    this._report = [];
    return this;
};
/**
 * Rewinds the matchResponses() current test index.
 * @returns {swatk6_tester}
 */
swatk6_tester.prototype.rewind = function() {
    this._lastindex = 0;
    return this;
};
/**
 * Make the test quiet (true) or loud (false, logging to console).
 * 
 * In quiet mode you can still get the report by calling getReport().
 * 
 * @param {Boolean} qt the new setting
 * @returns {swatk6_tester}
 */
swatk6_tester.prototype.setQuiet = function(qt) {
    this._quiet = qt === true;
    return this;
};
/**
 * Returns the report log.
 * 
 * The array has plain Object items, that have the following keys:
 * - step: {Number|null} which step of the test is the message about (null for generic entries)
 * - type: 'mismatch_missing'|'mismatch_value'|'mismatch_overflow'|'ok'|'result_errors'
 * - expects: 
 * --- 'mismatch_missing'|'mismatch_value'|'ok': the required value
 * --- 'mismatch_overflow': undefined
 * --- 'result_errors': 0
 * - actual:
 * --- 'mismatch_missing'|'mismatch_value'|'ok': the value we got
 * --- 'mismatch_overflow': the overflowing values as an Array
 * --- 'result_errors': number of steps that failed
 * - label: the label for this step, or 'overflow', 'success', or 'failure'
 * 
 * @returns {Array}
 */
swatk6_tester.prototype.getReport = function() {
    return this._report;
};
/**
 * Add a response.
 * @param {*} resp the response we've got
 * @param {*} [expects='N/A'] expected value (might be overridden by the .matchResponses() call)
 * @param {String} [desc='response #NN']
 * @returns {swatk6_tester}
 */
swatk6_tester.prototype.addResponse = function(resp,expects,desc) {
    if (typeof desc==='undefined') {
	desc = 'response #'+this.responses.length.toString();
    }
    if (typeof expects==='undefined') {
	expects = 'N/A';
    }
    this.responses.push(resp);
    this.expected.push(expects);
    this.descs.push(desc);
    return this;
};
/**
 * Match the responses.
 * @param {Array} [expected=this.expected] either leave it out, or provide a full expected response set
 * @returns {Boolean}
 */
swatk6_tester.prototype.matchResponses = function(expected) {
    if (typeof expected==='undefined') {
	expected = this.expected;
    }
    var errnum = 0;
    if (this._lastindex===null) {
	this._lastindex = 0;
    }
    else if (this._lastindex===expected.length) {
	return true;
    }
    for(var i=this._lastindex;i<expected.length;i++) {
	if (typeof this.responses[i]==='undefined') {
	    this._report.push({step:i,type:'mismatch_missing',expects:expected[i],actual:undefined,label:this.descs[i]});
	    ++errnum;
	    if (this._quiet===false) {
		console.error('mismatch at #'+i+' ('+this.descs[i]+'), expected: ',expected[i],', got no counterpart');
	    }
	}
	else if (this.responses[i]!==expected[i]) {
	    this._report.push({step:i,type:'mismatch_value',expects:expected[i],actual:this.responses[i],label:this.descs[i]});
	    ++errnum;
	    if (this._quiet===false) {
		console.error('mismatch at #'+i+' ('+this.descs[i]+'), expected: ',expected[i],', got: ',this.responses[i]);
	    }
	}
	else {
	    this._report.push({step:i,type:'ok',expects:expected[i],actual:this.responses[i],label:this.descs[i]});
	    if (this._quiet===false) {
		console.info('test #'+i+' ('+this.descs[i]+') passed as expected: ',expected[i]);
	    }
	}
	++this._lastindex;
    }
    if (this.responses.length>expected.length) {
	this._report.push({step:null,type:'mismatch_overflow',expects:undefined,actual:this.responses.slice(expected.length),label:'overflow'});
	++errnum;
	if (this._quiet===false) {
	    console.error('mismatch: more responses than expected, superflous part:',this.responses.slice(expected.length));
	}
    }
    if (errnum>0) {
	this._report.push({step:null,type:'result_errors',expects:0,actual:errnum,label:'failure'});
	if (this._quiet===false) {
	    console.error('test failed, '+errnum+' of '+expected.length+' tests failed');
	}
	return false;
    } else {
	this._report.push({step:null,type:'result_errors',expects:0,actual:0,label:'success'});
	if (this._quiet===false) {
	    console.info('test succeeded');
	}
	return true;
    }
};
/**
 * A sync blocking mechanism.
 * @param {Number} msecs number of milliseconds to block
 * @returns {swatk6_tester}
 */
swatk6_tester.prototype.blockSync = function(msecs) {
    var st = new Date().getTime(), et = null;
    do {
	et = new Date().getTime();
    } while((et-msecs)<=st);
    return this;
};

module.exports = swatk6_tester;
