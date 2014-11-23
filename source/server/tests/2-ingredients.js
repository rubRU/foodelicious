var should = require('should');

DATA.ingredients = [];

suite('Ingredients', function () {

		var _product = null;

		test('Should create an ingredient', function (done) {

			request
			.post('/ingredients')
			.send({ name: 'Peanut' })
			.set('Accept', 'application/json')
			.expect(200, function (err, ret) {
				should.not.exist(err);
				should.exist(ret);
				should.exist(ret.body);
				var hash = ret.body;


				should.exist(hash.name);
				should.exist(hash.id);

				DATA.ingredients.push(hash);

				done();
			});

		});

		test('Should not create an ingredient with no name', function (done) {
			request
			.post('/ingredients')
			.send({})
			.set('Accept', 'application/json')
			.expect(400, done);
		});

		test('Should not create an ingredient with previously created name', function (done) {
			request
			.post('/ingredients')
			.send({ name: 'Peanut' })
			.set('Accept', 'application/json')
			.expect(400, done);
		});

		test('Should create a full hash ingredient', function (done) {
			request
			.post('/ingredients')
			.send({
				name: "Milk",
				calories: 750,
				cholesterol: 10,
				fat: {
					satured: 20,
					polyunsaturated: 30,
					monounsaturated: 40,
				},
				sodium: 50,
				potassium: 60,
				protein: 70,
				sugar: 80,
				vitamins: {
					a: 5,
					c: 6,
					d: 8,
					b12: 10,
					b6: 11,
				},
				iron: 20,
				calcium: 40,
				magnesium: 50
			})
			.set('Accept', 'application/json')
			.expect(200, function (err, ret) {
				should.not.exist(err);
				should.exist(ret);
				should.exist(ret.body);
				var hash = ret.body;


				should.exist(hash.name);
				should.exist(hash.id);
				hash.name.should.equal('Milk');
				hash.calories.should.equal(750);
				hash.cholesterol.should.equal(10);
				should.exist(hash.fat);
				hash.fat.satured.should.equal(20);
				hash.fat.polyunsaturated.should.equal(30);
				hash.fat.monounsaturated.should.equal(40);
				hash.sodium.should.equal(50);
				hash.potassium.should.equal(60);
				hash.protein.should.equal(70);
				hash.sugar.should.equal(80);
				should.exist(hash.vitamins);
				hash.vitamins.a.should.equal(5);
				hash.vitamins.c.should.equal(6);
				hash.vitamins.d.should.equal(8);
				hash.vitamins.b12.should.equal(10);
				hash.vitamins.b6.should.equal(11);
				hash.iron.should.equal(20);
				hash.calcium.should.equal(40);
				hash.magnesium.should.equal(50);

				DATA.ingredients.push(hash);
				done();
			});
		});
		
		test('Should update an ingredient', function (done) {
			request
			.put('/ingredients/' + DATA.ingredients[1].id)
			.send({
				name: "Milk",
				calories: 20,
				fat: {
					satured: 30,
				}
			})
			.set('Accept', 'application/json')
			.expect(200, function (err, ret) {
				should.not.exist(err);
				should.exist(ret);
				should.exist(ret.body);
				var hash = ret.body;

				hash.calories.should.equal(20);
				should.exist(hash.fat);
				hash.fat.satured.should.equal(30);
				hash.fat.polyunsaturated.should.equal(30);
				hash.sugar.should.equal(80);
				should.exist(hash.vitamins);
				hash.vitamins.a.should.equal(5);
				hash.vitamins.c.should.equal(6);

				DATA.ingredients[1] = hash;
				done();
			});
		});

		test('Should get ingredients', function (done) {
			request
			.get('/ingredients?fields=name,id')
			.set('Accept', 'application/json')
			.expect(200, function (err, ret) {
				should.not.exist(err);
				should.exist(ret);
				should.exist(ret.body);
				var hash = ret.body;
				
				hash.hits.should.containEql({
					name: DATA.ingredients[0].name,
					id: DATA.ingredients[0].id
				});

				hash.hits.should.containEql({
					name: DATA.ingredients[1].name,
					id: DATA.ingredients[1].id
				});
		
				done();
			});
		});

});