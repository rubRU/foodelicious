var database = new Database('errors');

var ERRORS = {
	400: "Bad parameters",
	401: "Bad authentification",
	404: "Not found",
	403: "Forbidden",
	500: "Internal error"
}

module.exports = function (status, message, details) {
	if (!ERRORS[status])
		status = 500;
	var obj = {
		status: status,
		error: ERRORS[status],
		message: message
	};
	if (details)
		obj.details = details;
	if (obj.status !== 500)
		return obj;
	database.save(obj, function (err) {
		if (err) return console.error(err);
	});
	return obj;
};