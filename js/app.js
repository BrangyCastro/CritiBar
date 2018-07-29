firebase.initializeApp({
    apiKey: "AIzaSyDYn2X0LI4KV8Lt1AsFTVzQ4jn2B7gcQPY",
    authDomain: "critibar-245cd.firebaseapp.com",
    projectId: "critibar-245cd",
    databaseURL: "https://critibar-245cd.firebaseio.com",
    storageBucket: "critibar-245cd.appspot.com",
    messagingSenderId: "365807035143"
  });

  
  
  // Initialize Cloud Firestore through Firebase
  var db = firebase.firestore();
  
  

  //Guardar

  function guardar(){
    var nombre = document.getElementById('nombre').value;
    var apellido = document.getElementById('apellido').value;
    var email = document.getElementById('email1').value;
    var contrasena = document.getElementById('contrasena1').value;

    db.collection("users").add({
        nombre: nombre,
        apellido: apellido,
        email: email,
        contrasena: contrasena,
        tipo: "Invitado"
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('email1').value = '';
        document.getElementById('contrasena1').value = '';
        alert("Gracias " + nombre + " por formar parte de CritiBar...");
        cerrarSesion();
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

// Ingresar Login

function ingresar(){
    var email = document.getElementById('email').value;
    var contrasena = document.getElementById('contrasena').value;
    var sesion = document.getElementById('sesion');
    var id = document.getElementById('idUser');
    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            if(email == doc.data().email && contrasena == doc.data().contrasena){
                if(doc.data().tipo == "Invitado"){
                    document.getElementById('iniciarSesion').style.display = "none"
                    document.getElementById('registrar').style.display = "none"
                    document.getElementById('cerrarSesion').style.display = "block"                  
                    console.log('bien');
                    alert("Bienvenido " + doc.data().nombre +" "+ doc.data().apellido);
                    var nombreApellido = doc.data().nombre +" "+ doc.data().apellido;
                    var idUsuario = doc.id;
                    sesion.textContent= nombreApellido;
                    sesion.value = nombreApellido;
                    id.value = idUsuario;
                    inicio();
                    console.log('soy invitado')
                }else{
                    inicio();
                    document.getElementById('adm').style.display = "block"
                    document.getElementById('iniciarSesion').style.display = "none"
                    document.getElementById('registrar').style.display = "none"
                    document.getElementById('cerrarSesion').style.display = "block"                  
                    console.log('bien');
                    alert("Bienvenido administrador " + doc.data().nombre +" "+ doc.data().apellido);
                    var nombreApellido = doc.data().nombre +" "+ doc.data().apellido;
                    var idUsuario = doc.id;
                    sesion.textContent= nombreApellido;
                    sesion.value = nombreApellido;
                    id.value = idUsuario;                   
                    console.log('no soy invitado')
                }
            }else{
                console.log('mal');
            }

        });
    });
}

function limpiarEncuesta(){
    document.getElementById('restaurante').value = "Seleccione..";
    document.getElementById('p1').value = "1";
    document.getElementById('p2').value = "1";
    document.getElementById('p3').value = "1";
    document.getElementById('p4').value = "1";
    document.getElementById('p5').value = "1";
    document.getElementById('pComentario').value = "";
}
function verificarOpcion(){

}
// Guardar encuesta
function guardarOpinion(){
    var restaurante = document.getElementById('restaurante').value;
    var p1 = document.getElementById('p1').value;
    var p2 = document.getElementById('p2').value;
    var p3 = document.getElementById('p3').value;
    var p4 = document.getElementById('p4').value;
    var p5 = document.getElementById('p5').value;
    var pComentario = document.getElementById('pComentario').value;
    var user = document.getElementById('sesion').value;

    var promedio = (parseInt(p1) + parseInt(p2) + parseInt(p3) + parseInt(p4) + parseInt(p5)) / 5;

    db.collection("opinion").add({
        restaurante: restaurante,
        p1: p1,
        p2: p2,
        p3: p3,
        p4: p4,
        p5: p5,
        pComentario: pComentario,
        user: user,
        promedio: promedio
        
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        limpiarEncuesta();
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

}


//verificar si hay usuario login

function verificarUsuario(){
    var validar = document.getElementById('idUser').value;
    console.log(validar);
    if(validar == "text"){
        alert("Porfavor Iniciar Sesion o Registrarse")
        login();
    }else{
        guardarOpinion();
    }
}

var tabla = document.getElementById('tabla');
    db.collection("opinion").onSnapshot((querySnapshot) => {
        tabla.innerHTML = "";
        querySnapshot.forEach((doc) => {
            tabla.innerHTML += `
            <tr>
                <td>${doc.data().restaurante}</td>
                <td>${doc.data().promedio}</td>
                <td>${doc.data().pComentario}</td>
                <td>${doc.data().user}</td>
            </tr>`
            
        });
});

function cerrarSesion(){
    window.location = "index.html";
}

function inicio(){
    document.getElementById('contenedorCriterio').style.display = "none"
    document.getElementById('contenedorInicio').style.display = "block"
    document.getElementById('contenedorBar').style.display = "none"
    document.getElementById('contenedorEncuesta').style.display = "none"
    document.getElementById('contenedorLogin').style.display = "none"
    document.getElementById('contenedorRegistro').style.display = "none"
    document.getElementById('adm').style.display = "block"
    document.getElementById('contenedorAdministrador').style.display = "none"


    $("#inicio").addClass("active");
    $("#criterio").removeClass("active");
    $("#bar").removeClass("active");
    $("#encuesta").removeClass("active");
}

function criterio(){
    document.getElementById('contenedorCriterio').style.display = "block"
    document.getElementById('contenedorInicio').style.display = "none"
    document.getElementById('contenedorBar').style.display = "none"
    document.getElementById('contenedorEncuesta').style.display = "none"
    document.getElementById('contenedorLogin').style.display = "none"
    document.getElementById('contenedorRegistro').style.display = "none"
    document.getElementById('contenedorAdministrador').style.display = "none"

    $("#inicio").removeClass("active");
    $("#criterio").addClass("active");
    $("#bar").removeClass("active");
    $("#encuesta").removeClass("active");
}

function bares(){
    document.getElementById('contenedorCriterio').style.display = "none"
    document.getElementById('contenedorInicio').style.display = "none"
    document.getElementById('contenedorBar').style.display = "block"
    document.getElementById('contenedorEncuesta').style.display = "none"
    document.getElementById('contenedorLogin').style.display = "none"
    document.getElementById('contenedorRegistro').style.display = "none"
    document.getElementById('contenedorAdministrador').style.display = "none"

    $("#inicio").removeClass("active");
    $("#criterio").removeClass("active");
    $("#bar").addClass("active");
    $("#encuesta").removeClass("active");
}

function encuesta(){
    document.getElementById('contenedorCriterio').style.display = "none"
    document.getElementById('contenedorInicio').style.display = "none"
    document.getElementById('contenedorBar').style.display = "none"
    document.getElementById('contenedorEncuesta').style.display = "block"
    document.getElementById('contenedorLogin').style.display = "none"
    document.getElementById('contenedorRegistro').style.display = "none"
    document.getElementById('contenedorAdministrador').style.display = "none"

    $("#inicio").removeClass("active");
    $("#criterio").removeClass("active");
    $("#bar").removeClass("active");
    $("#encuesta").addClass("active");
}

function login(){
    document.getElementById('contenedorCriterio').style.display = "none"
    document.getElementById('contenedorInicio').style.display = "none"
    document.getElementById('contenedorBar').style.display = "none"
    document.getElementById('contenedorEncuesta').style.display = "none"
    document.getElementById('contenedorLogin').style.display = "block"
    document.getElementById('contenedorRegistro').style.display = "none"
    document.getElementById('contenedorAdministrador').style.display = "none"
}

function registro(){
    document.getElementById('contenedorCriterio').style.display = "none"
    document.getElementById('contenedorInicio').style.display = "none"
    document.getElementById('contenedorBar').style.display = "none"
    document.getElementById('contenedorEncuesta').style.display = "none"
    document.getElementById('contenedorLogin').style.display = "none"
    document.getElementById('contenedorRegistro').style.display = "block"
    document.getElementById('contenedorAdministrador').style.display = "none"
}

function administrador(){
    document.getElementById('contenedorCriterio').style.display = "none"
    document.getElementById('contenedorInicio').style.display = "none"
    document.getElementById('contenedorBar').style.display = "none"
    document.getElementById('contenedorEncuesta').style.display = "none"
    document.getElementById('contenedorLogin').style.display = "none"
    document.getElementById('contenedorRegistro').style.display = "none"
    document.getElementById('contenedorAdministrador').style.display = "block"
    document.getElementById('aggBar').style.display = "none"
    document.getElementById('editarUsuario').style.display = "none"
    listaUsurio();
    listarBar();
}

function cargar(){
    document.getElementById('cerrarSesion').style.display = "none"
   inicio();
   listarTarjetaBar();
   listarTarjetaBarInicio();
}

function validarSesion(){
    var validar = document.getElementById('idUser').value;
    console.log(validar);
    if(validar == "text"){
        alert("Porfavor Iniciar Sesion o Registrarse")
        login();
    }else{
        encuesta();
    }

}


//********* resfrescar */
function editarUsuario(){
    document.getElementById('editarUsuario').style.display = "block"
} 
function listaUsurio(){
    var tabla = document.getElementById('tablaUsuario');
        db.collection("users").onSnapshot((querySnapshot) => {
            tabla.innerHTML = "";
            querySnapshot.forEach((doc) => {

                tabla.innerHTML += `
                <tr>
                    <td>${doc.data().nombre}</td>
                    <td>${doc.data().apellido}</td>
                    <td>${doc.data().email}</td>
                    <td>${doc.data().tipo}</td>
                    <td>
                    <button type="button" class="badge badge-primary" onClick="editarUsuario()">Editar</button>
                    <button type="button" class="badge badge-danger" onClick="()">Eliminar</button>
                    </td>
                </tr>`
                
            });
    });
}

function guardarAdmi(){
    var nombre = document.getElementById('nombreAdmi').value;
    var apellido = document.getElementById('apellidoAdmi').value;
    var email = document.getElementById('email1Admi').value;
    var contrasena = document.getElementById('contrasena1Admi').value;
    var tipo = document.getElementById('tipoUsuario').value;

    db.collection("users").add({
        nombre: nombre,
        apellido: apellido,
        email: email,
        contrasena: contrasena,
        tipo: tipo
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById('nombreAdmi').value = '';
        document.getElementById('apellidoAdmi').value = '';
        document.getElementById('email1Admi').value = '';
        document.getElementById('contrasena1Admi').value = '';
        document.getElementById('tipoUsuario').value = 'Selecione Tipo Usuario..';
        alert("Gracias " + nombre + " por formar parte de CritiBar...");
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

// AGREGAR BAR 

function aggBar(){
    document.getElementById('aggBar').style.display = "block"
}

function guardarBar(){
    document.getElementById('aggBar').style.display = "none"
}

function listarBar(){
    var tabla = document.getElementById('tablaBar');
    db.collection("bar").onSnapshot((querySnapshot) => {
        tabla.innerHTML = "";
        querySnapshot.forEach((doc) => {

            tabla.innerHTML += `
            <tr>
                <td>${doc.data().nombreFoto}</td>
                <td>${doc.data().nombreBar}</td>
                <td>${doc.data().descripcion}</td>
                <td>
                <button type="button" class="badge badge-primary" onclick="()">Editar</button>
                <button type="button" class="badge badge-danger" onclick="()">Eliminar</button>
                </td>
            </tr>`
            
        });
    });
}

function listarTarjetaBar(){
    var tabla = document.getElementById('tablaTarjetaBar');
    db.collection("bar").onSnapshot((querySnapshot) => {
        tabla.innerHTML = "";
        querySnapshot.forEach((doc) => {
            tabla.innerHTML += `
            <div class="card" height="300">
                <img class="card-img-top" src="${doc.data().url}" alt="Card image cap" height="400">
                <div class="card-body">
                    <h5 class="card-title">${doc.data().nombreBar}</h5>
                    <p class="card-text">${doc.data().descripcion}</p>
                </div>
            </div>`
            
        });
    });
}

function subirImagen(){
    var nombreBar = document.getElementById('nombreBar').value;
    var descripcion = document.getElementById('descripcionBar').value;
    var fileButton = document.getElementById('fichero');

    //Obtener archivo
    var file = fileButton.files[0];

    // Crear un storage ref
    var storageRef = firebase.storage().ref('imagenes/' + file.name);
    // Subir archivo
    var task = storageRef.put(file);
    // Actualizar barra progreso
    task.on('state_changed',

    function progress(snapshot) {

    },function error(err) {
        alert("erroro al subir la imagen");
    },function complete() {
        var url = task.snapshot.downloadURL;
        guardarBar2(file.name, url, nombreBar, descripcion);
        alert("Datos guardados");
    });

}

function guardarBar2(nombreFoto, url, nombreBar, descripcion){
    db.collection("bar").add({
        nombreFoto: nombreFoto,
        url: url,
        nombreBar: nombreBar,
        descripcion: descripcion
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById('fichero').value = '';
        document.getElementById('nombreBar').value = '';
        document.getElementById('descripcionBar').value = '';
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    document.getElementById('aggBar').style.display = "none"
}

function listarTarjetaBarInicio(){
    var tabla = document.getElementById('tarjetasInicio');
    db.collection("bar").orderBy("nombreBar").limit(3).onSnapshot((querySnapshot) => { 
        tabla.innerHTML = "";    
            querySnapshot.forEach((doc) => {       
                tabla.innerHTML += `
                <div class="col-4">
                    <div class="card" style="width: 18rem;">
                        <img class="card-img-top" src="${doc.data().url}" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">${doc.data().nombreBar}</h5>
                            <a class="btn btn-primary" onClick="validarSesion()">Encuesta</a>
                        </div>
                    </div>
                </div>`        
            }); 
    });
}

