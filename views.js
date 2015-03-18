fs = require('fs');
function view(conf) {
	var r = "";
	if (!conf.viewBag) {
		conf.viewBag = {};
	}
	fs.readFile('./web/views/' + conf.page + ".html", 'utf8', function (err, data) {
		if (err) {
			console.log("Error buscando View");
		} else {
			r = data;
			for (var i in conf.viewBag) {
				var re = new RegExp("{" + i + "}", 'g');
				r = r.replace(re, conf.viewBag[i]);
			}
		}
		if (conf.masterPage) {
			var r2 = "";
			fs.readFile('./web/views/' + conf.masterPage + ".html", 'utf8', function (err2, data2) {
				if (err2) {
					console.log("Error buscando MasterPage");
				} else {
					r2 = data2;
					var re2 = new RegExp("{content}", 'g');
					r2 = r2.replace(re2, r);
				}
				conf.response.writeHead(200, {
					"Content-Type": "text/html",
					"Access-Control-Allow-Origin": "*"
				});
				conf.response.write(r2);
				conf.response.end();
				//console.log(data, r);
			});

		} else {
			conf.response.writeHead(200, {
				"Content-Type": "text/html",
				"Access-Control-Allow-Origin": "*"
			});
			conf.response.write(r);
			conf.response.end();
		}
		//console.log(data, r);
	});

}
exports.returnView = view;


