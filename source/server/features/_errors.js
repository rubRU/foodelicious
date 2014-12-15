var database = new Database('errors_' + new Date());

var ERRORS = {
	400: "Bad parameters",
	401: "Bad autentification",
	403: "Forbidden",
	500: "Internal error"
}

module.exports = function (status, message) {
	if (!ERRORS[status])
		status = 500;
	var obj = {
		status: status,
		error: ERRORS[status],
		message: message
	};
	database.save(obj, function (err) {
		if (err) return console.error(err);
	});
	return obj;
};