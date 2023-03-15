var fs = require('fs');
function returnWeb(conf, r) {
	var MyCookies = "";
	for (var i in conf.cookies) {
		MyCookies += i + "=" + conf.cookies + ";";
	}
	conf.response.writeHead(200, {
		"Content-Type": "text/html",
		'Set-Cookie': MyCookies
	});
	conf.response.write(r);
	conf.response.end();
}

function return404(response, pathname) {
	var conf = {};
	conf.viewBag = {
		url: pathname
	};
	conf.masterPage = "core/masterSimple";
	fs.readFile('views/core/e404.html', 'utf8', function (err, data) {
		if (err) {
			console.log("Error buscando View");
		}
		else {
			r = data;
			for (var i in conf.viewBag) {
				var re = new RegExp("{" + i + "}", 'g');
				r = r.replace(re, conf.viewBag[i]);
			}
		}

		var r2 = "";
		fs.readFile('views/' + conf.masterPage + ".html", 'utf8', function (err2, data2) {
			if (err2) {
				console.log("Error buscando MasterPage");
			}
			else {
				r2 = data2;
				var re2 = new RegExp("{content}", 'g');
				r2 = r2.replace(re2, r);
			}

			response.writeHead(404, {
				"Content-Type": "text/html"
			});
			response.write(r2);
			response.end();
			//console.log(data, r);
		});
	});
}
function route(handle, pathname, response, request) {
	var validExtensions = ["js", "css", "png", "jpg","jpeg", "gif", "json", "html", "ico", "ttf", "woff", "woff2","txt","pem"];
	var validTextExtensions = ["js", "css", "json", "html","txt","pem"];
	var validImageExtensions = ["png", "jpg","jpeg", "gif", "ico", "ttf", "woff", "woff2"];
	// console.log("search for : " + pathname);
	var punto = pathname.lastIndexOf(".");
	var extencion = "";
	var extValid = false;
	if (punto > -1) {
		extencion = pathname.substr(-(pathname.length - punto) + 1, (pathname.length - punto));
		extencion = extencion.toLowerCase();
		// console.log(extencion);
		for (var i in validExtensions) {
			if (validExtensions[i] == extencion) {
				extValid = true;
			}
		}
		if (!extValid) {
			extencion = "";
		}
		
	}
	//Si es un cotrolador
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response, request);
	}
	//si es un archivo
	else if (fs.existsSync("./web/" + pathname)) {
		if (validTextExtensions.indexOf(extencion) > -1) {
			fs.readFile("web/" + pathname, 'utf8', function (err, data) {
				if (!err) {
					response.writeHead(200, {
						"Access-Control-Allow-Origin": "*"
					});
					response.write(data);
					response.end();
				} else {
					// console.log("baila 1")
					return404(response, pathname);
				}
			});
			//Si no se encuentra en la lista de requerimientos disponibles o no existe
		} else if (validImageExtensions.indexOf(extencion) > -1) {
			var img = fs.readFileSync("web/" + pathname);
			response.writeHead(200, {
				'Content-Type': 'image/' + extencion,
				"Access-Control-Allow-Origin": "*"
			});
			response.end(img, 'binary');
		} else {
			// console.log("baila 2",extencion)
			return404(response, pathname);
		}
	} else {
		console.log("No request handler found for " + pathname);
		return404(response, pathname);
	}
}
exports.route = route;