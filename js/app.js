// CONEXION CON LA BASE DE DATO FIREBASE
firebase.initializeApp({
    apiKey: "AIzaSyDYn2X0LI4KV8Lt1AsFTVzQ4jn2B7gcQPY",
    authDomain: "critibar-245cd.firebaseapp.com",
    projectId: "critibar-245cd",
    databaseURL: "https://critibar-245cd.firebaseio.com",
    storageBucket: "critibar-245cd.appspot.com",
    messagingSenderId: "365807035143"
});
  var db = firebase.firestore();  
//--------------------------------------------------------------------------

/********* Vista Inicio ********/
// Funcion caragar el ranking de los bares

function tablaBarRankin(){
    var tabla = document.getElementById('tablaRanking');
    db.collection("opinion").orderBy("promedio", "desc").limit(5).onSnapshot((querySnapshot) => { 
        tabla.innerHTML = "";    
            querySnapshot.forEach((doc) => {       
                tabla.innerHTML += `
                <tr>
                    <td>${doc.data().restaurante}</td>
                    <td>${doc.data().promedio}</td>
                </tr>
                `        
            }); 
    });
}
/* Funcion para mostrar la tarjeta en la 
    vita de inicio */

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
                                <a class="btn btn-primary" id="validarSesion" onclick = "validarSesionTarjetasInicio()">Encuesta</a>
                            </div>
                        </div>
                    </div>`        
                }); 
        });
    }

/* Funcion para saber si un usuario esta login,
    boton de la tarjetas de la vista de inicio */
function validarSesionTarjetasInicio(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            encuesta();
        } else {
            $("#modalLogin").modal();
        }
      });
}

/******** Vista Bar */
// Funcion para mostrar los Bares en tarjetas 
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

/* ****** Vista Encuesta ***********/


function guardarUserInvitado(nombre,apellido,idAutenticacion){
    
    db.collection("usuario").add({
        nombre: nombre,
        apellido: apellido,
        tipo: "Invitado",
        idAutenticacion: idAutenticacion
    })
    .then(function(docRef) {   
        console.log("Document written with ID: ", docRef.id);
        alert("Gracias " + nombre + " por formar parte de CritiBar...");
        location.reload(true);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

function autentificar(){
    $("#contrasena1").val();
    var nombre = $("#nombre").val();
    var apellido =  $("#apellido").val();
    var email = $("#email1").val();
    var contrasena = $("#contrasena1").val();
    
    firebase.auth().createUserWithEmailAndPassword(email, contrasena)
    .then(function(docRef) {
        var id = docRef.uid;
        guardarUserInvitado(nombre,apellido,id);
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('email1').value = '';
        document.getElementById('contrasena1').value = '';
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ...
      });
}

// Ingresar Login

function loginUsuario(){
    var email = document.getElementById('email').value;
    var contrasena = document.getElementById('contrasena').value;

    firebase.auth().signInWithEmailAndPassword(email, contrasena)
    .then(function(uid) {
        db.collection("usuario").onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(uid.uid == doc.data().idAutenticacion){
                    if(doc.data().tipo == 'Invitado'){
                        alert("Inicio de Sesion con exito" + "\nBienvenido " + doc.data().nombre +" "+ doc.data().apellido); 
                        location.reload(true);                
                    }else{
                        document.getElementById('adm').style.display = "block"
                        alert("Inicio de Sesion con exito" + "\nBienvenido administrador " + doc.data().nombre +" "+ doc.data().apellido); 
                        location.reload(true); 
                    }
                }else{
                    console.log("mal");
                }
                    
            });
        }); 
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode + " " + errorMessage);
        document.getElementById('email').value = "";
        document.getElementById('contrasena').value = "";
      });
}

function observador(){
    var sesion = document.getElementById('sesion');

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("si hay usurio activo");
          var uid = user.uid;
          var idAutenticacion;

          db.collection("usuario").onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                idAutenticacion = doc.data().idAutenticacion;
                if(uid == idAutenticacion ){
                    if(doc.data().tipo == 'Invitado'){
                        document.getElementById('iniciarSesion').style.display = "none"
                        document.getElementById('registrar').style.display = "none"
                        var nombreApellido = doc.data().nombre +" "+ doc.data().apellido;
                        sesion.innerHTML = `
                        <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                            <div class="btn-group" role="group">
                                <button id="btnGroupDrop1" type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    ${nombreApellido}
                                </button>
                                <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                    <a class="dropdown-item" data-toggle="modal" data-target="#modalPerfil" onclick="mostrarPerfil()">Perfil</a>
                                    <a class="dropdown-item" data-toggle="modal" data-target="#modalEliminarUser">Eliminar Cuenta</a>
                                    <a class="dropdown-item" onclick="cerrarSesion()">Cerrar Sesion</a>   
                                </div>
                            </div>
                        </div> `
                        sesion.value = nombreApellido;
                    }else{
                        document.getElementById('adm').style.display = "block"
                        document.getElementById('iniciarSesion').style.display = "none"
                        document.getElementById('registrar').style.display = "none"
                        var nombreApellido = doc.data().nombre +" "+ doc.data().apellido;
                        sesion.innerHTML = `
                        <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                            <div class="btn-group" role="group">
                                <button id="btnGroupDrop1" type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    ${nombreApellido}
                                </button>
                                <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                    <a class="dropdown-item" data-toggle="modal" data-target="#modalPerfil" onclick="mostrarPerfil()">Perfil</a>
                                    <a class="dropdown-item" data-toggle="modal" data-target="#modalEliminarUser">Eliminar Cuenta</a>
                                    <a class="dropdown-item" onclick="cerrarSesion()">Cerrar Sesion</a>
                                </div>
                            </div>
                        </div> `
                        sesion.value = nombreApellido;
                    }
                    
                }
            });
        });         
          // ...
        } else {
          // User is signed out.
          console.log("no hay usurio activo");
          // ...
        }
      });
}

function limpiarEncuesta(){
    document.getElementById('barOpcion').value = "Seleccione..";
    document.getElementById('p1').value = "1";
    document.getElementById('p2').value = "1";
    document.getElementById('p3').value = "1";
    document.getElementById('p4').value = "1";
    document.getElementById('p5').value = "1";
    document.getElementById('pComentario').value = "";
}

// Guardar encuesta
function guardarOpinion(){
    var restaurante = document.getElementById('barOpcion').value;
    var p1 = document.getElementById('p1').value;
    var p2 = document.getElementById('p2').value;
    var p3 = document.getElementById('p3').value;
    var p4 = document.getElementById('p4').value;
    var p5 = document.getElementById('p5').value;
    var pComentario = document.getElementById('pComentario').value;
    var user = document.getElementById('sesion').value;

    var promedio = (parseInt(p1) + parseInt(p2) + parseInt(p3) + parseInt(p4) + parseInt(p5)) / 5;
    if(pComentario == ""){
        alert("Porfavor es obligatorio dejar su sugerencia...!")
    }else{
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
}


//verificar si hay usuario login

function verificarSesionBotonEncuesta(){
    var validar = document.getElementById('validarSesion');
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            guardarOpinion();
        } else {
            $("#modalLogin").modal();
        }
      });
}

function listarEncuesta(){
 var tabla = document.getElementById('tablaEncuesta');
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
}

function cerrarSesion(){

    location.reload(true);

    firebase.auth().signOut()
    .then(function(){
        console.log("saliendo.....");
    })
    .catch(function(error){
        console.log(error);
    });

}
/* ******* Navegabilidad  ***********
   Funciones para cambiar de vistas */
function inicio(){
    document.getElementById('contenedorCriterio').style.display = "none"
    document.getElementById('contenedorInicio').style.display = "block"
    document.getElementById('contenedorBar').style.display = "none"
    document.getElementById('contenedorEncuesta').style.display = "none"
    document.getElementById('contenedorAdministrador').style.display = "none"

    $("#inicio").addClass("active");
    $("#criterio").removeClass("active");
    $("#bar").removeClass("active");
    $("#encuesta").removeClass("active");
    $("#administrador").removeClass("active");
}

function bares(){
    document.getElementById('contenedorCriterio').style.display = "none"
    document.getElementById('contenedorInicio').style.display = "none"
    document.getElementById('contenedorBar').style.display = "block"
    document.getElementById('contenedorEncuesta').style.display = "none"
    document.getElementById('contenedorAdministrador').style.display = "none"

    $("#inicio").removeClass("active");
    $("#criterio").removeClass("active");
    $("#bar").addClass("active");
    $("#encuesta").removeClass("active");
    $("#administrador").removeClass("active");
}

function encuesta(){
    document.getElementById('contenedorCriterio').style.display = "none"
    document.getElementById('contenedorInicio').style.display = "none"
    document.getElementById('contenedorBar').style.display = "none"
    document.getElementById('contenedorEncuesta').style.display = "block"
    document.getElementById('contenedorAdministrador').style.display = "none"

    $("#inicio").removeClass("active");
    $("#criterio").removeClass("active");
    $("#bar").removeClass("active");
    $("#encuesta").addClass("active");
    $("#administrador").removeClass("active");
}

function criterio(){
    document.getElementById('contenedorCriterio').style.display = "block"
    document.getElementById('contenedorInicio').style.display = "none"
    document.getElementById('contenedorBar').style.display = "none"
    document.getElementById('contenedorEncuesta').style.display = "none"
    document.getElementById('contenedorAdministrador').style.display = "none"

    $("#inicio").removeClass("active");
    $("#criterio").addClass("active");
    $("#bar").removeClass("active");
    $("#encuesta").removeClass("active");
    $("#administrador").removeClass("active");
}

function administrador(){
    document.getElementById('contenedorCriterio').style.display = "none"
    document.getElementById('contenedorInicio').style.display = "none"
    document.getElementById('contenedorBar').style.display = "none"
    document.getElementById('contenedorEncuesta').style.display = "none"
    document.getElementById('contenedorAdministrador').style.display = "block"
    document.getElementById('aggBar').style.display = "none"
    document.getElementById('editarUsuario').style.display = "none"
    listaUsurio();
    listarBar();
    listarEncuestaAdmi();

    $("#inicio").removeClass("active");
    $("#criterio").removeClass("active");
    $("#bar").removeClass("active");
    $("#encuesta").removeClass("active");
    $("#administrador").addClass("active");
}
//**********************************************
function cargar(){
   inicio();
   listarTarjetaBar();
   listarTarjetaBarInicio();
   listarEncuesta();
}

//********* Usuario */
function listaUsurio(){
    var tabla = document.getElementById('tablaUsuario');
        db.collection("usuario").onSnapshot((querySnapshot) => {
            tabla.innerHTML = "";
            querySnapshot.forEach((doc) => {

                var key = doc.id;

                tabla.innerHTML += `
                <tr>
                    <td>${doc.data().nombre}</td>
                    <td>${doc.data().apellido}</td>
                    <td>${doc.data().tipo}</td>
                    <td>
                    <button class="badge badge-primary" onClick="editarUsuario('${key}','${doc.data().nombre}','${doc.data().apellido}','${doc.data().tipo}')">Editar</button>
                    <button class="badge badge-danger" >Inhabilitar</button>
                    </td>
                </tr>`
                
            });
    });
}
// function eliminarUsuario(id,uid){

//     firebase.auth().deleteUser(uid);

//     db.collection("usuario").doc(id).delete()
//     .then(function() {
//         console.log("Document successfully deleted!");
//     })
//     .catch(function(error) {
//         console.error("Error removing document: ", error);
//     });
// }
function editarUsuario(id,nombre,apellido,tipo){
    $("#editarUsuario").toggle();
    $("#nombreUsuario").val(nombre);
    $("#apellidoUsuario").val(apellido);
    $("#tipoUsuario1").val(tipo);

    var botonActualizar = document.getElementById('botonActualizar');

    botonActualizar.onclick = function(){
        var washingtonRef = db.collection("usuario").doc(id);
        var nombre = $("#nombreUsuario").val();
        var apellido = $("#apellidoUsuario").val();
        var tipo = $("#tipoUsuario1").val();

        return washingtonRef.update({
            nombre: nombre,
            apellido: apellido,
            tipo: tipo
        })
        .then(function() {
            console.log("Document successfully updated!");
            $("#nombreUsuario").val("");
            $("#apellidoUsuario").val("");
            $("#tipoUsuario1").val("");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }
} 

function autentificarAdmi(){
    
    var nombre = $("#nombreAdmi").val();
    var apellido = $("#apellidoAdmi").val();
    var email = $("#email1Admi").val();
    var contrasena = $("#contrasena1Admi").val();
    var tipo = $("#tipoUsuario").val();

    firebase.auth().createUserWithEmailAndPassword(email, contrasena)
    .then(function(docRef) {
        guardarUsuarioAdmi(nombre,apellido,tipo,docRef.uid);
        $("#nombreAdmi").val("");
        $("#apellidoAdmi").val("");
        $("#email1Admi").val("");
        $("#contrasena1Admi").val("");
        $("#tipoUsuario").val("Selecione Tipo Usuario..");
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ...
      });
  }

function guardarUsuarioAdmi(nombre,apellido,tipo,id){
    db.collection("usuario").add({
        nombre: nombre,
        apellido: apellido,
        tipo: tipo,
        idAutenticacion: id
    })
    .then(function(docRef) {   
        console.log("Document written with ID: ", docRef.id);
        alert("Gracias " + nombre + " por formar parte de CritiBar...");
        location.reload(true);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

function listarEncuestaAdmi(){
    var tabla = document.getElementById('tablaCriterio');
       db.collection("opinion").onSnapshot((querySnapshot) => {
           tabla.innerHTML = "";
           querySnapshot.forEach((doc) => {
               tabla.innerHTML += `
               <tr>
                   <td>${doc.data().restaurante}</td>
                   <td>${doc.data().promedio}</td>
                   <td>${doc.data().pComentario}</td>
                   <td>${doc.data().user}</td>
                   <td>
                    <button class="badge badge-danger" onClick="eliminarCriterio('${doc.id}')">Eliminar</button>
                    </td>
               </tr>`
               
           });
       });
   }

function eliminarCriterio(id){
    db.collection("opinion").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

// AGREGAR BAR 

function cargarBarSelect(){
    var tabla = document.getElementById('barOpcion');
    db.collection("bar").onSnapshot((querySnapshot) => {
        tabla.innerHTML = "";
        querySnapshot.forEach((doc) => {
            tabla.innerHTML += `
            <option value = "${doc.data().nombreBar}">${doc.data().nombreBar}</option>`
            
        });
    });
}

function aggBar(){
    $("#aggBar").toggle();
}

function mostrarEditarBar(id){
    $("#fichero").css("display","none");
    $("#aggBar").toggle();
    $("#botonBar").css("display","none");
    $("#botonBar2").css("display","block");
    db.collection("bar").onSnapshot((querySnapshot) => {  
        querySnapshot.forEach((doc) => {       
            if(id == doc.id){  
                $("#idBar").val(doc.id);          
                $("#nombreBar").val(doc.data().nombreBar);
                $("#descripcionBar").val(doc.data().descripcion);
            }    
        }); 
    });
}

function editarBar(){
    var nombreBar = $("#nombreBar").val();
    var descripcionBar = $("#descripcionBar").val();
    var id = $("#idBar").val();
    var washingtonRef = db.collection("bar").doc(id);

        return washingtonRef.update({
            nombreBar: nombreBar,
            descripcion: descripcionBar
        })
        .then(function() {
            console.log("Document successfully updated!");
            $("#fichero").css("display","block");
            $("#aggBar").toggle();
            $("#nombreBar").val("");
            $("#descripcionBar").val("");
            $("#botonBar").css("display","block");
            $("#botonBar2").css("display","none");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

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
                <button class="badge badge-primary" onclick="mostrarEditarBar('${doc.id}')">Editar
                </button>
                <button class="badge badge-danger" onclick="eliminarBares('${doc.id}')">Eliminar
                </button>
                </td>
            </tr>`      
        });

    });
}
function eliminarBares(id){
    
    db.collection("bar").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");       
    }).catch(function(error) {
        console.error("Error removing document: ", error);
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
        guardarBar(file.name, url, nombreBar, descripcion);
        alert("Datos guardados");
    });

}

function guardarBar(nombreFoto, url, nombreBar, descripcion){
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
        document.getElementById('aggBar').style.display = "none";
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}



function recuperarPassEmail(){
    var auth = firebase.auth();
    var email = $("#emailRecuperarPass").val();

    auth.sendPasswordResetEmail(email).then(function() {
        $("#modalMensajePass").modal();
    }).catch(function(error) {
        alert(error);
    });
}

function habilitarActPerfil(){
    $("#nombrePerfil").attr("readonly", false);
    $("#apellidoPerfil").attr("readonly", false);
    $("#habilitarActualizacionPerfil").css("display","none");
    $("#actualizarPerfil").css("display","block");
    
}

function actualizarPerfil(){
        var id = $("#idPerfil").val();
        var washingtonRef = db.collection("usuario").doc(id);
        var nombre = $("#nombrePerfil").val();
        var apellido = $("#apellidoPerfil").val();

        return washingtonRef.update({
            nombre: nombre,
            apellido: apellido
        })
        .then(function() {
            console.log("Document successfully updated!");
            $("#nombrePerfil").attr("readonly", true);
            $("#apellidoPerfil").attr("readonly", true);
            $("#habilitarActualizacionPerfil").css("display","block");
            $("#actualizarPerfil").css("display","none");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}

function mostrarPerfil(){
    var user = firebase.auth().currentUser;
    if (user) {
      // User is signed in.
      db.collection("usuario").onSnapshot((querySnapshot) => {  
            querySnapshot.forEach((doc) => {   
                var apellido = $("#apellidoPerfil").val();    
                if(user.uid == doc.data().idAutenticacion){            
                    $("#idPerfil").val(doc.id)
                    $("#nombrePerfil").val(doc.data().nombre);
                    $("#apellidoPerfil").val(apellido = doc.data().apellido);  
                }    
            }); 
    });
    } else {
      // No user is signed in.
    }
}

function eliminarUsuario(){
    var user = firebase.auth().currentUser;
    db.collection("usuario").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(user.uid == doc.data().idAutenticacion){
                db.collection("usuario").doc(doc.id).delete().then(function() {
                    console.log("Document successfully deleted!"); 
                    user.delete().then(function() {
                              console.log("Eliminado....");
                              alert("El usuario se a eliminado..!!");
                              location.reload(true);
                          }).catch(function(error) {
                              console.log(error);
                           });      
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            }else{
                console.log("no encuentra la relacion entre tablas");
            }
            
        });
    });
    
}

function noEliminarUsuario(){
    location.reload(true);
}

function cambiarPass(){

    var user = firebase.auth().currentUser;
    var newPassword = $("#nuevaPass").val();

    user.updatePassword(newPassword).then(function() {
    // Update successful.
    alert("Su contraseña ha sido cambiada con exito....!!!!");
    location.reload(true);
    }).catch(function(error) {
    // An error happened.
    alert("Su contraseña no ha sido cambiada con exito....!!!!");
    });
}


tablaBarRankin();
observador();
cargarBarSelect();


