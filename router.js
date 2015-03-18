fs = require('fs');

function route(handle, pathname, response) {
	var validExtensions = {
		"html": "text/html",
		"js": "text/javascript",
		"css": "text/css",
		"png": "image/png",
		"jpg": "image/jpeg",
		"gif": "image/gif",
		"json": "text/json",
		"svg": "image/svg+xml",
		"ttf": "font/truetype",
		"eot": "application/vnd.ms-fontobject",
		"woff": "application/font-woff"
	};
	//console.log("About to route a request for " + pathname);
	var punto = pathname.lastIndexOf(".");
	var extencion = "";
	if (punto > -1) {
		extencion = pathname.substr(-(pathname.length - punto) + 1, (pathname.length - punto));
		//console.log(extencion, validExtensions[extencion]);
		if (validExtensions[extencion] == undefined) {
			extencion = "";
		}
	}
	//Si es un cotrolador
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response);
	}
		//si es un archivo 
	else if (extencion != "") {
		if (validExtensions[extencion].substr(0, 4) == "text") {
			fs.readFile("./web/" + pathname, 'utf8', function (err, data) {
				if (err) {
					console.log("no aparece " + pathname, err);
					response.writeHead(404, {
						"Content-Type": validExtensions[extencion],
						"Access-Control-Allow-Origin": "*"
					});
					response.end();
				} else {
					response.writeHead(200, {
						"Content-Type": validExtensions[extencion],
						"Access-Control-Allow-Origin": "*"
					});
					response.write(data);
					response.end();
				}
			});
		} else {
			var img = null;
			try {
				img = fs.readFileSync("./web/" + pathname);
				response.writeHead(200, {
					'Content-Type': validExtensions[extencion],
					"Access-Control-Allow-Origin": "*"
				});
				response.end(img, 'binary');
			} catch (e) {
				console.log(e);
				response.writeHead(404, {
					"Content-Type": validExtensions[extencion],
					"Access-Control-Allow-Origin": "*"
				});
				response.end();
			}

		}
		//Si no se encuentra en la lista de requerimientos disponibles o no existe
	} else {
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {
			"Content-Type": "text/html",
			"Access-Control-Allow-Origin": "*"
		});
		response.write("404 Not found");
		response.end();
	}
}
exports.route = route;