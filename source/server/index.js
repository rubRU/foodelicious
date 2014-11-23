global.io = new (require('./modules/io-core'))({
	plugins: ['http'],
	http: {
		port: process.env.PORT || 1338
	}
});
global.Database = require('./modules/database');
global.ERROR = require('./features/_errors');


io.http.error(function () {
	return ERROR(400, 'Please follow API instructions on foodelicious Wiki');
});
require('./features/ingredients.js');
require('./features/recipes.js');
require('./features/users.js');