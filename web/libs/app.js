/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
    $scope.dataUser = lib.Os.dataUser;

    $scope.gohome = function() {
      console.log("gohome");
      window.location.href = "#/home";
      //$route.current.templateUrl='libs/home.html';
    };
    $scope.clickLogo = function() {
      $("#nav,.tvPanel").toggleClass("oculto");
    };

    $scope.logOutClick = function() {
      $scope.logeado = false;
    };
    $scope.loginClick = function() {
      //alert($(".loginBox .UsuarioTxt").val());
      //Genera Mascarilla
      lib.Os.MaskSesion = lib.Os.Mascarilla();
      var msk = lib.Os.Encript(lib.Os.MaskSesion + ":" + $scope.password + ":" + lib.Os.Mascarilla(), $scope.password);
      //alert(msk);
      $http({method: 'GET', url: lib.Os.Host + "login/" + $scope.email + "/" + msk + "?" + Math.random() + "?roman:-azs543"}).success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        //alert(data);
        var resultado = data;
        if (resultado.Login != null) {
          //Login Correcto
          lib.Os.dataUser = eval("(" + lib.Os.Decript(resultado.User, lib.Os.MaskSesion) + ")");
          $scope.dataUser = lib.Os.dataUser;
          $scope.logeado = true;
          lib.Os.MaskSesion = lib.Os.Decript(resultado.Login, lib.Os.MaskSesion);
          $(".loginBox .InputPanel").fadeOut({
            "complete": function(e) {
              $(".loginBox").addClass("loged");
              $(".loginBox .OutputPanel").fadeIn({"complete": function(ee) {
                  //$("#OsShowCont").html($(".HomePage").html());
                  //UpdateUserData();
                  $scope.gohome();
                  $scope.clickLogo();
                }
              });
            }
          });
          //$(".loginBox .UserEmail").html(lib.Os.dataUser.email);
          //Carga pagina de inicio
          //} else if (resultado.error != null) {
        } else {
          //usuario no encontrado o clave erronea
          console.log(resultado);
        }
      }).
              error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("App Abotrada");
              });
    };
  }]);
app.controller("header", ['$scope', '$http', function($scope, $http) {
    $scope.scpName = "header";
    $scope.dataUser = lib.Os.dataUser;
  }]);
app.controller("login", ['$scope', '$http', function($scope, $http) {
    $scope.scpName = "login";

  }]);
app.controller("home", ['$scope', '$http', function($scope, $http) {
    $scope.scpName = "home";

  }]);
app.controller("nav", function($scope) {
  $scope.scpName = "nav";
  $scope.showSubMenu=function (id){
    $("#"+id+"-sm").toggle("fast");
  };
  $scope.navMenu = [
    {name: "Home", icon: "icon-home", url: "home"},
    {name: "Opciones", icon: "icon-cog-alt", url: "opciones", subMenu: [
        {name: "Medicamentos", icon: "icon-cog-alt", url: "opciones/medicamentos"},
        {name: "Laboratorios", icon: "icon-cog-alt", url: "opciones/laboratorios"},
        {name: "ARS", icon: "icon-cog-alt", url: "opciones/ars"}
      ]},
    {name: "Pacientes", icon: "icon-wheelchair", url: "pacientes", subMenu: []

    }

  ];
});
app.controller("reguser", function($scope, $http) {
  $scope.regClick = function() {

  };
});
