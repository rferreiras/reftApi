/* global Diccionario, pEtts, database */
var server = require("./server");
var router = require("./router");
var controller = require("./controllers");

var handle = {};
/*******************************************************************************
 * Lista de Controladores (custons End Pionts)
 ******************************************************************************/
handle["/"] = controller.home;
handle["/home"] = controller.inicio;
server.Start(router.route, handle);
//console.log(Alg.rndTxt(78));
