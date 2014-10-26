var async = require('async');
var _ = require('underscore');
var ERROR = require('./_errors');
var ingredients = new Database('ingredients');
var database = new Database('recipes');

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
}, function (params, callback) {
	async.waterfall([
		function (next) {
			// Check if ingredients are goods
			return async.map(_.pluck(params.ingredients, 'id'), ingredients.get.bind(ingredients), next);
		},
		function (docs, next) {
			return database.save(params, next);
		}
	], callback);
});

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
				ingredients[i].quantity = _recipe.ingredients[i].quantity;
			}
			_recipe.ingredients = ingredients;
			return next(null, _recipe);
		}
	], callback);
});