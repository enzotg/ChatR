"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

CargarEmoji();

connection.start().then(function () {
    document.getElementById("txtEstado").value = "Conectado";
    }).catch(function (err) {
    return console.error(err.toString());
});

connection.on("RecibirMensaje", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    var d = new Date();
    var hora = ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2);
    
    var li = document.createElement("li");
    li.style.padding = "2px";
    li.style.margin = "2px";
    var spA = document.createElement("span");
    var spB = document.createElement("span");
    var spC = document.createElement("span");

    if (document.getElementById("txtUser").value == user) {
        li.className = "alert alert-secondary";
        user = "Tú";
    }
    else
        li.className = "alert alert-info";

    spA.className = "badge badge-primary"; 
    spB.className = "badge badge-success";
    spB.style.marginLeft = "2px";
    spB.style.marginRight = "2px";

    spA.textContent = user;
    spB.textContent = hora;
    spC.textContent = msg;

    li.appendChild(spA);
    li.appendChild(spB);
    li.appendChild(spC);

    if (document.getElementById("listaMensajes").firstChild === 'undefined')
        document.getElementById("listaMensajes").appendChild(li);
    else
        document.getElementById("listaMensajes").insertBefore(li, document.getElementById("listaMensajes").firstChild);
    
});

document.getElementById("btnEnviar").addEventListener("click", EnviarMensaje);
document.getElementById("mostrarEmoji").addEventListener("click", mostrarDivEmoji);
document.getElementById("listaMensajes").addEventListener("click", clickLista);

document.getElementById("txtMensaje").addEventListener("keyup", function (event) {
    
    if (event.keyCode === 13) {        
        event.preventDefault();        
        document.getElementById("btnEnviar").click();
    }
});

function clickLista(e) {
    //console.log(e.target.innerHTML);
    var mensaje = document.getElementById("txtMensaje");
    var mens = e.target.cloneNode(true);

    var div = document.createElement("div");
    div.style.backgroundColor = "silver ";
    div.contentEditable = false;

    e.target.childNodes.forEach(function (value, index, arr) {
        var elem = value.cloneNode(true);
        div.appendChild(elem);        
    });
    var p = document.createElement("p");
    //p.innerText = "adsddsdsd";
    p.innerHTML = "<br/>";
    //div.appendChild(p);    
    
    /*arr.forEach(function (value, index, arr) {
        var p = document.createElement("p");
        p.innerHTML = '&#' + (value) + ';';        divEm.appendChild(p);*/

    mensaje.appendChild(div);
    mensaje.appendChild(p);
    //mensaje.childNodes[1].tabindex = "0";
    div.focus();
    //mensaje.focus();

}

function EnviarMensaje(e) {    
    var user = document.getElementById("txtUser").value;
    var mensaje = document.getElementById("txtMensaje");

    var messageText = mensaje.innerText;

    connection.invoke("EnviarMensaje", user, messageText).catch(function (err) {
        return console.error(err.toString());
    });
    mensaje.innerText = "";
}

function divEmojiEvent() {

    var p = document.querySelectorAll("#divEmoji p");
    var mensaje = document.getElementById("txtMensaje");

    for (var i = 0; i < p.length; i++)
        p[i].addEventListener("click", (e) => {
            mensaje.innerText += e.target.innerText;
            mensaje.focus();
        });
}
function mostrarDivEmoji() {

    var div = document.getElementById("cuadroemoji");
    if (div.classList == "cuadroemoji")
        div.classList = "cuadroemojioc";
    else
        div.classList = "cuadroemoji";
}

function CargarEmoji() {

    var btn = document.getElementById("btnPrev");
    btn.addEventListener("click", () => cargarPag(-1));
    document.getElementById("btnNext").addEventListener("click", () => cargarPag(1));

    var actualPag = 0;
    function cargarPag(n) {

        actualPag += n;

        if (actualPag > 3) actualPag = 0;
        if (actualPag < 0) actualPag = 3;

        var arr;
        if (actualPag == 0) arr = emojiCodA;
        if (actualPag == 1) arr = emojiCodB;
        if (actualPag == 2) arr = emojiCodC;
        if (actualPag == 3) arr = emojiCodD;

        var divEm = document.getElementById("divEmoji");
        while (divEm.firstChild)
            divEm.removeChild(divEm.firstChild);

        arr.forEach(function (value, index, arr) {
            var p = document.createElement("p");
            p.innerHTML = '&#' + (value) + ';';
            divEm.appendChild(p);
        });

        divEmojiEvent();

    }

    cargarPag(0);

}