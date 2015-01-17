var fs = require('fs'),
    readline = require('readline');


function Parser(file, schema, handler) {
	console.log('[ Parsing file "' + file + '" ] ...');
	this.filename = file;
	this.start = +(new Date);
	this.handler = handler;
	this.regExp = new RegExp("~", "gi");
	this.schema = schema;
	this.timeout = new Timer(this.end.bind(this), 100);
	this.stack = [];
	this.count = 0;
	this.waiter = setInterval(this.print.bind(this), 1000);

	this.rd = readline.createInterface({
	    input: fs.createReadStream(this.filename),
	    output: process.stdout,
	    terminal: false
	});
	this.rd.on('line', this.line.bind(this));
	return this;
}

Parser.prototype.line = function (line) {
	this.timeout.stop();
	++this.count;
	line = line.replace(this.regExp, '');
	line = line.split('^');
	var obj = {};
	for (var i in this.schema) {
		obj[this.schema[i]] = line[i];
	}
	this.handler(obj);
	this.timeout.start();
};

Parser.prototype.print = function() {
	process.stdout.write(this.count + ' lines readed ...\r');
};

Parser.prototype.then = function(file, schema, handler) {
	this.stack.push({ file: file, handler: handler, schema: schema});
	return this;
};
Parser.prototype.end = function () {
	clearInterval(this.waiter);
	process.stdout.write('\n');
	process.stdout.write('[ File "' + this.filename + '" parsed. ' + this.count + ' lines processed in ' + (+(new Date) - this.start) / 1000 +' seconds. ]\n');
	if (!this.stack.length)
		return this.done();
	var el = this.stack.shift();
	var parser = new Parser(el.file, el.schema, el.handler);
	parser.firstStart = this.firstStart || this.start;
	parser.stack = this.stack;
	parser._done = this._done;
};
Parser.prototype.done = function (fn) {
	if (!fn) {
		console.log('[ Parsing done in ' + (+(new Date) - this.firstStart) / 1000 +' seconds. ]');
		return (this._done ? this._done() : null);
	}
	this._done = fn;
	return this;
};

module.exports = Parser;

function Timer(handler, timeout) {
	this.handler = handler;
	this.timeout = timeout;
}

Timer.prototype.start = function () {
	this.stop();
	this._timeout = setTimeout(this.handler, this.timeout);
};
Timer.prototype.stop = function () {
	clearTimeout(this._timeout);
}