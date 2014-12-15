global.request = require('supertest')('http://localhost:' + (process.env.PORT || 1338));
global._TEST_ = true;
global.DATA = {};

//require('../modules/database/tests.js');

// Launch server
require('../index.js');