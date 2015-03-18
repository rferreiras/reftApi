var server = require("./server");
var router = require("./router");
var controller = require("./controllers");

var handle = {};
handle["/"] = controller.home;
handle["/home"] = controller.home;
handle["/test_api"] = controller.testApi;
handle["/reset_model"] = controller.mySqlAbstr;
handle["/mongo"] = controller.mongoAbstr;

server.Start(router.route, handle);