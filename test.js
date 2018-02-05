const tester = require('./index.js');

var toptest = new tester();
try {
    var testest = new tester();
    testest.setQuiet(true);
    testest.addResponse(true,true,'must be true and equal');
    testest.addResponse(2,2,'must be 2 and equal');
    toptest.addResponse(testest.matchResponses(),true,'whole test result must be true');
    testest = new tester();
    testest.setQuiet(true);
    testest.addResponse(true,true,'must be true and equal');
    testest.addResponse(2,1,'must be 2 and equal');
    toptest.addResponse(testest.matchResponses(),false,'whole test result must be false');
    var recs = testest.getReport();
    toptest.addResponse(recs[1].type,'mismatch_value','must be equal');
}
catch(err) {
    toptest.addResponse(err,true,'exception');
}

if (toptest.matchResponses()===false) {
    process.exit(1);
} else {
    process.exit(0);
}
