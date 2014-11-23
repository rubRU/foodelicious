var should = require('should');

DATA.users = [];
suite('Authentification', function () {
	test('Should create an user', function (done) {
		request.post('/users')
		.send({
			email: "dafunix@gmail.com",
			password: "SalutLesCopains",
			name: "Romuald"
		})
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;


			should.exist(hash.email);
			should.exist(hash.id);

			DATA.users.push(hash);

			done();
		});
	});

	test('Should not recreate a user with same email', function (done) {
		request.post('/users')
		.send({
			email: "dafunix@gmail.com",
			password: "SalutLesCopains",
			name: "Romuald"
		})
		.set('Accept', 'application/json')
		.expect(400, done);
	});

	test('Should get to a protected page', function (done) {
		request.get('/user')
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;


			should.exist(hash.email);
			should.exist(hash.id);

			done();
		});
	});

	test('Should fail with bad auth', function (done) {
		request.get('/user')
		.auth(DATA.users[0].email, 'sdfisdiofd')
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.exist(err);
			should.not.exist(ret.body.email);
			done();
		});
	});

	test('Should get an user', function (done) {
		request.get('/users/' + DATA.users[0].id)
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			hash.email.should.equal(DATA.users[0].email);
			hash.following.should.equal(0);
			hash.followers.should.equal(0);
			should.not.exist(hash.token);

			done();
		});
	});

	test('Should create another user', function (done) {
		request.post('/users')
		.send({
			email: "dafunix2@gmail.com",
			password: "SalutLesCopains",
			name: "Michel"
		})
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;


			should.exist(hash.email);
			should.exist(hash.id);


			DATA.users.push(hash);

			done();
		});
	});


	// TODO PUT
});