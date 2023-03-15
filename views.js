/* global Diccionario */
var fs = require("fs");

function view(conf) {
	var r = "";
	var r2 = "";

	if (!conf.viewBag) {
		conf.viewBag = {};
	}
	if (!conf.cookies) {
		conf.cookies = {};
	}
	fs.readFile("./views/" + conf.page + ".html", "utf8", function (err, data) {
		if (err) {
			console.log("Error buscando View", "views/" + conf.page + ".html", err);
		} else {
			r = data;
		}
		// const regex = /{file:.+}/gi;
		if (conf.masterPage) {
			//fs.readFile('views/' + conf.masterPage + ".html", 'utf8', function (err2, data2) {
			if (fs.existsSync("./views/" + conf.masterPage + ".html")) {
				var data2 = fs.readFileSync(
					"./views/" + conf.masterPage + ".html",
					"utf8"
				);
				r2 = data2;
				var re2 = new RegExp("{content}", "g");
				var re3 = new RegExp("{Diccionario}", "g");
				r2 = r2.replace(re2, r);
				// var reFiles = new RegExp("[{]file:.+[}]", 'gi');
				var reFiles = /[{]file:.+[}]/g;
				// console.log(r2);
				var m = r2.match(reFiles);
				if (m) {
					for (ii = 0; ii < m.length; ii++) {
						var i = m[ii].replace("{file:", "./");
						i = i.replace("}", "");
						if (fs.existsSync( i)) {
							var data3 = fs.readFileSync( i, "utf8");
							r2 = r2.replace(m[ii], data3);
							r2 = r2.replace(m[ii], "");
							// repite el bucle en un nuevo nivel
							var m2 = r2.match(reFiles);
							if (m2) {
								for (ii2 = 0; ii2 < m2.length; ii2++) {
									// console.log("more" + m2[ii2], ii2);
									var i2 = m2[ii2].replace("{file:", "./");
									i2 = i2.replace("}", "");
									// console.log(m[0], i);
									if (fs.existsSync(i2)) {
										data3 = fs.readFileSync( i2, "utf8");
										r2 = r2.replace(m2[ii2], data3);
										r2 = r2.replace(m2[ii2], "");
									}
								}
							}
						}
					}
				}
				// r2 = r2.replace(re3, escape(Diccionario));
				r = r2;
			} else {
				console.log(
					"Error buscando MasterPage",
					"views/" + conf.masterPage + ".html"
				);
			}
		} else {
			// console.log("no Master page:");
		}
		for (var i in conf.viewBag) {
			var re = new RegExp("{" + i + "}", "g");
			r = r.replace(re, conf.viewBag[i]);
		}
		var MyCookies = "";
		for (var i in conf.cookies) {
			MyCookies += i + "=" + conf.cookies[i] + ";";
		}
		//console.log(data, r);
		conf.response.writeHead(200, {
			"Content-Type": "text/html",
			"access-control-expose-headers": "Set-Cookie",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
			"set-cookie": MyCookies,
		});
		conf.response.write(r);
		conf.response.end();
	});
}
exports.returnView = view;
