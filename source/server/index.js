global.io = new (require('./modules/io-core'))({
	plugins: ['http'],
	http: {
		port: process.env.PORT || 1338
	}
});
global.Database = require('./modules/database');
global.ERROR = require('./features/_errors');
global.PACKAGE = require('./package.json');


io.http.error(function (err) {
	console.log(err);
	return ERROR(400, 'Please follow API instructions on foodelicious Wiki');
});
// CORS
io.http.use(function (params, callback, connected, settings) {
	settings.res.header('Access-Control-Allow-Origin', '*');
    settings.res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    settings.res.header('Access-Control-Allow-Headers', 'Content-Type,x-api-user,x-api-token');
    return callback(null);
});
io.http.on('get', '/', {
	name: PACKAGE.name
	'version': PACKAGE.version,
	date: new Date(),
});
require('./features/ingredients.js');
require('./features/recipes.js');
require('./features/users.js');