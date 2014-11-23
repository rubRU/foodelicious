global.request = require('supertest')('http://localhost:' + (process.env.PORT || 1338));
global._TEST_ = true;
global.DATA = {};

// Launch server
require('../index.js');