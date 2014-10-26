global.io = new (require('./modules/io-core'))({
	plugins: ['http', 'socket', 'session'],
	http: {
		port: process.env.PORT || 1338
	}
});

global.Database = require('./modules/database');

require('./features/ingredients.js');
require('./features/recipes.js');