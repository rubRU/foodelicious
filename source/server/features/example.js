/*-----------------------
	@desc: Example file
-------------------------*/

/*
	@desc: Exemple hash return
	@return: { ok: true }
	@params: None
*/
io.http.on('get', '/', function (params, callback) {
	return callback(null, { ok: 'true' });
});


/*
	@desc: Example error return
	@return: An error
	@params: None
*/
io.http.on('get', '/error', function (params, callback) {
	return  callback({ error: "MyError" });
});

/*
	@desc: Another ok example
	@return: { ok: true }
	@params: None
*/
io.http.on('get', '/ok', { ok: true });


/*
	@desc: Validation example
	@return: Parameters
	@params: :value = value returned in { ok };
*/
io.http.on('get', '/ok/:value', {
	// Params validation (optional)
	"value": { type: 'string', minLength: 3 }
}, function (params, callback) {
	return callback(null, { ok: params.value });
});