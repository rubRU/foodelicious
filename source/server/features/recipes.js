var async = require('async');
var _ = require('underscore');
var ingredients = new Database('ingredients');
var database = new Database('recipes');

// Package dependencies
var Users = require('./users');
var Actions = require('./actions');
/*
	@desc: Create recipe
	@return: Return new recipe
*/
io.http.on('post', '/recipes', {
	name: { type: 'string', minLength: 1 },
	for: { type: 'number', optional: true },
	ingredients: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: { type: 'string', minLength: 1 },
				quantity: { type: 'string', minLength: 1}
			}
		}
	},
	steps: { type: 'array', items: { type: 'string', minLength: 1 }}
}, [ Users.isAuthenticated, function (params, callback, connected) {
	async.waterfall([
		function (next) {
			// Check if ingredients are goods
			return async.map(_.pluck(params.ingredients, 'id'), ingredients.get.bind(ingredients), next);
		},
		function (docs, next) {

			// Default parameters
			params.likes = 0;
			params.comments = 0;
			params.stars = 0;

			params.createdBy = connected.id;
			// Create feed info 

			return database.save(params, next);
		}
	], callback);
}]);

io.http.on('get', '/recipes', function (params, callback) {
	return database.findAll(params, callback);
});

io.http.on('get', '/recipes/:id', function (params, callback) {
	var _recipe = null;
	async.waterfall([
		function (next) {
			return database.get(params.id, next);
		},
		function (recipe, next) {
			_recipe = recipe;
			return async.map(_.pluck(recipe.ingredients, 'id'), ingredients.get.bind(ingredients), next);	
		},
		function (ingredients, next) {
			for (var i in _recipe.ingredients) {
				ingredients[i].quantity = _recipe.ingredients.quantity;
			}
			_recipe.ingredients = ingredients;
			return next(null, _recipe);
		}
	], callback);
});

io.http.on('post', '/recipes/:id/comment', {
	comment: { type: 'string', minLength: 1 }
}, [ Users.isAuthenticated, function (params, callback, connected) {
	var _recipe = null;
	var _comment = null;

	async.waterfall([
		function (next) {
			return database.get(params.id, next);
		},
		function (recipe, next) {
			_recipe = recipe;
			return Actions.comment({
				createdBy: connected.id,
				comment: params.comment,
				ressource_type: "recipe",
				ressource: recipe.id,
			}, next);
		},
		function (comment, next) {
			_comment = comment;
			++_recipe.comments;
			return database.save(_recipe, next);
		},
		function (recipe, next) {
			return next(null, _comment);
		}
	], callback);
}]);

io.http.on('get', '/recipes/:id/comments', function (params, callback) {
	async.waterfall([
		function (next) {
			return database.get(params.id, next);
		},
		function (recipe, next) {
			params.start = params.start || 0;
			params.limit = params.limit || 15;
			return Actions.findActions({ ressource: params.id, type: 'comment'}, { start: params.start, limit: params.limit }, next);
		},
		function (comments, next) {
			return next(null, comments.hits);
		}
	], callback);
});