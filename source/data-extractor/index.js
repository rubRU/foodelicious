var Parser = require('./Parser');
var fs = require('fs');

var units = {
	'g': 1,
	'mg': (1/1000),
	'µg': (1/1000000)
}
var nutriments = {
	'208': [units['g'], 'calories'],
	'601': [units['mg'],'cholesterol'],
	'606': [units['g'], 'fat.satured'],
	'645': [units['g'], 'fat.monounsaturated'],
	'646': [units['g'], 'fat.polyunsaturated'],
	'307': [units['mg'], 'sodium'],
	'306': [units['mg'], 'potassium'],
	'203': [units['g'], 'protein'],
	'269': [units['g'], 'sugar'],
	'320': [units['µg'], 'vitamins.a'],
	'401': [units['mg'], 'vitamins.c'],
	'328': [units['µg'], 'vitamins.d'],
	'418': [units['µg'], 'vitamins.b12'],
	'415': [units['mg'], 'vitamins.b6'],
	'303': [units['mg'], 'iron'],
	'301': [units['mg'], 'calcium'],
	'304': [units['mg'], 'magnesium'],
}
var ingredients = {};

function addNutriment(obj) {
	if (!nutriments.hasOwnProperty(obj.nutrID))
		return;
	if (!ingredients.hasOwnProperty(obj.itemID))
		ingredients[obj.itemID] = {}; 
	var nMultiplicateur = nutriments[obj.nutrID][0];
	var nName = nutriments[obj.nutrID][1];
	var ingredient = ingredients[obj.itemID];
	if (nName.indexOf('.') !== -1) {
		var path = nName.split('.');
		if (!ingredient.hasOwnProperty(path[0]))
			ingredient[path[0]] = {};
		ingredient = ingredient[path[0]];
		nName = path[1];
	}
	ingredient[nName] = obj.value * nMultiplicateur;
	return;
}

new Parser(
	__dirname + '/raw/NUT_DATA.txt',
	['itemID', 'nutrID', 'value'],
	function (obj) {
		return addNutriment(obj);
	})
	.then(
	__dirname + '/raw/FOOD_DES.txt',
	['itemID', 'groupID', 'longName', 'shortName'],
	function (obj) {
		if (!ingredients[obj.itemID])
			return;
		ingredients[obj.itemID].name = obj.longName;
	})
	.done(function () {
		fs.writeFileSync('./output.json', JSON.stringify(ingredients));
	})


// {
// 	name: { type: 'string', minLength: 1 },
// 	calories: { type: 'number', optional: true },
// 	cholesterol: { type: 'number', optional: true },
// 	fat: {
// 		type: 'object',
// 		optional: true,
// 		properties: {
// 			satured: { type: 'number', optional: true },
// 			polyunsaturated: { type: 'number', optional: true },
// 			monounsaturated: { type: 'number', optional: true },
// 		}
// 	},
// 	sodium: { type: 'number', optional: true },
// 	potassium: { type: 'number', optional: true },
// 	protein: { type: 'number', optional: true },
// 	sugar: { type: 'number', optional: true },
// 	vitamins: {
// 		type: 'object',
// 		optional: true,
// 		properties: {
// 			a: { type: 'number', optional: true },
// 			c: { type: 'number', optional: true },
// 			d: { type: 'number', optional: true },
// 			b12: { type: 'number', optional: true },
// 			b6: { type: 'number', optional: true },
// 		}
// 	},
// 	iron: { type: 'number', optional: true },
// 	calcium: { type: 'number', optional: true },
// 	magnesium: { type: 'number', optional: true }
// }
	