var async = require('async');
var ERROR = require('./_errors');
var database = new Database('ingredients', { 'name': true });


io.http.on('get', '/ingredients', function (params, callback) {
	return database.findAll(params, callback);
});

io.http.on('post', '/ingredients', {
	name: { type: 'string', minLength: 1 },
	calories: { type: 'number', optional: true },
	cholesterol: { type: 'number', optional: true },
	fat: {
		type: 'object',
		optional: true,
		properties: {
			satured: { type: 'number', optional: true },
			polyunsaturated: { type: 'number', optional: true },
			monounsaturated: { type: 'number', optional: true },
		}
	},
	sodium: { type: 'number', optional: true },
	potassium: { type: 'number', optional: true },
	protein: { type: 'number', optional: true },
	sugar: { type: 'number', optional: true },
	vitamins: {
		type: 'object',
		optional: true,
		properties: {
			a: { type: 'number', optional: true },
			c: { type: 'number', optional: true },
			d: { type: 'number', optional: true },
			b12: { type: 'number', optional: true },
			b6: { type: 'number', optional: true },
		}
	},
	iron: { type: 'number', optional: true },
	calcium: { type: 'number', optional: true },
	magnesium: { type: 'number', optional: true }
}, function (params, callback) {
	async.waterfall([
		function (next) {
			return database.find({ name: params.name }, next);
		},
		function (ingredients, next) {
			if (ingredients.hits.length) return next(ERROR(400, "Ingredient [" + params.name + "] already exists."));
			return database.save(params, next);
		}
	], callback);
});

io.http.on('put', '/ingredients/:id', {
	id: { type: 'string', minLength: 5 },
	calories: { type: 'number', optional: true },
	cholesterol: { type: 'number', optional: true },
	fat: {
		type: 'object',
		optional: true,
		properties: {
			satured: { type: 'number', optional: true },
			polyunsaturated: { type: 'number', optional: true },
			monounsaturated: { type: 'number', optional: true },
		}
	},
	sodium: { type: 'number', optional: true },
	potassium: { type: 'number', optional: true },
	protein: { type: 'number', optional: true },
	sugar: { type: 'number', optional: true },
	vitamins: {
		type: 'object',
		optional: true,
		properties: {
			a: { type: 'number', optional: true },
			c: { type: 'number', optional: true },
			d: { type: 'number', optional: true },
			b12: { type: 'number', optional: true },
			b6: { type: 'number', optional: true },
		}
	},
	iron: { type: 'number', optional: true },
	calcium: { type: 'number', optional: true },
	magnesium: { type: 'number', optional: true }
}, function (params, callback) {
	async.waterfall([
		function (next) {
			return database.get(params.id, next);
		},
		function (ingredient, next) {
			return database.merge(params, next);
		}
	], callback);
});