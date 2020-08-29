const botones = document.querySelector("#botones");
const nombreUsuario = document.querySelector("#nombreUsuario");
const contenidoProtegido = document.querySelector("#contenidoProtegido");
const formulario = document.querySelector("#formulario");
const inputChat = document.querySelector("#inputChat");

firebase.auth().onAuthStateChanged( user =>{
    if(user) {
        console.log(user);
        botones.innerHTML = ` <button class="btn btn-outline-danger" id="btnCerrarSesion">Cerrar Sesion</button> `

        nombreUsuario.innerHTML = user.displayName;

        cerrarSesion ();

        formulario.classList = 'input-group py-3 fixed-bottom container';
        contenidoChat(user);

    }else{
        console.log("no existe usuario");
        botones.innerHTML = ` <button class="btn btn-outline-success mr-2" id="btnAcceder">Acceder</button> `
        // el = remplaza todo el contenido
        //+= se concatena la informacion
        
        iniciarSesion ();

        nombreUsuario.innerHTML = 'Chat';

        contenidoProtegido.innerHTML = ` <p class="text-center lead mt-5">Debes iniciar Sesion</p> `

        formulario.classList = 'input-group py-3 fixed-bottom container d-none';
    }
}); //hasta aqui todo bien, segundo video minuto 6.45

const contenidoChat = (user) => {
    // fue de ejemplo estara parte, se eilimina en el video 5 minuto 2.13
    //contenidoProtegido.innerHTML = ` <p class="text-center lead mt-5">Bienvenido ${ user.email }</p> `

    formulario.addEventListener('submit', (e) => {
        e.preventDefault(); //el navegador proceso la solicitud y actualizo
        console.log(inputChat.value); //hasta aqui va bien el codigo, salio el console.log

        if(!inputChat.value.trim()) {
            console.log("input vacio");
            return 
            // hasta aqui funciona el programa minuto 11.20
        }

        firebase.firestore().collection('chat').add({
            texto: inputChat.value,
            uid: user.uid,
            fecha: Date.now()
        })
        .then(res => {
            console.log('mensaje guardado')
        })
        .catch( e => console.log(e))

        inputChat.value = '';
    });

    firebase.firestore().collection('chat').orderBy('fecha')
        .onSnapshot(query => {
            //console.log(query);
            contenidoProtegido.innerHTML = '';
            query.forEach(doc => {
                console.log(doc.data());

                if(doc.data().uid === user.uid) {
                    contenidoProtegido.innerHTML += `
                    <div class="d-flex justify-content-end">
                      <span class="badge badge-pill badge-danger">${ doc.data().texto }</span>
                    </div>
                    `;

                } else {
                    contenidoProtegido.innerHTML += `
                    <div class="d-flex justify-content-start">
                      <span class="badge badge-pill badge-secondary">${ doc.data().texto }</span>
                     </div>
                    `;      
                }
                contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight;
            })
        })    
}

const cerrarSesion = () => {
    const btnCerrarSesion = document.querySelector("#btnCerrarSesion");
    btnCerrarSesion.addEventListener('click', () => {
        firebase.auth().signOut();
    });
}



const iniciarSesion = () => {
    const btnAcceder = document.querySelector("#btnAcceder");
    btnAcceder.addEventListener('click', async () => {
        //console.log("me diste click en acceder"); comunicacion entre boton y funcion creada iniciarSesion() funciona
        try {
            //INGRESAR VENTANA MODAL LLAMANDO PROVIDER minuto 7.09 parte 3 funciona
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider);
        } catch (error) {
            console.log(error);
        }
    });
}

//3.27 parte 4 funciona