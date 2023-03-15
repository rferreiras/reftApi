var pEtts = [0, 1, 2, 3, 4, 5, 6, 7, 3, 4, 3, 5, 5, 6, 5, 7, 7, 8, 7, 8, 9, 10, 9, 10, 11, 12, 11, 13, 13, 14, 13];
// a global month names array
var gsMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// a global day names array
var gsDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// the date format prototype
try {
	lData = JSON.parse(sessionStorage.datosUsuario);
}
catch (e) {
	estaLogeado = false;
}
var urlActual = document.createElement('a');
urlActual.href = document.location.href;
var debugMode = true;
if (estaLogeado) {
	$("#loginBt").hide();
}
function Money(n) {
	console.log(n);
	if (Number.isNaN(n) || n==undefined || n==null) {
		console.log(n);
		return "0.00";
	}
	var r = "" + n;
	var point = r.indexOf(".");
	if (point == -1) {
		r = r + ".00";
		point = r.indexOf(".");
	}
	var decimals = r.substring(point + 1, r.length);
	if (decimals.length == 1) {
		r = r + "0";
	}
	if (decimals.length > 2) {
		r = r.substring(0, point + 3);
	}
	for (var i = point, n = 0; i > 0; i--, n++) {
		if (n % 3 == 0 && n > 0) {
			r = r.substring(0, i) + "," + r.substring(i);
		}
	}
	console.log(r);
	return "$" + r;
}
//set util
var mls2seg = 1000; //miliseconds in a second
var mls2min = 60 * mls2seg; //miliseconds in one minute
var mls2hour = 60 * mls2min; //miliseconds in an hour
/*******************************************************************************
 * funciones de utilidades
 * Pendiente mover a libreria
 *******************************************************************************/
String.prototype.zf = function (n) {
	return '0'.times(n - this.length) + this;
};
String.prototype.times = function (n) {
	var s = '';
	for (var i = 0; i < n; i++)
		s += this;
	return s;
};
Date.prototype.format = function (f) {
	if (!this.valueOf())
		return '&nbsp;';
	var d = this;
	return f.replace(/(yyyy|mmmm|mmm|mm|dddd|ddd|dd|oo|hh|nn|ss|a\/p)/gi,
		function ($1) {
			switch ($1.toLowerCase()) {
				case 'yyyy':
					return d.getFullYear();
				case 'mmmm':
					return gsMonthNames[d.getMonth()];
				case 'mmm':
					return gsMonthNames[d.getMonth()].substr(0, 3);
				case 'mm':
					return (d.getMonth() + 1).toString().zf(2);
				case 'dddd':
					return gsDayNames[d.getDay()];
				case 'ddd':
					return gsDayNames[d.getDay()].substr(0, 3);
				case 'dd':
					return d.getDate().toString().zf(2);
				case 'oo':
					return d.getHours().toString().zf(2);
				case 'hh':
					return ((h = d.getHours() % 12) ? h : 12).toString().zf(2);
				case 'nn':
					return d.getMinutes().toString().zf(2);
				case 'ss':
					return d.getSeconds().toString().zf(2);
				case 'a/p':
					return d.getHours() < 12 ? 'am' : 'pm';
			}
		}
	);
}

function getCookies() {
	var r = {};
	var c = document.cookie.split(";");
	for (var i in c) {
		var v = c[i].split("=");
		r[v[0]] = v[1];
	}
	return r;
}

function setCookies(val) {
	var r = "";
	for (var i in val) {
		r += i + "=" + val[i] + ";";
	}
	document.cookie = r;
}

function isDate(jsonDate) {
	if (jsonDate && jsonDate.toISOString) {
		var fregex = /[0-9]+-[0-9]+-[0-9]+[Tt][0-9]+:[0-9]+:[0-9]+[.][0-9]+[Zz]/gi;
		var r = fregex.exec(jsonDate.toISOString());
		//	console.log(r);
		if (r != null) {
			return true;
		}
	}
	else {
		var fregex = /[0-9]+-[0-9]+-[0-9]+[Tt][0-9]+:[0-9]+:[0-9]+[.][0-9]+[Zz]/gi;
		var r = fregex.exec(jsonDate);
		//	console.log(r);
		if (r != null) {
			return true;
		}
	}
	return false;
}

function isValidDate(date) {
	var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
	if (matches == null)
		return false;
	var d = matches[2];
	var m = matches[1] - 1;
	var y = matches[3];
	var composedDate = new Date(y, m, d);
	return composedDate.getDate() == d &&
		composedDate.getMonth() == m &&
		composedDate.getFullYear() == y;
}

//**************************************************************************
//relaciones y filtros
//**************************************************************************

//**************************************************************************
//relaciones y filtros
//**************************************************************************

/****************************************************************************************************************************************
 *
 *
 ****************************************************************************************************************************************/
var dateLib = {
	meses: {
		1: {
			name: "enero",
			mini: "ene"
		},
		2: {
			name: "febrero",
			mini: "feb"
		},
		3: {
			name: "marzo",
			mini: "mar"
		},
		4: {
			name: "abril",
			mini: "abr"
		},
		5: {
			name: "mayo",
			mini: "may"
		},
		6: {
			name: "junio",
			mini: "jun"
		},
		7: {
			name: "julio",
			mini: "jul"
		},
		8: {
			name: "agosto",
			mini: "ago"
		},
		9: {
			name: "septiembre",
			mini: "sep"
		},
		"01": {
			name: "enero",
			mini: "ene"
		},
		"02": {
			name: "febrero",
			mini: "feb"
		},
		"03": {
			name: "marzo",
			mini: "mar"
		},
		"04": {
			name: "abril",
			mini: "abr"
		},
		"05": {
			name: "mayo",
			mini: "may"
		},
		"06": {
			name: "junio",
			mini: "jun"
		},
		"07": {
			name: "julio",
			mini: "jul"
		},
		"08": {
			name: "agosto",
			mini: "ago"
		},
		"09": {
			name: "septiembre",
			mini: "sep"
		},
		10: {
			name: "octubre",
			mini: "oct"
		},
		11: {
			name: "noviembre",
			mini: "nov"
		},
		12: {
			name: "diciembre",
			mini: "dic"
		}
	},
	diasSemana: {
		0: {
			name: "domingo",
			mini: "dom"
		},
		1: {
			name: "lunes",
			mini: "lun"
		},
		2: {
			name: "martes",
			mini: "mar"
		},
		3: {
			name: "miercoles",
			mini: "mie"
		},
		4: {
			name: "jueves",
			mini: "jue"
		},
		5: {
			name: "viernes",
			mini: "vie"
		},
		6: {
			name: "sabado",
			mini: "sab"
		},
	},
	isADate: function (f) {
		if (~~f.getFullYear) {
			return true;
		}
		if (typeof (f) == "string") {
			var fregex = /[0-9]+-[0-9]+-[0-9]+[Tt][0-9]+:[0-9]+:[0-9]+[.][0-9]+[Zz]/gi;
			var fregex2 = /[0-9]+-[0-9]+-[0-9]/gi;
			var r2 = fregex.exec(f) || fregex2.exec(f);
			//			console.log(r2);
			if (r2) {
				return true;
			}
			return false;
		}
		return false;
	},
	toString: function (f) {
		var r = false;
		var tipoVariable = typeof (f);
		if (tipoVariable == "object" && f) {
			if (f.getFullYear) {
				r = true;
			}
		}
		else if (tipoVariable == "string" && f) {
			var fregex = /[0-9]+-[0-9]+-[0-9]+[Tt][0-9]+:[0-9]+:[0-9]+[.][0-9]+[Zz]/gi;
			var r2 = fregex.exec(f);
			//			console.log(r2);
			if (r2 != null) {
				r = true;
			}
		}
		return r;
	},
	isDateType: function (f) {
		if (f) {
			return ~~f.getFullYear;
		} else {
			return false;
		}
	},
	getFecha: function (f) {
		var r = f ? new Date(f) : new Date();
		return r.getFullYear() + "-" + (r.getMonth() + 1) + "-" + r.getDate();
	},
	getHora: function (n) {
		var f = n ? new Date(n) : new Date();
		var r = "";
		r += f.getHours() > 12 ? f.getHours() - 12 : f.getHours();
		r += ":" + f.getMinutes() + ":" + f.getSeconds() + " ";
		r += f.getHours() > 12 ? "pm" : "am";
		return r;
	}
};
Date.prototype.addHours = function (h) {
	this.setTime(this.getTime() + (h * 60 * 60 * 1000));
	return this;
}

/*******************************************************************************
 * Galeria de Fotos Generica
 *******************************************************************************/
function trace(...paramtr) {
	console.log(...paramtr);
}
