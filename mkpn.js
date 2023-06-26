const sectionSeleccionarAtaque = document.getElementById("Seleccionar-Ataque")
const sectionReiniciar = document.getElementById("Reiniciar")
const botonMascotaJugador = document.getElementById("boton-mascota")
const botonReiniciar = document.getElementById("boton-reiniciar")
sectionReiniciar.style.display = "none"

const sectionSeleccionarMascota = document.getElementById("Seleccionar-Mascota")

const spanMascotaJugador = document.getElementById("mascota-jugador")

const spanMascotaEnemigo = document.getElementById("mascota-enemigo")

const spanVidasJugador = document.getElementById("vidas-jugador")
const spanVidasEnemigo = document.getElementById("vidas-enemigo")

const sectionMensajes = document.getElementById("resultado")
const ataqueDelJugador = document.getElementById("ataque-del-jugador")
const ataqueDelEnemigo = document.getElementById("ataque-del-enemigo")
const contenedorTarjetas = document.getElementById("contenedorTarjetas")
const contenedorAtaque = document.getElementById("contenedorAtaques")

const sectionVerMapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")

let jugadorId = null
let enemigoId = null
let mokepones = []
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDeMokepones
let inputHipodogue
let inputCapipepo 
let inputRatigueya
let mascotaJugador
let mascotaJugadorObjeto
let ataquesMokepon
let ataquesMokeponEnemigo
let botonFuego
let botonAgua
let botonPlanta
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let VidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = "./assets/mokemapa.png"
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20 
const anchoMaxDelMapa = 550

if (anchoDelMapa > anchoMaxDelMapa) {
    anchoDelMapa = anchoMaxDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

class mokepon {
    constructor(nombre, foto, vidas, fotoMapa,x =10, y = 10, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vidas = vidas
        this.ataques = []
        this.ancho = 55
        this.alto = 55
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mappaFoto = new Image()
        this.mappaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }

    pintarMokepon() {
        lienzo.drawImage(
            this.mappaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto,
       )
    }
}

let Hipodogue = new mokepon("Hipodogue","./assets/greninjja.png", 5, "./assets/cara_gre.png")
let Capipepo = new mokepon("Capipepo", "./assets/254-Sceptile.webp", 5, "./assets/cara_sce.png")
let Ratigueya = new mokepon("Ratigueya", "./assets/157.png", 5, "./assets/cara_thy.png")

const HIPODOGUE_ATAQUES = [
    { nombre: "💧", id: "boton-AGUA" },
    { nombre: "💧", id: "boton-AGUA" },
    { nombre: "💧", id: "boton-AGUA" },
    { nombre: "🌱", id: "boton-PLANTA" },
    { nombre: "🔥", id: "boton-FUEGO" },
]

Hipodogue.ataques.push(...HIPODOGUE_ATAQUES)

const CAPIPEPO_ATAQUES = [
    { nombre: "🌱", id: "boton-PLANTA" },
    { nombre: "🌱", id: "boton-PLANTA" },
    { nombre: "🌱", id: "boton-PLANTA" },
    { nombre: "💧", id: "boton-AGUA" },
    { nombre: "🔥", id: "boton-FUEGO" },
]

Capipepo.ataques.push(...CAPIPEPO_ATAQUES)

const RATIGUEYA_ATAQUES = [
    { nombre: "🔥", id: "boton-FUEGO" },
    { nombre: "🔥", id: "boton-FUEGO" },
    { nombre: "🔥", id: "boton-FUEGO" },
    { nombre: "💧", id: "boton-AGUA" },
    { nombre: "🌱", id: "boton-PLANTA" },
]

Ratigueya.ataques.push(...RATIGUEYA_ATAQUES)

mokepones.push(Hipodogue,Capipepo,Ratigueya)

function iniciarJuego(){
    
    sectionSeleccionarAtaque.style.display = "none"
    sectionVerMapa.style.display = "none"

    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
        <input type="radio" name="mascota" id=${mokepon.nombre} />
        <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} alt=${mokepon.nombre}> 
        </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones 

        inputHipodogue = document.getElementById("Hipodogue")
        inputCapipepo = document.getElementById("Capipepo")
        inputRatigueya = document.getElementById("Ratigueya")
        

    })
    
    sectionReiniciar.style.display = "none"
    
    botonMascotaJugador.addEventListener("click", selecionarMascotaJugador)
    
    botonReiniciar.addEventListener("click", reiniciarJuego)

    unirseAlJuego()
} 

function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")
        .then(function (res) {
            
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

function selecionarMascotaJugador() {
 
    if (inputHipodogue.checked){
        spanMascotaJugador.innerHTML = inputHipodogue.id
        mascotaJugador = inputHipodogue.id
    } else if(inputCapipepo.checked){
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } else if(inputRatigueya.checked){
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else {
        alert("seleciona una mascota")
        return
    }

    sectionSeleccionarMascota.style.display = "none"
    seleccionarMokepon(mascotaJugador)
    extraerAtaque(mascotaJugador)
    sectionVerMapa.style.display = "flex"
    iniciarMapa()
}

function seleccionarMokepon(mascotaJugador) {
    fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}

function extraerAtaque(mascotaJugador){
    let ataques 
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            ataques = mokepones[i].ataques
        }  
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {
    ataques.forEach((ataque) => {
        ataquesMokepon = `<button id= ${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>`
        contenedorAtaque.innerHTML += ataquesMokepon
    })

    botonFuego = document.getElementById("boton-FUEGO")
    botonAgua = document.getElementById("boton-AGUA")
    botonPlanta = document.getElementById("boton-PLANTA")
    
    botones = document.querySelectorAll(".BAtaque")
}

function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            if (e.target.textContent === "🔥 ") {
                ataqueJugador.push("FUEGO")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"
                boton.disabled = true
            } else if (e.target.textContent === "💧 ") {
                ataqueJugador.push("AGUA")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"
                boton.disabled = true
            } else {
                ataqueJugador.push("PLANTA")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"  
                boton.disabled = true       
            }
            if (ataqueJugador.length ===5) {
                enviarAtaques()
            }
            
        })
    })
}

function enviarAtaques() {
     fetch(`http://localhost:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/jason" },
        body: JSON.stringify({
            ataques: ataqueJugador
        }) 
     })
     intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    fetch(`http://localhost:8080/mokepon/${enemigoId}/ataques`)
    .then (function (res) {
        if (res.ok) {
            res.json()
            .then(function ({ ataques }) {
                if (ataques.length === 5) {
                    ataqueEnemigo = ataques
                    combate()
                }
            })
        }
    })
}


function seleccionarMascotaEnemigo(enemigo) {
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
    secuenciaAtaque()
}


function ataqueAleatorioEnemigo() {
    let ataqueAleatorio = aleatorio(0,ataquesMokeponEnemigo.length -1)

    if (ataqueAleatorio == 0 || ataqueAleatorio == 1){
        ataqueEnemigo.push("FUEGO")
    } else if (ataqueAleatorio == 3 || ataqueAleatorio == 4){
        ataqueEnemigo.push("AGUA")
    } else {
        ataqueEnemigo.push("PLANTA")
    }
    
    iniciarPelea() 
}

function iniciarPelea() {
    if (ataqueJugador.length === 5) {
        combate()
    }
}

function indexAmbosOponentes(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]

}

function combate() {
    clearInterval(intervalo)
    
    for (let index = 0; index < ataqueJugador.length; index++) {
       if(ataqueJugador[index] === ataqueEnemigo[index]) {
        indexAmbosOponentes(index, index)
        crearMensaje("EMPATE")
       } else if (ataqueJugador[index] === "FUEGO" && ataqueEnemigo[index] === "PLANTA") {
        indexAmbosOponentes(index, index)
        crearMensaje("GANASTE")
        victoriasJugador++
        spanVidasJugador.innerHTML = victoriasJugador 
       } else if (ataqueJugador[index] === "AGUA" && ataqueEnemigo[index] === "FUEGO") {
        indexAmbosOponentes(index, index)
        crearMensaje("GANASTE")
        victoriasJugador++
        spanVidasJugador.innerHTML = victoriasJugador 
       } else if (ataqueJugador[index] === "PLANTA" && ataqueEnemigo[index] === "AGUA") {
        indexAmbosOponentes(index, index)
        crearMensaje("GANASTE")
        victoriasJugador++
        spanVidasJugador.innerHTML = victoriasJugador
       } else {
        indexAmbosOponentes(index, index)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
        spanVidasEnemigo.innerHTML = victoriasEnemigo
       }
    }
    revisarVidas()
}

function revisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("Esto fue un EMPATE!!!")
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("Eres el GANADOR 🏆")
    } else {
        crearMensajeFinal("Haz PERDIDO")
    }
}

function crearMensaje(resultado) {

    let nuevoAtaqueDelJugador = document.createElement("p")
    let nuevoAtaqueDelEnemigo = document.createElement("p")

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

   ataqueDelJugador.appendChild(nuevoAtaqueDelJugador)
   ataqueDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)    
}  


function crearMensajeFinal(resultadoFINAL) {
    
    sectionMensajes.innerHTML = resultadoFINAL
   
    sectionReiniciar.style.display = "block"
}  


function reiniciarJuego(){
    location.reload()
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function iniciarMapa() {
    
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    intervalo = setInterval(pintarCanvas, 50)
    
    window.addEventListener("keydown", sePresionoUnaTecla)
    
    window.addEventListener("keyup", detenerMovimiento)
}

function pintarCanvas() {

    mascotaJugadorObjeto.x =  mascotaJugadorObjeto.x +  mascotaJugadorObjeto.velocidadX 
    mascotaJugadorObjeto.y =  mascotaJugadorObjeto.y +  mascotaJugadorObjeto.velocidadY
    
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height,
    )
    mascotaJugadorObjeto.pintarMokepon()

    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)

   mokeponesEnemigos.forEach(function (mokepon) {
        mokepon.pintarMokepon()
        revisarColision(mokepon)
   })
}

function enviarPosicion(x, y) {
    fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x: x,
            y: y,
        })
    })
    .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function ({ enemigos }) {
                    console.log(enemigos)
                    mokeponesEnemigos = enemigos.map(function (enemigo){
                        let mokeponEnemigo = null
                        const mokeponNombre = enemigo.mokepon.nombre || ""
                        if (mokeponNombre === "Hipodogue") {
                            mokeponEnemigo = new mokepon("Hipodogue","./assets/greninjja.png", 5, "./assets/cara_gre.png", enemigo.id)
                        } else if (mokeponNombre === "Capipepo") {
                            mokeponEnemigo = new mokepon("Capipepo", "./assets/254-Sceptile.webp", 5, "./assets/cara_sce.png", enemigo.id)
                        } else if (mokeponNombre === "Ratigueya") {
                            mokeponEnemigo = new mokepon("Ratigueya", "./assets/157.png", 5, "./assets/cara_thy.png", enemigo.id)
                        }

                        mokeponEnemigo.x = enemigo.x
                        mokeponEnemigo.y = enemigo.y
                        enemigoId = enemigo.id
                        return mokeponEnemigo
                    })
                
                })
        }
    })
}
 
function moverDerecha() {
    mascotaJugadorObjeto.velocidadX = 5
}

function moverIzquierda() {
    mascotaJugadorObjeto.velocidadX = -5
}

function moverAbajo() {
    mascotaJugadorObjeto.velocidadY = 5
}

function moverArriba() {
    mascotaJugadorObjeto.velocidadY = -5
}

function detenerMovimiento() {
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}

function sePresionoUnaTecla(event) {
    switch (event.key) {
        case "ArrowUp":
            moverArriba()
            break;
        case "ArrowDown":
            moverAbajo()
            break;
        case "ArrowLeft":
            moverIzquierda()
            break;
        case "ArrowRight":
            moverDerecha()
            break;

        default:
            break;
    }
}

function obtenerObjetoMascota() {
    for (let i = 0; i < mokepones.length; i++) {
        if(mascotaJugador === mokepones[i].nombre) {
            return mokepones[i]
        }  
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const izquierdaEnemigo = enemigo.x
    const derechaEnemigo = enemigo.x + enemigo.ancho

    const arribaMascota = mascotaJugadorObjeto.y
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const izquierdaMascota = mascotaJugadorObjeto.x
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho

    if(
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)

    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = "flex"
    sectionVerMapa.style.display = "none"
    seleccionarMascotaEnemigo(enemigo)
}

window.addEventListener("load", iniciarJuego)  