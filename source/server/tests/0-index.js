global.request = require('supertest')('http://localhost:' + (process.env.PORT || 1338));
global._TEST_ = true;
global.DATA = {};

//require('../modules/database/tests.js');

// Launch server
require('../index.js');
require('./1-users.js');
require('./2-ingredients.js');
require('./3-recipes.js');
require('./4-followers.js');
require('./5-feed.js');
require('./6-actions.js');