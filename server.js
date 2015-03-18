var http = require("http");
var url = require("url");
var api = require("./mySqlApi");

function Start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("call " + pathname + " URL");
		if (pathname.substr(0, 5) == "/api/") {
			var urlParts = pathname.split("/");
			api.connect(urlParts, request, response);
			console.log("call to database api :", urlParts);
		}
		else {
			route(handle, pathname, response);
		}
	}
	http.createServer(onRequest).listen(8888);
	console.log("Server started.");
}

exports.Start = Start;