var should = require('should');

/* 
	DEPS
	----

	4 - followers
	5 - actions
*/

suite('Feed', function () {

	test('User 1 should comment recipe', function (done) {
		request.post('/recipes/' + DATA.recipes[0].id + '/comments')
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.send({
			comment: "Trop bon !"
		})
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;

			hash.comment.should.equal("Trop bon !");
			hash.createdBy.should.equal(DATA.users[0].id);
			hash.ressource.should.equal(DATA.recipes[0].id);

			done();
		});
	});


	test('Recipe should now have one comment', function (done) {
		request.get('/recipes/' + DATA.recipes[0].id)
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			hash.comments.should.equal(1);
			//TESTS

			done();
		});
	});

	test('Should get comments for the recipe', function (done) {
		request.get('/recipes/' + DATA.recipes[0].id + '/comments')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;

			hash.length.should.equal(1);

			done();
		});
	});

	test('Should get comments for the recipe', function (done) {
		request.get('/recipes/' + DATA.recipes[0].id + '/comments')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;

			hash.length.should.equal(1);

			done();
		});
	});

	test('Should get feed for connected user', function (done) {
		request.get('/user/feed')
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			should.exist(hash.feed);
			hash.feed.length.should.equal(1);

			done();
		});		
	});

	test('Should get feed for designed user', function (done) {
		request.get('/user/' + DATA.users[1].id + '/feed')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			should.exist(hash.feed);
			hash.feed.length.should.equal(0);

			done();
		});
	});

	test('Should get feed for designed user', function (done) {
		request.get('/user/' + DATA.users[0].id + '/feed')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			should.exist(hash.feed);
			hash.feed.length.should.equal(1);

			done();
		});		
	});

	test('User 2 should follow User 1', function (done) {
		request.post('/users/' + DATA.users[0].id + '/follow')
		.set('X-API-user', DATA.users[1].id)
		.set('X-API-token', DATA.users[1].token)
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;

			hash.ok.should.equal(true);

			done();
		});		
	});

	test('User 1 should comment recipe', function (done) {
		request.post('/recipes/' + DATA.recipes[0].id + '/comments')
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.send({
			comment: "Vraiment magnifique"
		})
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;

			hash.comment.should.equal("Vraiment magnifique");
			hash.createdBy.should.equal(DATA.users[0].id);
			hash.ressource.should.equal(DATA.recipes[0].id);

			done();
		});
	});

	test('User 2 should have something in the feed', function (done) {
		request.get('/user/feed')
		.set('X-API-user', DATA.users[1].id)
		.set('X-API-token', DATA.users[1].token)
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			should.exist(hash.feed);
			hash.feed.length.should.equal(1);

			done();
		});
	});

	test('Should get feed for designed user', function (done) {
		request.get('/users/' + DATA.users[0].id + '/feed')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			should.exist(hash.feed);
			hash.feed.length.should.equal(2);

			done();
		});		
	});

});

suite('Deprecated methods - Migration support test', function () {
	test('Should get feed for designed user', function (done) {
		request.get('/user/' + DATA.users[0].id + '/feed')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			should.exist(hash.feed);
			hash.feed.length.should.equal(2);

			done();
		});		
	});

	test('User 1 should comment recipe', function (done) {
		request.post('/recipes/' + DATA.recipes[0].id + '/comment')
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.send({
			comment: "Trop bon !"
		})
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;

			hash.comment.should.equal("Trop bon !");
			hash.createdBy.should.equal(DATA.users[0].id);
			hash.ressource.should.equal(DATA.recipes[0].id);

			done();
		});
	});

	test('User 1 should comment recipe', function (done) {
		request.post('/recipes/' + DATA.recipes[0].id + '/comment')
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.send({
			comment: "Vraiment magnifique"
		})
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;

			hash.comment.should.equal("Vraiment magnifique");
			hash.createdBy.should.equal(DATA.users[0].id);
			hash.ressource.should.equal(DATA.recipes[0].id);

			done();
		});
	});
});