var async = require('async');
var database = new Database('follows', { 'user': true });

var Feed = new Database('feed', { 'to': true, 'from': true, 'dateCreation': true });

var Users = require('./users');
var Actions = require('./actions');

function createFollower (user, callback) {
	return database.save({
		user: user,
		followers: [],
		count: 0
	}, callback);
};

function addFollower (user, newFollower, callback) {
	async.waterfall([
		// get follow table
		function (next) {
			return database.find({ user: user }, next);
		},
		function (table, next) {
			if (!table.hits.length) return next(ERROR(404, "Table for User [" +newFollower + "] not found."));
			table = table.hits[0];
			if (table.followers.indexOf(newFollower) !== -1) return next(ERROR(400, "User [" +newFollower + "] is already following [" +user + "]."));
			++table.count;
			table.followers.unshift(newFollower);
			return database.save(table, next);
		}
	], callback);
};

function removeFollower (user, follower, callback) {
	async.waterfall([
		function (next) {
			return database.find({user: user}, next);
		},
		function (table, next) {
			if (!table.hits.length) return next(ERROR(404, "Table for User [" + follower + "] not found."));
			table = table.hits[0];
			var pos = table.followers.indexOf(follower);
			if (pos === -1) return next(ERROR(400, "User [" + follower + "] is not following [" +user + "]."));
			table.followers.splice(pos, 1);
			--table.count;
			return database.save(table, next);
		}
	], callback);
};

function getFollowers (user, start, callback) {
	start = parseInt(start) || 0;
	async.waterfall([
		// Get table
		function (next) {
			return database.find({ user: user }, next);
		},
		function (table, next) {
			if (!table.hits.length) return next(ERROR(404, "Table for User [" + follower + "] not found."));
			table = table.hits[0];
			table.start = start;
			if (table.start > table.followers.count) {
				table.followers = [];
				return next(null, table);
			} else {
				var _followers = [];
				async.times(15, function (n, async) {
					if ((start + n) >= table.count) return async(null);
					Users.getUser(table.followers[start + n], function (err, follower) {
						if (!err)
							_followers.push(follower);
						return async(null);
					});
				}, function (err) {
					table.followers = _followers;
					return next(null, table);
				});
			}
		}
	], callback);
}

function notifyFollowers(user, action, callback) {
	async.waterfall([
		// Get table
		function (next) {
			return database.find({ user: user }, next);
		},
		function (table, next) {
			if (!table.hits.length) return next(ERROR(404, "Table for User [" + user + "] not found."));
			table = table.hits[0];
			async.each(table.followers, function (item, async) {
				return Feed.save({
					to: item,
					from: action.createdBy,
					action: action.id
				}, async);
			}, next);
		},
		function (next) {
			return Feed.save({
				to: action.createdBy,
				from: action.createdBy,
				action: action.id
			}, next);
		},
		function (feedMsg, next) {
			return next(null, { ok: true });
		}
	], callback);
}

function getFeedForUser(user, start, callback) {
	async.waterfall([
		function (next) {
			return Feed.find({ to: user }, { start: start, sort: { "dateCreation": 1 } }, next);
		},
		function (feed, next) {
			return async.map(feed.hits, function (item, async) {
				Actions.getAction(item.action, async);
			}, next);
		}
	], callback);
}

function getUserFeed(user, start, callback) {
	async.waterfall([
		function (next) {
			return Feed.find({ to: user, from: user }, { start: start, sort: { "dateCreation": 1 } }, next);
		},
		function (feed, next) {
			return async.map(feed.hits, function (item, async) {
				Actions.getAction(item.action, async);
			}, next);
		}
	], callback);
}

exports.notifyFollowers = notifyFollowers;
exports.createFollower = createFollower;
exports.addFollower = addFollower;
exports.removeFollower = removeFollower;
exports.getFollowers = getFollowers;
exports.getUserFeed = getUserFeed;
exports.getFeedForUser = getFeedForUser;