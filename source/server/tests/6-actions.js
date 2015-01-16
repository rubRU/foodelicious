var should = require('should');

/* 
	DEPS
	----

	4 - feed
*/
suite('Actions', function () {
	var TESTS = {
		"count": 0,
		"last_id": null,
		"last_type": null
	};

	function checkUser2() {
		test('Should get current feed for user 2', function (done) {
			request
			.get('/user/feed')
			.set('X-API-user', DATA.users[1].id)
			.set('X-API-token', DATA.users[1].token)
			.expect(200, function (err, ret) {
				should.not.exist(err);
				should.exist(ret);
				should.exist(ret.body);
				var hash = ret.body;
				should.exist(hash.feed);
				hash.feed.length.should.equal(TESTS.count);

				hash.feed[0].type.should.equal(TESTS.last_type);
				hash.feed[0].ressource.should.equal(TESTS.last_id);

				done();
			});
		});
	}

	function addAction(type, id) {
		++TESTS.count;
		TESTS.last_id = id;
		TESTS.last_type = type;
	}

	// Should get feed for user 2
	test('Should get current feed for user 2', function (done) {
		request
		.get('/user/feed')
		.set('X-API-user', DATA.users[1].id)
		.set('X-API-token', DATA.users[1].token)
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			TESTS.count = hash.feed.length;
			done();
		});
	});

	// Post recipe 1
	test('User 1 should create a recipe', function (done) {
		request
		.post('/recipes')
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.send({
			name: 'Recipe for feed',
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
			addAction('created', hash.id);
			done();
		});
	});

	// Check feed 2
	checkUser2();

	var temp = null;
	// Like recipe 1
	test('User 1 should like the recipe', function (done) {
		temp = TESTS.last_id;
		request
		.post('/recipes/' + TESTS.last_id + '/like')
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			addAction('like', hash.ressource);
			done();
		});
	});
	// Try to relike recipe 1
	test('User 1 should not be able to relike the recipe', function (done) {
		request
		.post('/recipes/' + temp + '/like')
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.expect(400, done);
	});
	// like recipe 2
	test('User 2 should like the recipe', function (done) {
		request
		.post('/recipes/' + temp + '/like')
		.set('X-API-user', DATA.users[1].id)
		.set('X-API-token', DATA.users[1].token)
		.expect(200, done);
	});

	// Check feed 2
	checkUser2();
});