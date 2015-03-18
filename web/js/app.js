console.log("Web App Estared");
app = angular.module("app", ['ngRoute']);
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
            when('/home', {
              templateUrl: '/libs/home.html',
              controller: 'home'
            }).
            when('/opciones/ars', {
              templateUrl: '/libs/ars.html',
              controller: 'home'
            }).
            otherwise({
              redirectTo: '/'
            });
  }]);
app.controller("main", ['$scope', '$http', function($scope, $http) {
    $scope.email = "rferreiras@4p.com.do";
    $scope.password = "qawse21azsxdwq";
//    $scope.email = "";
//    $scope.password = "";
    $scope.logeado = false;


    $scope.goHome = function() {
      console.log("gohome");
      $scope.goExp();
      //window.location.href = "#/home";
      //$route.current.templateUrl='libs/home.html';
    };
    $scope.goExp = function() {
      $("#ContetPanel,#SearchPanel").addClass("expanded");
      //$("#SearchPanel").hide("fast");
    };
    $scope.goUnExp = function() {
      $("#ContetPanel,#SearchPanel").removeClass("expanded");
      //$("#SearchPanel").show("fast");
    };
    $scope.expUnExp = function() {
      $("#ContetPanel,#SearchPanel").toggleClass("expanded");
      //$("#SearchPanel").toggle("fast");
    };
  }]);
app.controller("header", ['$scope', '$http', function($scope, $http) {
    $scope.scpName = "header";

  }]);
app.controller("login", ['$scope', '$http', function($scope, $http) {
    $scope.scpName = "login";

  }]);
app.controller("home", ['$scope', '$http', function($scope, $http) {
    $scope.scpName = "home";

  }]);

