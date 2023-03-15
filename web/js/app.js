console.log("REFT Api v 0.0000");
Controladores = {
	home: {
		name: "home",
		isActive: false,
		label: "Inicio",
		icono: "fa fa-user-md",
		visible: true,
		consultorioId: 0,
		funct: function (id) {
			this.isActive = true;
			console.log("Controlador home " + id);
			primeravez = false;
		},
	},
	Dolores: {
		name: "Dolores",
		isActive: false,
		funct: function (id) {
			this.isActive = true;
			console.log("Controlador Dolores " + id);
			primeravez = false;
		},
	},

};

function Router() {
	for (var i in Controladores) {
		Controladores[i].isActive = false;
	}
	var name = location.hash.replace("#", "");
	var paramtr = name.split("/");
	if (Controladores[name]) {
		App.contrAct = Controladores[name];
		Controladores[name].funct();
	} else if (Controladores[paramtr[0]]) {
		App.contrAct = Controladores[paramtr[0]];
		if (paramtr[2]) {
			// app.contrAct=Controladores[paramtr[0]];
			if (paramtr[3]) {
				Controladores[paramtr[0]].funct(paramtr[1], paramtr[2], paramtr[3]);
			} else {
				Controladores[paramtr[0]].funct(paramtr[1], paramtr[2]);
			}
		} else {
			Controladores[paramtr[0]].funct(paramtr[1]);
		}
	} else {
		App.contrAct = Controladores.home;
		Controladores["home"].funct("404");
	}
	document.scrollingElement.scrollTop = 0;
}
//
var App = new Vue({
	el: "#app",
	data: {
		Title:"Este es un titulo de prueva",
		contrAct: {
			name: "",
		},
		controladores: Controladores,
	},
	methods: {

	},
	created: function () {
		console.log("Instancia de Vue Creada", this)
	},
	watch: {

	},
});
//

window.onhashchange = Router;
Router();
