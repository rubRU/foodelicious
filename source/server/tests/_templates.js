/*
		request.get('url')
		.send({})
		.set('Accept', 'application/json')
		.expect(200, function (err, ret) {
			should.not.exist(err);
			should.exist(ret);
			should.exist(ret.body);
			var hash = ret.body;
			
			//TESTS

			done();
		});

*/