var database = new Database('comments', { 'ressource': true, 'dateCreation': true });
var async = require('async');
var Followers = require('./followers');

var Users = require('./users');

exports.createComment = function (params, callback) {
	var _comment = null;

	async.waterfall([
		function (next) {
			return database.save(params, next);
		},
		// Notifications.sendNotification(ressource.createdBy, next);
		function (comment, next) {
			_comment = comment;
			return Followers.notifyFollowers(params.createdBy, params, next);
		},
		function (send, next) {
			return next(null, _comment);
		}
	], callback);
};

exports.getLastComments = function (id, number, callback) {
	async.waterfall([
		function (next) {
			return database.find({ ressource: id }, { sort: "dateCreation", limit: number }, callback);
		},
		function (comments, next) {
			async.each(comments.hits, function (item, async) {
				Users.getUser(item.createdBy, function (err, user) {
					item.createdBy = user;
					return async(null);
				});
			}, function (err) {
				return next(null, comments);
			});
		},
	], callback);
};