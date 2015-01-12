var async = require('async');
var bcrypt = require('bcrypt');
var crypto = require('crypto')
var database = new Database('users', { 'email': true });

// Package dependecies
var Followers = require('./followers');

/*
	@desc: Login security stuff
	@comment: This is a pretty ugly implementation, maybe add auth / ACL to framework ? Or move token to his own file ...
*/

function _connectUser(id, token, next) {
	if (!id || !token) return next(ERROR(401, 'Authentication error'));
	database.get(id, function (err, user) {
      if (err) { return next(ERROR(401, 'Authentication error')); }

      if (user._token !== token)
      	return next(ERROR(401, 'Authentication error'));
      return next(null, user);
    });
}

var isAuthenticated = function (req, res, next) {
	_connectUser(req.headers['x-api-user'], req.headers['x-api-token'], function (err, user) {
		if (err) {
			return res.status(err.status || 500).send((typeof err === 'string' ? { message: err } : err));
		}
		req.user = user;
		return next(null);
	});
}
exports.isAuthenticated = isAuthenticated;

var getConnected = function (req, res, next) {
	_connectUser(req.headers['x-api-user'], req.headers['x-api-token'], function (err, user) {
		if (user)
			req.user = user;
		return next(null);
	});
}
exports.getConnected = getConnected;

/*
	@desc: Exemple hash return
	@return: { ok: true }
	@params: None
*/
io.http.on('post', '/users', {
	email: { type: 'string', minLength: 3, pattern: 'email' },
	password: { type: 'string', minLength: 7 },
	name: { type: 'string', minLength: 3 }
}, function (params, callback) {
	var _user = null;

	async.waterfall([
		function (next) {
			return database.find({ email: params.email }, next);
		},
		function (users, next) {
			if (users.hits.length) return next(ERROR(400, "User [" + params.email + "] already exists."));
			return _updatePassword(params.password, next);
		},
		function (password, next) {
			params.password = password;
			return _createToken(next);
		},
		function (token, next) {
			params._token = token;
			params.followers = 0;
			params.following = 0;
			return database.save(params, next);
		},
		function (user, next) {
			_user = user;
			return Followers.createFollower(_user.id, next);
		},
		function (table, next) {
			_user.token = _user._token;
			return next(null, _user);
		}
	], function (err, user) {
		// Rollback changes if fails
		if (err && _user) {
			return database.delete(_user.id, function () {
				return callback(err);
			});
		}
		return callback(err, user);
	});
});

/*
	@desc: Login routine
*/
io.http.on('post', '/login', {
	email: { type: 'string', minLength: 3, pattern: 'email' },
	password: { type: 'string', minLength: 7 }
}, function (params, callback) {
	var _user = null;

	async.waterfall([
		function (next) {
			return database.find({ email: params.email }, next);
		},
		function (users, next) {
			if (!users.hits.length) return next(true);
			_user = users.hits[0];
			bcrypt.compare(params.password, _user.password, next);
		},
		function (isMatch, next) {
			if (!isMatch) return next(true);
			return next(null);
		}
	], function (err) {
		if (err)
			return callback(ERROR(400, "Wrong user or password."));
		_user.token = _user._token;
		return callback(null, _user);
	});
});

/*
	@desc: update password function
	@return: password
	@params: Password to salt
*/
function _updatePassword(passwd, callback) {
	bcrypt.hash(passwd, 5, function (err, hash) {
	  if (err) return callback(ERROR(500, "Unable to save user."));
	  return callback(null, hash);
	});
}

/*
	@desc: Create token function
	@return: Token
*/
function _createToken(callback) {
	crypto.randomBytes(24, function (ex, buf) {
  		var token = buf.toString('base64');
  		bcrypt.hash("foodelicious" + token, 5, function (err, hash) {
		  if (err) return callback(ERROR(500, "Unable to save user."));
		  return callback(null, hash);
		});
	});
}

/*
	@desc: Get current user
	@return: Connected user
	@params: None
*/
io.http.on('get', '/user', [ isAuthenticated, function (params, callback, user) {
	return callback(null, user);
}]);

/*
	@desc: Get user
	@return: Connected user
	@params: None
*/
function getFullUser(params, callback) {
	return database.get(params.id || params, function (err, res) {
		if (err) return callback(ERROR(err.status, err.message));
		return callback(null, res);
	});
}
io.http.on('get', '/users/:id', getFullUser);
exports.getFullUser = getFullUser;

/*
	@desc: Get small user
	@return: Connected user
	@params: None
*/
function getUser(id, callback) {
	return database.find({ id: id }, {fields: ['name', 'id']}, function (err, users) {
		if (!users.hits.length) return callback(ERROR(404, 'Id [' + id + '] not found.'));
		return callback(null, users.hits[0]);
	});
}
exports.getUser = getUser;


/*
	@desc: Connected user starts to follow userId
*/
io.http.on('post', '/users/:id/follow', [isAuthenticated, function (params, callback, connected) {
	var _user = null;
	async.waterfall([
		function (next) {
			return database.get(params.id, next);
		},
		function (user, next) {
			_user = user;
			return Followers.addFollower(_user.id, connected.id, next);
		},
		function (table, next) {
			_user.followers = table.count;
			++connected.following;
			return database.save(connected, next);
		},
		function (connected, next) {
			return database.save(_user, next);
		},
		function (user, next) {
			return next(null, { ok: true });
		}
	], callback);
}]);


/*
	@desc: Connected user stop following userId
*/
io.http.on('post', '/users/:id/unfollow', [isAuthenticated, function (params, callback, connected) {
	var _user = null;
	async.waterfall([
		function (next) {
			return database.get(params.id, next);
		},
		function (user, next) {
			_user = user;
			return Followers.removeFollower(_user.id, connected.id, next);
		},
		function (table, next) {
			_user.followers = table.count;
			--connected.following;
			return database.save(connected, next);
		},
		function (connected, next) {
			return database.save(_user, next);
		},
		function (user, next) {
			return next(null, { ok: true });
		}
	], callback);
}]);

/*
	@desc: Get followers for user
*/
io.http.on('get', '/users/:id/followers', function (params, callback, connected) {
	var _user = null;
	async.waterfall([
		function (next) {
			return database.get(params.id,next);
		},
		function (user, next) {
			_user = user;
			return Followers.getFollowers(_user.id, params.start, next);
		}
	], callback);
});

/*
	@desc: Get the user feed
*/
io.http.on('get', '/user/feed', [isAuthenticated, function (params, callback, connected) {
	return Followers.getFeedForUser(connected.id, params.start || 0, callback);
}]);

/*
	@desc: Get the user feed
*/
io.http.on('get', '/users/:id/feed', [getConnected, function (params, callback, connected) {
	async.waterfall([
		function (next) {
			return database.get(params.id, next);
		},
		function (user, next) {
			return Followers.getUserFeed(user.id, params.start || 0, next);
		}
	], callback);
}]);
// To deprecate
io.http.on('get', '/user/:id/feed', [getConnected, function (params, callback, connected) {
	async.waterfall([
		function (next) {
			return database.get(params.id, next);
		},
		function (user, next) {
			return Followers.getUserFeed(user.id, params.start || 0, next);
		}
	], callback);
}]);