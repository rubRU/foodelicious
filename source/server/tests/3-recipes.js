var should = require('should');

DATA.recipes = [];
suite('Recipes', function () {

	test('Should create a recipe', function (done) {
		request
		.post('/recipes')
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.send({
			name: 'Peanut cake',
			"for": 2,
			ingredients: [
				{
					id: DATA.ingredients[0].id,
					quantity: "200g"
				},
				{
					id: DATA.ingredients[1].id,
					quantity: "1L"
				}
			],
			steps: [
				"Put the peanut and the milk in a bowl",
				"Shake it, baby!",
				"Put this in the oven",
				"Enjoy your milky peanuted 'cake' (or smthg)."
			]
		})
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;


			should.exist(hash.name);
			should.exist(hash.id);

			should.exist(hash.ingredients);
			hash.ingredients[0].id.should.eql(DATA.ingredients[0].id);
			hash.ingredients[1].id.should.eql(DATA.ingredients[1].id);

			DATA.recipes.push(hash);

			done();
		});
	});

	test('Should get a recipe', function (done) {
		request
		.get('/recipes/' + DATA.recipes[0].id)
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;


			should.exist(hash.name);
			should.exist(hash.id);

			should.exist(hash.ingredients);
			hash.ingredients.should.containEql(DATA.ingredients[0]);
			hash.ingredients.should.containEql(DATA.ingredients[1]);

			done();
		});
	});
});