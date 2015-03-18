/*
 * 
 * Aplicacion
 */
lib = {
  "Os": {
    "TraceTarget": "#OsShowComp",
    "MaskSesion": "",
    "dataUser": "",
    "AutoCompleteTarget": "",
    "Host": "http://localhost:8010/4pfw/api/",
    "AutoCompleteStart": function() {
      //$().
    },
    "PostLogin": function() {
    },
    "Start": function() {
      //TraceTarget="#header";
      /*	
       $.ajax({
       url: "http://localhost/4pfw/srv/getSesion/?"+Math.random()+"?roman:-azs543",
       dataType: "text",
       
       }).done(function (data) {
       //app = eval("(" + data + ")");
       //lib.Os.Start();
       //var val = lib.Os.rndStr(10, "a".charCodeAt(0), "z".charCodeAt(0));
       //document.getElementById("header").innerHTML(val);
       //
       var val ="Roman";
       //$("#header").html(val);
       $("#header").html(lib.Os.Encript(val, "E1 Ch4pul1n C0lo4ado") + " , "
       + val +lib.Os.Decript(lib.Os.Encript(val, "E1 Ch4pul1n C0lo4ado"), "E1 Ch4pul1n C0lo4ado"));
       
       //	if (console && console.log) {
       //		console.log("Sample of data:", data.slice(0, 100));
       //	}
       }).fail(function () {
       alert("App Abotrada");
       });*/
    },
    "trace": function(o) {
      console.log(o.toString());
      try {
        var t = $(this.TraceTarget).html();
        $(this.TraceTarget).html(t + "<div>" + o.toString() + "<div>");
      }
      catch (e) {
      }
    },
    "rndStr": function(n, ri, rf) {
      if (ri == null)
        ri = " ".charCodeAt(0);
      if (rf == null)
        rf = "~".charCodeAt(0);
      var r = "";
      var rd = rf - ri;
      for (var i = 0; i < n; i++) {
        var j = Math.ceil(Math.random() * rd);
        r += String.fromCharCode(ri + j);
      }
      return escape(r);
    },
    "factoriza": function(n) {
      this.trace("n:" + n);
      var r = new Array();
      var i = 3;
      r.push(1);
      var h = Math.round(Math.sqrt(n)) + 3;
      var j = 0;
      var skip = 0;
      for (; i <= h; i += 2) {
        this.trace("L:" + i);
        if (n % i == 0) {
          r.push(i);
          this.trace("f:" + i);
          skip = i * r[r.length - 2];
          this.trace("fn:" + skip);
        }
        j++;
      }
      this.trace(h + " -- " + j);
      return r;
      //r: 1,3,17,37,51,111,629,773,1887,2319,13141,28601,39423,85803,486217
    },
    "Mascarilla": function(n) {
      if (!n) {
        n = Math.floor(34 + Math.random() * 30);
      }
      var rango_inicio = "A".charCodeAt(0);
      var rango_final = "z".charCodeAt(0);
      var r = "";

      for (var i = 0; i < n; i++) {
        var Ran = rango_inicio + Math.floor(Math.random() * (rango_final - rango_inicio));
        r += String.fromCharCode(Ran);
      }
      return r;
    },
    "Decript": function(msj, clave) {
      var cursor2 = 0;
      var r = "";
      var r2 = "";
      var claveLen = clave.length;
      var pattern = /[A-Z]/g;
      var pattern2 = /\s\s+/g;
      r2 = msj.replace(pattern, " ");
      r2 = r2.replace(pattern2, " ");
      //trace(r2);
      var Vals = r2.split(" ");
      for (var i = 0; i < Vals.length - 1; i++) {
        var vc = clave.charCodeAt(cursor2);
        var v = parseInt(Vals[i], 32);
        v = ((v - vc) / 104729) - vc;
        r += String.fromCharCode(v);
        cursor2 = (cursor2 + 1) % claveLen;
      }
      //trace(r);
      return r;
    },
    "Encript": function(msj, clave) {
      var cursor = 0;
      var cursor2 = 0;
      var r = "";
      var msjLen = String(msj).length;
      var claveLen = String(clave).length;
      while (cursor < msjLen) {
        var vm = msj.charCodeAt(cursor);
        var vc = clave.charCodeAt(cursor2);
        var vr = ((vm + vc) * 104729) + vc;
        var Ran = "A".charCodeAt(0) + Math.floor(Math.random() * 20);
        var Ran2 = "A".charCodeAt(0) + Math.floor(Math.random() * 20);
        r += vr.toString(32) + String.fromCharCode(Ran) + String.fromCharCode(Ran2);
        cursor++;
        cursor2 = cursor % claveLen;
        //trace((vm * vc*809 )+vc,vm , vc,int.MAX_VALUE);
      }
      //trace("resultado :",r.length, r);
      return encodeURI(r);
    },
    "Modulo": function(modulo, target) {
      $.ajax({url: "libs/" + modulo + ".html", dataType: "text"}).done(function(data) {
        $(target).html(data);
      });

    }

  }
};
$.fn.positionOn = function(element, align) {
  return this.each(function() {
    var target   = $(this);
    var position = element.position();

    var x      = position.left; 
    var y      = position.top;

    if(align == 'right') {
      x -= (target.outerWidth() - element.outerWidth());
    } else if(align == 'center') {
      x -= target.outerWidth() / 2 - element.outerWidth() / 2;
    }

    target.css({
      position: 'absolute',
      zIndex:   5000,
      top:      y, 
      left:     x
    });
  });
};

/******************************************************************************
 Componentes
 *******************************************************************************/
DataGrid = {
  dataObj: {},
  selectedIndex: -1,
  selectedRow: null,
  Create: function(datos, target) {
    this.dataObj = datos;
    var ele = document.createElement("div");
    cn = 0;
    var oldval;
    //Agrega Headers
    for (var c in this.dataObj.headers) {
      oldval = $(target + " .dGHeader").html();
      var col = document.createElement("div");
      $(col).attr("row", r);
      $(col).attr("col", cn);
      $(col).attr("campo", c);
      $(col).addClass("columns small-" + this.dataObj.colW[c]);
      var t = document.createTextNode(this.dataObj.headers[c]);
      col.appendChild(t);
      $(target + " .dGHeader").html(oldval + col.outerHTML);
    }
    oldval = $(target + " .dGHeader").html();
    var col = document.createElement("div");
    $(target + " .dGHeader").html(oldval + col.outerHTML);
    //Llena los datos
    for (var r = 0; r < this.dataObj.data.length; r++)
    {
      var oldval = $(target + " .dGCuerpo").html();
      ele = document.createElement("div");
      $(ele).addClass("row");
      if (r % 2 == 0) {
        $(ele).addClass("alt");
      }
      $(ele).attr("row", r);
      cn = 0;
      for (var c in this.dataObj.data[r]) {
        var col = document.createElement("div");
        $(col).attr("row", r);
        $(col).attr("col", cn);
        $(col).attr("campo", c);
        $(col).addClass("columns small-" + this.dataObj.colW[cn]);
        var t = document.createTextNode(this.dataObj.data[r][c]);
        col.appendChild(t);
        ele.appendChild(col);
        cn++;
        lib.Os.trace(t);
      }
      var col = document.createElement("div");
      ele.appendChild(col);
      $(target + " .dGCuerpo").html(oldval + ele.outerHTML);
    }
    $(".dataGrid .row").bind("click", {Target: this}, function(e) {
      e.data.Target.RowClick(e);
    });
    $(target + " .dGCuerpo").mCustomScrollbar({
      scrollButtons: {
        enable: true
      }, theme: "3d-thick",
      scrollInertia: 550

    });
  },
  RowClick: function(e) {
    this.selectedIndex = Number($(e.currentTarget).attr("row"));
    this.selectedRow = this.dataObj.data[this.selectedIndex];
    $(".dataGrid .row").removeClass("selected");
    $(e.currentTarget).addClass("selected");

  }
};
//******************************************************************************
// Single list From Jason
//******************************************************************************
SingleList = {
  dataObj: {},
  selectedIndex: -1,
  selectedRow: null,
  Create: function(Target) {
    $(Target).html("<h1>" + $(Target).attr('title') + "</h1><div class='busqueda'><input type='search' class='textSearch' /><div class='findBt'><i class='icon-search'></i></div><div class='addBt'><i class='icon-plus'></i></div></div><div class='list'></div>");
    $.ajax({
      url: lib.Os.Host + $(Target).attr('serviceList') + "/" + lib.Os.dataUser.email + "/?"+Math.random()+"?roman:-azs543",
      complete: function(data) {
        datos = lib.Os.Decript(data.responseText, lib.Os.MaskSesion);
        Data = eval("(" + datos + ")");
        r = "";
        for (var i = 0; i < Data.length; i++) {
          r += "<div index='" + Data[i].id + "' >" + Data[i].data + "</div>";
        }
        $(Target + '.singleList .list').html(r);
        console.log(Data);
        $(Target + '.singleList .list div').each(function(e) {
          $(this).html($(this).html() + "<div class='toolbar'><i class='icon-edit'></i><i class='icon-minus'></i></div>");

        });
        $(Target + '.singleList .list div').click(function(e) {
          $(Target + '.singleList .list div.selected').removeClass("selected");
          $(this).addClass("selected");
        });
        $(Target + '.singleList .list div').droppable({
          activeClass: "",
          hoverClass: "dragOver",
          drop: function(event, ui) {
          }
        });
        $(Target + '.singleList .list div').draggable({helper:"clone",revert: true, revertDuration: 200});
      }
    });
  }
};
/*
 * Global Fuctions
 */
function UpdateUserData() {
  $(".UserName").html(lib.Os.dataUser.nombres);
  $(".UserEmail").html(lib.Os.dataUser.email);
  $(".UserApellido").html(lib.Os.dataUser.apellidos);
  $(".UserCedula").html(lib.Os.dataUser.cedula);
  $(".UserNss").html(lib.Os.dataUser.nss);
  $(".UserFechaNacimiento").html(lib.Os.dataUser.fechaNacimiento);
  $(".UserNacionalidad").html(lib.Os.dataUser.nacionalidad);
  $(".UserTelefono").html(lib.Os.dataUser.telefono);
  $(".UserSexo").html(lib.Os.dataUser.sexo);
  //$(".").html(lib.Os.dataUser.cedula);    
  $(".UserMensajes").html("5");
  $(".UserAlertas").html("5");
  $(".FotoUser").attr("src", "img/12312011092.jpg");
}