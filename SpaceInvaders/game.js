const board = document.querySelector('.board')
const resultDisplay = document.querySelector('.results')
const boardtamaño = 24
const navesEnemigasBorradas=[]
const cooldownDisparo=500; //milisegundos
let disparoindex = 516
let enemigosId
let vaDerecha = true
let direccion = 1
let results = 0
let ultimoDisparo =0
let gameOver = false



//Se crean los divs que representan el fondo del juego, las casillas
for( let i=0; i<boardtamaño*boardtamaño;i++){
const square=document.createElement('div')
board.appendChild(square)

}


//Se crean los arreglos

const squares= Array.from(document.querySelectorAll('.board div')) //Todos los divs, por eso usamos All
console.log(squares)

const navesEnemigas= [
    0,1,2,3,4,5,6,7,8,9,
    24,25,26,27,28,29,30,31,32,33,
    48,49,50,51,52,53,54,55,56,57,
]

function draw(){
    for(let i=0;i<navesEnemigas.length;i++){
        if(!navesEnemigasBorradas.includes(i)){    //Chequear si existe, y si no, añadimos la clase

            squares[navesEnemigas[i]].classList.add('enemigo')}
}
}

draw()

// Al cargar la página del juego:


function configurarJuego(naveSeleccionada) {
    console.log("Nave seleccionada:", naveSeleccionada);
    const naveJugador = document.getElementById('naveJugador');
    switch (naveSeleccionada) {
        case 'Nave 1':
            naveJugador.src = '../Imagenes/nave1.png';
            naveJugador.alt = 'Nave 1';
            disparador.classList.add('disparador-nave1');
            break;
        case 'Nave 2':
            naveJugador.src = '../Imagenes/nave2.png';
            naveJugador.alt = 'Nave 2';
            disparador.classList.add('disparador-nave2');
            break;
        case 'Nave 3':
            naveJugador.src = '../Imagenes/nave3.png';
            naveJugador.alt = 'Nave 3';
            disparador.classList.add('disparador-nave3');
            break;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Verifica si hay una selección de nave en localStorage
    const naveSeleccionada = localStorage.getItem('naveSeleccionada');
    if (naveSeleccionada) {
        // Utiliza la selección de la nave para configurar el juego
        configurarJuego(naveSeleccionada);
    } 
    }
);






//La nave que dispara:

squares[disparoindex].classList.add('disparador') //Hasta que unifiquemos con la imagen del las 3 naves

function remove() { //funcion para remover los enemigos cuando se mueven
    for(let i = 0 ; i < navesEnemigas.length; i++){
        squares[navesEnemigas[i]].classList.remove('enemigo')
    }
}


function moverdisparador(e){  //Funcion para mover la nave, falta avanzarla

    if(gameOver){ //si pierde o gana, se detiene
        return
    }
    squares[disparoindex].classList.remove('disparador') //que cuando se mueva la nave, se vaya borrando lo anterior
    switch(e.key){
        case 'ArrowLeft':
            if(disparoindex % boardtamaño !==0) disparoindex -=1 //para que no se mueva mas a la izquierda del borde
            break
        case 'ArrowRight':
            if (disparoindex % boardtamaño < boardtamaño - 1)disparoindex +=1 //para que no se mueva a la derecha del borde, sino que vaya volviendo izq
            break
    }
    squares[disparoindex].classList.add('disparador')
}

document.addEventListener('keydown', moverdisparador)

function moverenemigos(){ //funcion que maneja el movimiento de los enemigos

    if(gameOver){ //si pierde o gana, se detiene
        return
    }
    const leftEdge = navesEnemigas[0] % boardtamaño === 0 //bordes enemigos izq
    const rightEdge = navesEnemigas[navesEnemigas.length - 1] % boardtamaño === boardtamaño - 1 //bordes enemigos der, que no se muevan a la derecha del borde
    remove()

if(rightEdge && vaDerecha) { //si tocan el borde derecho y van hacia la derecha, bajan
    for (let i=0;i < navesEnemigas.length; i++){
        navesEnemigas[i] += boardtamaño + 1
        direccion = -1
        vaDerecha = false
        }
    }

    if(leftEdge &&!vaDerecha){ //lo mismo pero cuando van a la izquierda
        for (let i = 0; i < navesEnemigas.length; i++){
            navesEnemigas[i] += boardtamaño - 1
            direccion = 1
            vaDerecha = true
        }
    }

    for (let i = 0; i < navesEnemigas.length; i++){ //direccion de las naves
        navesEnemigas[i] += direccion
    }
    draw() //reusamos la funcion draw

    if (squares[disparoindex].classList.contains("enemigo")){ //si tocan a la nave pierde
        resultDisplay.innerHTML = 'PERDISTE'
        clearInterval(enemigosId)
        gameOver = true
    }

    if (navesEnemigasBorradas.length === navesEnemigas.length){ //si matamos todo ganamos
        resultDisplay.innerHTML = 'GANASTE'
        clearInterval(enemigosId)
        gameOver = true
    }
}
enemigosId = setInterval(moverenemigos, 300) //muevo a los enemigos cada 300 milisegundos

function dispara(e){ //funcion dispara a los enemigos desde la nave

    if(gameOver){ //si pierde o gana, se detiene
        return
    }
    const currentTime = new Date().getTime(); // Obtener el tiempo actual
    if (currentTime - ultimoDisparo >= cooldownDisparo) { // Verificar si ha pasado suficiente tiempo desde el último disparo
        ultimoDisparo = currentTime; // Actualizar el tiempo del último disparo

    let laserId
    let laserindex = disparoindex
    
    function moverLaser(){ //la funcion que mueve los lasers

        if(gameOver){ //si pierde o gana, se detiene
            return
        }
        squares[laserindex].classList.remove('laser')
        laserindex -= boardtamaño

        squares[laserindex].classList.add('laser')

        if(squares[laserindex].classList.contains('enemigo')){//si toca el laser al enemigo
            squares[laserindex].classList.remove('laser') //se va el laser
            squares[laserindex].classList.remove('enemigo') //se va el enemigo
            squares[laserindex].classList.add('explotar') //oppenheimer

            setTimeout (() => squares[laserindex].classList.remove('explotar'), 600)//remueve la explosion despues de 600 milisegundos
            clearInterval(laserId) 

            const naveEnemigaBorrada = navesEnemigas.indexOf(laserindex)
            navesEnemigasBorradas.push(naveEnemigaBorrada)
            results++
            resultDisplay.innerHTML = results
            console.log(navesEnemigasBorradas) //estos comandos son para borrar todo una vez q se destruye, enemigos y lasers
        }
    }
        if (e.key === 'ArrowUp'){
            laserId = setInterval(moverLaser, 100) //tiempo de movimiento laser
            }
        }
    }

document.addEventListener('keydown', dispara)

//Falta incorporar selector de naves
//Falta ver que pasa con la imagen explotar y el fondo // BENJA
//Enemigos bajen mas rapido // BENJA
//Falta revisar que hacer cuando cambiamos el tamaño de la pestaña
//Revisar que pasa en el codigo cuando gana y pierde, Incorporar el sistema de puntos (corregir) //BENJA BLAS (me falta todavia)
