exports.testHiccup = require("./hiccup_test");

//start the test runner if we're called directly from command line
if (require.main == module) {
    require('test').run(exports);
}
