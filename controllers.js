/* global mySqlConnections, Diccionario, tablasSetupApi */
//----------------------------------------------------------------------------------------------------------------------------------
var Views = require("./views").returnView;
// const FsLib = require("fs");
// const filetype = require('magic-bytes.js');
// var QsLib = require('form-data');
// const QsLib = require('querystring');
// var StdLib = require("./lib");
// var TokenLib = require("./tokens");
// var url = require("url");
// var sql2=require("mysql2");
// const formidable = require('formidable');
// const mailer = require("nodemailer");
//----------------------------------------------------------------------------------------------------------------------------------

function home(response, request) {
	console.log("Controller Home");
	//var viewConf={page:"home", viewBag:viewBag, response: response};
	Views({
		page: "app/home",
		response: response,
		masterPage: "core/masterPage",
	});
}
function inicio(response, request) {
	console.log("Controller Home");
	//var viewConf={page:"home", viewBag:viewBag, response: response};
	Views({
		page: "app/home",
		response: response,
		masterPage: "core/masterPage",
	});
}

exports.home = home;
exports.inicio = inicio;
