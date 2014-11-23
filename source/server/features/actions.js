var database = new Database('actions', { 'ressource': true, 'dateCreation': true, "type": true });
var async = require('async');

// Types: "comment"
// "like"
// "starred"
// "created"


// Package dependencies
var Followers = require('./followers');
var Users = require('./users');

function createAction (type, params, callback) {
	var _action = null;

	async.waterfall([
		function (next) {
			params.type = type;
			return database.save(params, next);
		},
		// Notifications.sendNotification(ressource.createdBy, next);
		function (action, next) {
			_action = action;
			return Followers.notifyFollowers(params.createdBy, action, next);
		},
		function (send, next) {
			return next(null, _action);
		}
	], callback);
};

exports.comment = createAction.bind(this, "comment");
exports.like = createAction.bind(this, "like");
exports.starred = createAction.bind(this, "starred");
exports.created = createAction.bind(this, "created");

function getAction(id, callback) {
	var _action = null;

	id = id.id || id;
	async.waterfall([
		function (next) {
			return database.get(id, next);
		},
		function (action, next) {
			_action = action;
			return Users.getUser(action.createdBy, next);
		},
		function (user, next) {
			_action.createdBy = user;
			return next(null, _action);
		}
	], callback);
};
exports.getAction = getAction;

exports.findActions = function (query, options, callback) {
	return database.find(query, options, function (err, data) {
		async.map(data.hits, getAction, function (err, actions) {
			data.hits = actions;
			return callback(null, data);
		});
	});
}