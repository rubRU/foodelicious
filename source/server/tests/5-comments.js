var should = require('should');

suite('Comments', function () {
	test('User 2 should comment recipe created by User 1', function (done) {
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
});