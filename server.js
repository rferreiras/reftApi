var http = require("http");
// var https = require("https");
var url = require("url");
var fs = require("fs");

function Start(route, handle) {
	// var options = {
	// 	key: fs.readFileSync('App/key.key'),
	// 	cert: fs.readFileSync('App/crt.crt')
	//   };
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		route(handle, pathname, response, request);
	}
	http.createServer(onRequest).listen(8080, "0.0.0.0");
	// https.createServer(options,onRequest).listen(8092, "0.0.0.0");
	console.log("Server started.");
}
exports.Start = Start;
