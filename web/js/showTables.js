/* global Vue, mO, mls2min, apiUrl, setupUrl, tablas, tablasSetup */
//$(document).foundation();
Vue.config.devtools=true;
function Router()
{
    $("#userMenu").hide();
    for(var i in Controladores)
    {
        Controladores[i].isActive=false;
    }
    if(Controladores[location.hash.replace("#","")])
    {
        Controladores[location.hash.replace("#","")].funct();
    }
    else if(Controladores[location.hash.replace("#","").split("/")[0]])
    {
        if(!location.hash.replace("#","").split("/")[2])
        {
            Controladores[location.hash.replace("#","").split("/")[0]].funct(location.hash.replace("#","").split("/")[1]);
        }
        else
        {
            Controladores[location.hash.replace("#","").split("/")[0]].funct(location.hash.replace("#","").split("/")[1],location.hash.replace("#","").split("/")[2]);
        }
    }
    else
    {
        if(location.hash == "")
        {
            Controladores["home"].funct();
        }
        else
        {
            Controladores["home"].funct("404");
        }
    }
    document.scrollingElement.scrollTop=0;
    //actRipple();
}
function cambiaClave()
{
    console.log("PasswordReset" + Date.now);
}
window.setInterval(cambiaClave,1.5 * mls2min);
window.onhashchange=Router;
Controladores={
    "home":{
        "name":"home",
        "isActive":false,
        "label":"Inicio",
        "visible":true,
        "viewBag":{mgs:""},
        "funct":function(pa)
        {
            this.isActive=true;
//			actRipple();
            if(pa == "404")
            {
                this.viewBag.mgs="Pagina no encontrada";
            }
            console.log("home " + pa);
        }
    },
    "login":{
        "name":"login",
        "isActive":false,
        "label":"Login",
        "visible":false,
        "funct":function()
        {
            this.isActive=true;
            console.log("Login");
            //Pide token para logearse
            $.ajax('/login?silent').success(function(resp)
            {
                //$('#LoginWindow').html(resp).foundation('open');
                console.log("Login Ready.");
            });
        }
    },
    "logout":{
        "name":"logout",
        "isActive":false,
        "label":"Salir",
        "visible":false,
        "funct":function()
        {
            this.isActive=true;
            estaLogeado=false;
            app.estaLogeado=false;
            sessionStorage.datosUsuario="";
            console.log("home " + location.href);

        }
    },
};
var app=new Vue({
    el:"#app",
    data:{
        estaLogeado:false,
        UserEmail:"roman.ferreiras@gmail.com",
        UserPass:"123",
        lData:null,
        controladores:Controladores,
        "tablas":tablas,
        "tablasSetup":tablasSetup
    },
    methods:{
        doLogin:function()
        {
            var email=this.UserEmail;
            var password=this.UserPass;
            mO.lKey=rndTxt(200);
            $.ajax({
                url:"/login",
                method:"POST",
                xhrFields:{
                    withCredentials:true
                },
                data:{email:email,msg:Encript(mO.lKey,password)},
                success:function(data,status)
                {
                    var result=JSON.parse(data);
                    msg=Decript(result.sesionData,mO.lKey);
                    mO.lKey="";
                    //console.log("MSG::", msg);
                    var Merr=false;
                    try
                    {
                        msg=JSON.parse(msg);
                    }
                    catch(e)
                    {
                        console.log("Password Invalido",msg,e);
                        Merr=true;
                    }
                    if(!Merr && msg.sesToken)
                    {
                        //todo
                        //que pida secion y que mande pal dashboard
                        sessionStorage.datosUsuario=JSON.stringify({
                            email:email,
                            Nombre:msg.Nombre,
                            idSesion:msg.idSesion,
                            Apellido:msg.Apellido,
                            Username:msg.UserName,
                            uid:msg.token
                        });

                        //$('#LoginWindow').foundation('close');
                        iniciaSesion(msg.sesToken,msg.token);
                    }
                    else
                    {
                        //document.location.reload();
                    }
                }
            });
        },
        login:function()
        {
            document.location.href="#login";
        }
    },
    created:function()
    {
        this.estaLogeado=estaLogeado;
        console.log(1,estaLogeado,sessionStorage.datosUsuario);
        if(!estaLogeado)
        {
            console.log(2);
            //document.location.href="#login";
        }
        else
        {
            var d=new Date();
            //$("#UserBt>a").html(lData.Username + "<br/>" + dateLib.getFecha(d) + " " + dateLib.getHora(d));
            console.log(3);

        }
//		actRipple();
    },
    /*
     * AFTER-RENDER
     */

});
$("#userMenu").hide();
//Llama a los Controladores
Router();