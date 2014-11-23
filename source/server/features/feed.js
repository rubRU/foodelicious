var database = new Database('feed', { 'to': true, 'dateCreation': true });
var async = require('async');

exports.createPost = function (to, post, callback) {
	return database.save(params, callback);
};