global.io = new (require('./modules/io-core'))({
	plugins: ['http', 'socket', 'session'],
	http: {
		port: 1337
	}
});

global.Database = require('./modules/database');

require('./features/example.js');