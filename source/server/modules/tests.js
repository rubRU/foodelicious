var fs = require('fs');

var files = fs.readdirSync(__dirname);

for (var i in files) {
	if (!fs.statSync(__dirname + '/' + files[i]).isDirectory())
		continue;
	try {
		suite('[' + __dirname + '/' + files[i] + ']', function () {
			require(__dirname + '/' + files[i] + '/tests.js');
		});
	} catch (e) {
		var now = new Date();
		process.stderr.write('\033[31;1m> Debug - ' + now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds());
		process.stderr.write(':\033[0m \033[31m');
		console.error("Unable to find test file for module [" + files[i] + "]");
		process.stderr.write('\033[0m');
	}
}