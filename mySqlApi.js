//
var fs = require('fs');
var mysql = require('mysql');
var qs = require('querystring');
var mySqlConnection = {
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Delfine',
	port: 3306
};
function connect(urlParts, request, response) {
	//validaciones
	var tablasApi = {};
	console.log("try to connet");
	fs.readFile('./ModelDef.json', 'utf8', function (err, data) {
		if (err) {
			console.log("Error buscando ModelDef.json");
		} else {
			//console.log("ModelDef.json");
			var listTablesRelation = {};
			var tableRelation = function (data) {
				//console.log("*****************************************");
				for (var il1 in data) {
					for (var il2 in data[il1]) {
						console.log(il1, il2, data[il1][il2]);
						if (il2.search("_id") > -1) {
							var targetTable = il2;
							console.log("id ", il2, targetTable);
							if (data[targetTable] != undefined) {
								if (listTablesRelation[il1] == undefined) {
									listTablesRelation[il1] = {};
								}
								listTablesRelation[il1][targetTable] = il2;
								tablasApi[il1][targetTable] = tablasApi[targetTable];
								console.log("table found :", targetTable, il2, il1);
							}
						}
					}
				}
				//console.log("*****************************************");
			};
			var fieldsFor = function (tableName) {
				var r = "";
				var coma = "";
				for (var il3 in tablasApi[tableName]) {
					//console.log(il3);
					if (tablasApi[tableName][il3].type != undefined) {
						r += coma + "`" + il3 + "`";
						coma = ",";
					}
				}
				console.log(r);
				return r;
			};
			tablasApi = JSON.parse(data);
			tableRelation(tablasApi);
			//console.log(data, r);
			var valid = (urlParts.length >= 3) && tablasApi[urlParts[2]] != undefined;
			//console.log(valid, urlParts[2], tablasApi[urlParts[2]]);
			if (urlParts[2] == "getDistance") {
				var lati = urlParts[3];
				var longi = urlParts[4];
				var radio = urlParts[5];
				var qloc = "SELECT * FROM locations where lat>(" + lati + "-" + radio + ") and lat<(" + lati + "+" + radio + ") and `long`>(" + longi + "-" + radio + ") and `long`<(" + longi + "+" + radio + ");";
				var connection = mysql.createConnection(mySqlConnection);
				var query = connection.query(qloc, [], function (error, result) {
					if (error) {
						console.log(lati, longi, radio);
						console.log("-------- Error ---------");
						console.log(error);
						console.log("select " + fieldsFor(urlParts[2]) + " from " + urlParts[2]);
						console.log("-------- Error ---------");
					} else {
						//viewBag.tablas = JSON.stringify(result);
						response.writeHead(200, {
							"Content-Type": "text/json",
							"Access-Control-Allow-Origin": "*"
						});
						console.log(listTablesRelation[urlParts[2]], "::", result, "::", qloc);
						//console.log("normal data","select " + fieldsFor(urlParts[2]) + " from " + urlParts[2]);
						response.writeHead(200, {
							"Content-Type": "text/json",
							"Access-Control-Allow-Origin": "*"
						});
						response.write(JSON.stringify(result));
						response.end();
						connection.end();
					}
				});
			} else if (valid) {
				//var 
				var hasDetailId = Number(urlParts[3]) > 0;
				console.log(">>> ", hasDetailId);
				var f = fieldsFor(urlParts[2]);
				var isRead = request.method == 'GET';
				var isDelete = request.method == 'DELETE' && hasDetailId;
				var isInsert = request.method == 'POST' && !hasDetailId;
				var isUpdate = request.method == 'POST' && hasDetailId;
				if (isRead) {
					console.log("Read");
					var connection = mysql.createConnection(mySqlConnection);
					connection.connect(function (error) {
						if (error) {
							console.log("-------- Error in connection ---------");
							console.log(error);
							console.log("----------------- Error --------------");
						} else {
							console.log('SQLConected');
						}
					});
					//Run query to get all tables definitions 
					if (!hasDetailId) {
						if (!urlParts[3]) {
							var query = connection.query("select " + fieldsFor(urlParts[2]) + " from " + urlParts[2], [], function (error, result) {
								if (error) {
									console.log("-------- Error ---------");
									console.log(error);
									console.log("select " + fieldsFor(urlParts[2]) + " from " + urlParts[2]);
									console.log("-------- Error ---------");
								} else {
									//viewBag.tablas = JSON.stringify(result);
									response.writeHead(200, {
										"Content-Type": "text/json",
										"Access-Control-Allow-Origin": "*"
									});
									console.log(listTablesRelation[urlParts[2]], "::", result);
									if (listTablesRelation[urlParts[2]] != undefined) {
										console.log(" .. ", listTablesRelation[urlParts[2]].length);
										var finishJobCnt = 0;
										var finishJob = function () {
											finishJobCnt++;
											console.log("fin job ", finishJobCnt, result.length, Object.keys(listTablesRelation[urlParts[2]]).length, urlParts[2]);
											if (finishJobCnt == (result.length * Object.keys(listTablesRelation[urlParts[2]]).length)) {
												response.writeHead(200, {
													"Content-Type": "text/json",
													"Access-Control-Allow-Origin": "*"
												});
												response.write(JSON.stringify(result));
												response.end();
											}
										};
										for (var row in result) {
											for (var i in listTablesRelation[urlParts[2]]) {
												console.log(" &&& ", i, listTablesRelation[urlParts[2]][i])
												var query2 = connection.query("select " + fieldsFor(i) + " from " + i + " where id=?", [result[row][listTablesRelation[urlParts[2]][i]]], function (row_, i_) {
													return function (error2, result2) {
														if (error2) {
															console.log("-------- Error ---------");
															console.log(error2, result2, row_, i_);
															console.log("-------- Error ---------");
														} else {
															//console.log(error2, result2,row_,i_);
															result[row_][i_] = result2[0];
														}
														finishJob();
													};
												}(row, i));

											}
										}

									} else {
										//console.log("normal data","select " + fieldsFor(urlParts[2]) + " from " + urlParts[2]);
										response.writeHead(200, {
											"Content-Type": "text/json",
											"Access-Control-Allow-Origin": "*"
										});
										response.write(JSON.stringify(result));
										response.end();
										connection.end();
									}

								}
							});
						}
						else if (urlParts[4]) {
							var query2Do = "select " + fieldsFor(urlParts[2]) + " from " + urlParts[2] + " where `" + urlParts[3] + "` like '%" + urlParts[4] + "%' ";
							if (urlParts[4].indexOf("in(") > -1) {
								query2Do = "select " + fieldsFor(urlParts[2]) + " from " + urlParts[2] + " where `" + urlParts[3] + "` " + urlParts[4];
							}
							console.log(query2Do);

							var query = connection.query(query2Do, [], function (error, result) {
								if (error) {
									console.log("-------- Error ---------");
									console.log("select " + fieldsFor(urlParts[2]) + " from " + urlParts[2]);
									console.log(error);
									console.log(result);
									console.log("-------- Error ---------");
								} else {
									//viewBag.tablas = JSON.stringify(result);
									response.writeHead(200, {
										"Content-Type": "text/json",
										"Access-Control-Allow-Origin": "*"
									});
									//console.log("()::",result);
									if (listTablesRelation[urlParts[2]] != undefined) {
										console.log(" .. ", listTablesRelation[urlParts[2]].length);
										var finishJobCnt = 0;
										var finishJob = function () {
											finishJobCnt++;
											console.log("fin job ", finishJobCnt, result.length, Object.keys(listTablesRelation[urlParts[2]]).length, urlParts[2]);
											if (finishJobCnt == (result.length * Object.keys(listTablesRelation[urlParts[2]]).length)) {
												response.writeHead(200, {
													"Content-Type": "text/json",
													"Access-Control-Allow-Origin": "*"
												});
												response.write(JSON.stringify(result));
												response.end();
											}
										};
										for (var row in result) {
											for (var i in listTablesRelation[urlParts[2]]) {
												// console.log(" &&& ",i,listTablesRelation[urlParts[2]][i])
												var query2 = connection.query("select " + fieldsFor(i) + " from " + i + " where id=?", [result[row][listTablesRelation[urlParts[2]][i]]], function (row_, i_) {
													return function (error2, result2) {
														if (error2) {
															console.log("-------- Error ---------");
															console.log(error2, result2, row_, i_);
															console.log("-------- Error ---------");
														} else {
															//console.log(error2, result2,row_,i_);
															result[row_][i_] = result2[0];
														}
														finishJob();
													};
												}(row, i));

											}
										}

									} else {
										//console.log("normal data","select " + fieldsFor(urlParts[2]) + " from " + urlParts[2]);
										response.writeHead(200, {
											"Content-Type": "text/json",
											"Access-Control-Allow-Origin": "*"
										});
										response.write(JSON.stringify(result));
										response.end();
										connection.end();
									}

								}
							});
						}
					} else {
						var query = connection.query("select * from " + urlParts[2] + " WHERE id=?", [urlParts[3]], function (error, result) {
							if (error) {
								console.log("-------- Error ---------");
								console.log(error);
								console.log("-------- Error ---------");
							} else {
								//viewBag.tablas = JSON.stringify(result);
								response.writeHead(200, {
									"Content-Type": "text/json",
									"Access-Control-Allow-Origin": "*"
								});
								response.write(JSON.stringify(result));
								response.end();
								connection.end();
							}
						});
					}

				} else if (isInsert) {
					console.log("insert ");
					var connection = mysql.createConnection(mySqlConnection);
					connection.connect(function (error) {
						if (error) {
							console.log("-------- Error ---------");
							console.log(error);
							console.log("-------- Error ---------");
						} else {
							console.log('SQLConected');
						}
					});
					//Run query to get all tables definitions 
					//INSERT INTO personaje(nombre, apellido, biografia) VALUES(?, ?, ?)
					var body = '';
					request.on('data', function (data) {
						body += data;
						if (body.length > 1e6) {
							req.connection.destroy();
						}
					});
					request.on('end', function () {
						var values = qs.parse(body);
						var query = connection.query("insert into " + urlParts[2] + " set ?", values, function (error, result) {
							if (error) {
								console.log("-------- Error ---------");
								console.log(error);
								console.log(values);
								console.log(body);
								console.log("-------- Error ---------");
							} else {
								//viewBag.tablas = JSON.stringify(result);
								response.writeHead(200, {
									"Content-Type": "text/json",
									"Access-Control-Allow-Origin": "*"
								});
								response.write(JSON.stringify(result));
								response.end();
							}
						});
						connection.end();
					});
				} else if (isUpdate) {
					console.log("Update ");
					var connection = mysql.createConnection(mySqlConnection);
					connection.connect(function (error) {
						if (error) {
							console.log("-------- Error ---------");
							console.log(error);
							console.log("-------- Error ---------");
						} else {
							console.log('SQLConected');
						}
					});
					//Run query to get all tables definitions 
					//INSERT INTO personaje(nombre, apellido, biografia) VALUES(?, ?, ?)
					var body = '';
					request.on('data', function (data) {
						body += data;
						if (body.length > 1e6) {
							console.log(">>>>>>>>>>>>>>> Sabotage >>>>>>>>>>>>>>");
							console.log("        Memory flood alert");
							console.log("***************************************");
							req.connection.destroy();
						}
					});
					request.on('end', function () {
						var values = qs.parse(body);
						console.log("update " + urlParts[2] + " set ? where id=?", [values, urlParts[3]]);
						var query = connection.query("update " + urlParts[2] + " set ? where id=?", [values, urlParts[3]], function (error, result) {
							if (error) {
								console.log("-------- Error ---------");
								console.log(error);
								console.log("-------- Error ---------");
							} else {
								//viewBag.tablas = JSON.stringify(result);
								response.writeHead(200, {
									"Content-Type": "text/json",
									"Access-Control-Allow-Origin": "*"
								});
								console.log(result);
								response.write(JSON.stringify(result));
								response.end();
							}
						});
						connection.end();
					});

				} else if (isDelete) {
					response.writeHead(200, {
						"Content-Type": "text/json",
						"Access-Control-Allow-Origin": "*"
					});
					response.write(JSON.stringify({
						"result": "ok"
					}));
					response.end();
					console.log("********** DELETE *********");
				} else {
					response.writeHead(200, {
						"Content-Type": "text/json",
						"Access-Control-Allow-Origin": "*"
					});
					response.write(JSON.stringify({
						"error": "bad request"
					}));
					response.end();
				}
			} else {
				response.writeHead(404, {
					"Content-Type": "text",
					"Access-Control-Allow-Origin": "*"
				});
				response.write("404 Not found");
				response.end();
			}
		}
	});
}
exports.connect = connect;