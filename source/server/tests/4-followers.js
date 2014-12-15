var should = require('should');

/*
	DEPENDECIES
	-----------

	- 1-users.js
*/

suite('Followers', function () {
	test('User 1 should start following User 2', function (done) {
		request.post('/users/' + DATA.users[1].id + '/follow')
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			hash.ok.should.equal(true);

			done();
		});
	});

	test('Should get all followers for User 2', function (done) {
		request.get('/users/' + DATA.users[1].id + '/followers')
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			hash.followers.length.should.equal(1);

			done();
		});
	});

	test('Should not crash with start > count', function (done) {
		request.get('/users/' + DATA.users[1].id + '/followers?start=2')
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			hash.followers.length.should.equal(0);

			done();
		});
	});


	test('Checking User 2 hash', function (done) {
		request.get('/users/' + DATA.users[1].id)
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			hash.followers.should.equal(1);
			hash.following.should.equal(0);

			done();
		});
	});

	test('Checking User 1 hash', function (done) {
		request.get('/users/' + DATA.users[0].id)
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			hash.followers.should.equal(0);
			hash.following.should.equal(1);

			done();
		});
	});

	test('User 1 should stop following User 2', function (done) {
		request.post('/users/' + DATA.users[1].id + "/unfollow")
		.set('X-API-user', DATA.users[0].id)
		.set('X-API-token', DATA.users[0].token)
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			hash.ok.should.equal(true);

			done();
		});
	});

	test('User 2 should not have followers', function (done) {
		request.get('/users/' + DATA.users[1].id + '/followers')
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			hash.followers.length.should.equal(0);

			done();
		});
	});

	test('Checking User 2 hash', function (done) {
		request.get('/users/' + DATA.users[1].id)
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			hash.followers.should.equal(0);
			hash.following.should.equal(0);

			done();
		});
	});

	test('Checking User 1 hash', function (done) {
		request.get('/users/' + DATA.users[0].id)
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			hash.followers.should.equal(0);
			hash.following.should.equal(0);

			done();
		});
	});
});