var Views = require("./views").returnView;
var mysql = require('mysql');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

function testApi(response) {
	console.log("Controller testApi");
	Views({
		page: "testUnit",
		response: response,
		masterPage: "masterPage"
	});

}

function home(response) {
	console.log("Controller Home");
	var viewBag = {
		nombre: "Roman",
		apellido: "Ferreiras",
		token: "654654654bjghf"
	};
	//var viewConf={page:"home", viewBag:viewBag, response: response};
	Views({
		page: "home",
		viewBag: viewBag,
		response: response,
		masterPage: "masterPage"
	});
}

function mongoAbstr(response) {
	var mongoConObj = {
		server: "192.168.1.100:27017",
		dataBase: "ConciergeDb_Stg"
	};
	MongoClient.connect("mongodb://" + mongoConObj.server + "/" + mongoConObj.dataBase, function (err, db) {
		if (!err) {
			var one = db.collection('Product');
			//console.log(one);
			var pp = db.admin().listDatabases(function(err, dbs) {
				console.log(err,"W2");
				console.log(dbs);
  			});


			var n2 = one.find({
				_id: 1
			}).toArray(function (err, docs) {
				var viewBag = {
					tablas: ""
				};
				console.log(err,"W3");
				
				console.log(docs);
				viewBag.tablas = JSON.stringify(docs);
				Views({
					page: "mySqlAbstr",
					viewBag: viewBag,
					response: response,
					masterPage: "masterPage"
				});
				db.close();
			});
			console.log("We are connected to Mongo", n2);

			//viewBag.tablas = JSON.stringify(n2);

		}
		
	});
}

function mySqlAbstr(response) {
	console.log("Controller mySqlAbstr");
	//ViewBag Definition
	var viewBag = {
		tablas: ""
	};
	//MySqlConnection
	var connectionObj = {
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'Delfine',
		port: 3306
	};
	var connection = mysql.createConnection(connectionObj);
	connection.connect(function (error) {
		if (error) {
			console.log("-------- Error ---------");
			console.log(error);
			console.log("-------- Error ---------");
		} else {
			console.log('Conexion correcta.');
		}
	});
	//Run query to get all tables definitions 
	var query = connection.query("select table_name,COLUMN_NAME,DATA_TYPE from information_schema.columns where table_schema = '" + connectionObj.database + "' order by table_name,ordinal_position", [], function (error, result) {
		if (error) {
			console.log("-------- Error ---------");
			console.log(error);
			console.log("-------- Error ---------");
		} else {
			viewBag.tablas = JSON.stringify(result);
			Views({
				page: "mySqlAbstr",
				viewBag: viewBag,
				response: response,
				masterPage: "masterPage"
			});

			var resultado = result;
			var oldTableName = "";
			var r = {};
			var iTables = -1;
			if (resultado.length > 0) {
				for (var i in resultado) {
					//group by tablename
					if (oldTableName != resultado[i].table_name) {
						r[resultado[i].table_name] = {};
						oldTableName = resultado[i].table_name;
						console.log(resultado[i].table_name);
					}
					r[resultado[i].table_name][resultado[i].COLUMN_NAME] = {
						type: resultado[i].DATA_TYPE
					};
					console.log("\t " + resultado[i].COLUMN_NAME + '\t \t ' + resultado[i].DATA_TYPE);
				}
				var outputFilename = 'ModelDef.json';
				fs.writeFile(outputFilename, JSON.stringify(r, null, 4), function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log("JSON saved to " + outputFilename);
					}
				});
			} else {
				console.log('Registro no encontrado');
			}
		}
	});
	connection.end();
}

exports.home = home;
exports.mySqlAbstr = mySqlAbstr;
exports.mongoAbstr = mongoAbstr;
exports.testApi = testApi;