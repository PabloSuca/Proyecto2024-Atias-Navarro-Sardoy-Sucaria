const board = document.querySelector('.board')
const resultDisplay = document.querySelector('.results')
const boardtamaño = 15
const navesEnemigasBorradas = []
const cooldownDisparo = 200; 
let disparoindex = 187
let enemigosId
let vaDerecha = true
let direccion = 1
let results = 0
let ultimoDisparo = 0
let gameOver = false


/** 
*Crea los divs que representan el fondo del juego, las casillas.
* @function
*/
for (let i = 0; i < boardtamaño * boardtamaño; i++) {
    const square = document.createElement('div')
    board.appendChild(square)

}


//Se crean los arreglos
const squares = Array.from(document.querySelectorAll('.board div')) //Todos los divs, por eso usamos all
console.log(squares)

let navesEnemigas = [
0, 1, 2, 3, 4,
15, 16, 17, 18, 19,
30, 31, 32, 33, 34
]

/**
* Dibuja las naves enemigas en el tablero.
* @function draw
*/
function draw() {
    for (let i = 0; i < navesEnemigas.length; i++) {
        if (!navesEnemigasBorradas.includes(i)) {    //Chequear si existe, y si no, añadimos la clase
            squares[navesEnemigas[i]].classList.add('enemigo')
        }
    }
}

draw()

/**
* Configura el juego según la nave seleccionada.
* @function configurarJuego
* @param {string} naveSeleccionada - Nombre de la nave seleccionada por el jugador.
*/
function configurarJuego(naveSeleccionada) {
    console.log("Nave seleccionada:", naveSeleccionada);

    const disparador = document.querySelector('.disparador');
    switch (naveSeleccionada) {
        case 'Nave 1':

            disparador.classList.add('disparador-nave1');
            break;
        case 'Nave 2':

            disparador.classList.add('disparador-nave2');
            break;
        case 'Nave 3':

            disparador.classList.add('disparador-nave3');
            break;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Verifica si hay una selección de nave en localStorage
    const naveSeleccionada = localStorage.getItem('naveSeleccionada');
    if (naveSeleccionada) {
    // Utiliza la selección de la nave para configurar el juego
        configurarJuego(naveSeleccionada);
    }
}
);


/**
* Remueve las naves enemigas del tablero.
* @function remove
*/
function remove() { //funcion para remover los enemigos cuando se mueven
    for (let i = 0; i < navesEnemigas.length; i++) {
        squares[navesEnemigas[i]].classList.remove('enemigo')
    }
}

squares[disparoindex].classList.add('disparador') // Hasta que unifiquemos con la imagen del las 3 naves

/**
* Mueve la nave disparadora según la tecla presionada.
* @function moverdisparador
* @param {Event} e - Evento de teclado.
*/
function moverdisparador(e) {  //Funcion para mover la nave, falta avanzarla

    if (gameOver) { //Si pierde, se detiene el juego
        return
    }
    squares[disparoindex].classList.remove('disparador', `disparador-nave${naveSeleccionada.charAt(naveSeleccionada.length - 1)}`) //que cuando se mueva la nave, se vaya borrando lo anterior
    switch (e.key) {
        case 'ArrowLeft':
            if (disparoindex % boardtamaño !== 0) disparoindex -= 1 //Para que no se mueva mas a la izquierda del borde
            break
        case 'ArrowRight':
            if (disparoindex % boardtamaño < boardtamaño - 1) disparoindex += 1 //Para que no se mueva a la derecha del borde, sino que vaya volviendo izq
            break
    }
    squares[disparoindex].classList.add('disparador', `disparador-nave${naveSeleccionada.charAt(naveSeleccionada.length - 1)}`)
}

document.addEventListener('keydown', moverdisparador)

/**
* Maneja el movimiento de los enemigos.
* @function moverenemigos
*/
function moverenemigos() { 
    console.log("Mover enemigos");

    if (gameOver) { //Si pierde, se detiene el juego
        return
    }
    const leftEdge = navesEnemigas[0] % boardtamaño === 0 // Bordes enemigos izq
    const rightEdge = navesEnemigas[navesEnemigas.length - 1] % boardtamaño === boardtamaño - 1 // Bordes enemigos der, que no se muevan a la derecha del borde
    remove();


    if (rightEdge && vaDerecha) { //Si tocan el borde derecho y van hacia la derecha, bajan
        for (let i = 0; i < navesEnemigas.length; i++) {
            navesEnemigas[i] += boardtamaño + 1
            direccion = -1
            vaDerecha = false
        }
    }

    if (leftEdge && !vaDerecha) { //Lo mismo pero cuando van a la izquierda
        for (let i = 0; i < navesEnemigas.length; i++) {
            navesEnemigas[i] += boardtamaño - 1
            direccion = 1
            vaDerecha = true
        }
    }

    for (let i = 0; i < navesEnemigas.length; i++) { //Direccion de las naves
        navesEnemigas[i] += direccion
    }

    draw();

    if (squares[disparoindex].classList.contains("enemigo")) { //Si tocan a la nave pierde
        document.getElementById('gameOverTitle').style.visibility = 'visible';
        clearInterval(enemigosId)
        gameOver = true;
        guardarPuntajeFinal();
        const botonVolver = document.querySelector('.botonVolver');
        botonVolver.style.display = 'block';
        botonVolver.addEventListener('click', function () {
        window.location.href = '../index.html';
        }
    );
}

    const ultimaFila = boardtamaño * (boardtamaño - 1);  //Si las naves llegan al final, pierde
    if (navesEnemigas.some(index => index >= ultimaFila)) {
        const resultDisplay = document.getElementById('resultDisplay');
        resultDisplay.innerHTML = '<span class="perdisteTitulo">PERDISTE</span>';
        clearInterval(enemigosId);
        gameOver = true;
        guardarPuntajeFinal();
        const botonVolver = document.querySelector('.botonVolver');
        botonVolver.style.display = 'block';
        botonVolver.addEventListener('click', function () {
        window.location.href = '../index.html';
        }
    );
}

if (navesEnemigasBorradas.length === navesEnemigas.length) { // Verifica si todas las naves enemigas han sido destruidas
    navesEnemigasBorradas.length = 0; // Reinicia el array de naves enemigas borradas
    resetearEnemigos(); // Restablece las posiciones de las naves enemigas
    }
}


enemigosId = setInterval(moverenemigos, 100) //Mueve a los enemigos cada 100 milisegundos

/**
* Restaura las posiciones de las naves enemigas.
* @function resetearEnemigos
*/
function resetearEnemigos() {
    gameOver=false;
    for (let i = 0; i < navesEnemigas.length; i++) {
        squares[navesEnemigas[i]].classList.remove('enemigo');
    }

    navesEnemigas.length = 0; //Limpia el areglo de naves enemigas

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 5; j++) {
            const index = i * boardtamaño + j;
            navesEnemigas.push(index);
        }
    }

    draw();
    
}

/**
* Dispara a los enemigos desde la nave.
* @function dispara
* @param {Event} e - Evento de teclado.
*/
function dispara(e) { //Funcion dispara a los enemigos desde la nave

    if (gameOver) { //Si pierde o gana, se detiene
        return
    }
    const currentTime = new Date().getTime(); // Obtener el tiempo actual
    if (currentTime - ultimoDisparo >= cooldownDisparo) { // Verificar si ha pasado suficiente tiempo desde el último disparo
        ultimoDisparo = currentTime; // Actualizar el tiempo del último disparo
        let laserId
        let laserindex = disparoindex


let sonidoLaser = new Audio("../Sonidos/sonidoDisparoNave.wav")
let sonidoExplosion = new Audio("../Sonidos/sonidoMuerteEnemigo.wav")

/**
* Mueve el láser disparado por la nave.
* @function moverLaser
*/
function moverLaser() { //La funcion que mueve los lasers

    if (gameOver) { //Si pierde o gana, se detiene
    return
    }
    squares[laserindex].classList.remove('laser')
    laserindex -= boardtamaño
    squares[laserindex].classList.add('laser')
    const naveEnemigaBorrada = navesEnemigas.indexOf(laserindex)
    if (naveEnemigaBorrada !== -1) {
    if (squares[laserindex].classList.contains('enemigo')) {//si toca el laser al enemigo
        squares[laserindex].classList.remove('laser') //se va el laser
        squares[laserindex].classList.remove('enemigo') //se va el enemigo
        squares[laserindex].classList.add('explotar')
        sonidoExplosion.play(); 

    setTimeout(() => squares[laserindex].classList.remove('explotar'), 300)//remueve la explosion despues de 600 milisegundos
    clearInterval(laserId)


    navesEnemigasBorradas.push(naveEnemigaBorrada)
    results++
    resultDisplay.innerHTML = results
    localStorage.setItem('results', results);
    console.log(navesEnemigasBorradas) //Borrar todo una vez q se destruye, enemigos y lasers
            }
        }
    }

        if (e.key === 'ArrowUp') {
            sonidoLaser.play();
            laserId = setInterval(moverLaser, 100) //tiempo de movimiento laser
        }
    }
}
document.addEventListener('keydown', dispara)

/**
* Guarda el puntaje final en localStorage.
* @function guardarPuntajeFinal
*/
function guardarPuntajeFinal() {
    console.log("Guardando puntaje final...");
    localStorage.setItem('puntajeFinal', results);
    guardarPuntaje();
}
/**
* Guarda el puntaje del jugador en localStorage.
* @function guardarPuntaje
*/
function guardarPuntaje() {
    console.log("Guardando puntaje..."); // Mensaje para verificar que se está guardando el puntaje
    let nombre = localStorage.getItem('nombre') || "" // Obtiene el nombre ingresado por el usuario
    let puntaje = parseInt(localStorage.getItem('puntajeFinal')) || 0; // Obtiene el puntaje del juego

    // Buscar el número de jugadores ya registrados
    const numeroJugadores = parseInt(localStorage.getItem('numeroJugadores')) || 0;

    // Agrega el jugador nuevo al localStorage
    localStorage.setItem(`jugador${numeroJugadores + 1}_nombre`, nombre);
    localStorage.setItem(`jugador${numeroJugadores + 1}_puntaje`, puntaje.toString());

    // Actualiza el número de jugadores registrados
    localStorage.setItem("numeroJugadores", numeroJugadores + 1);

}

/**
* Muestra el puntaje de los jugadores en una tabla.
* @function mostrarPuntaje
*/
function mostrarPuntaje() {
    console.log("Mostrando puntaje..."); // Mensaje para verificar que se está mostrando el puntaje
    const tabla = document.querySelector('table'); // Crear tabla
    const tbody = tabla.querySelector('tbody'); // Crear cuerpo de la tabla

    tbody.innerHTML = ''; // Limpiar la tabla

    // Buscar el número de jugadores ya registrados en el localStorage
    const numeroJugadores = parseInt(localStorage.getItem('numeroJugadores')) || 0;

    // Crear el array para almacenar los datos de los jugadores
    const jugadores = [];

    // Recorrer los jugadores registrados en el array
    for (let i = 1; i <= numeroJugadores; i++) {
        // Obtener los datos del jugador
        const nombre = localStorage.getItem(`jugador${i}_nombre`);
        const puntaje = parseInt(localStorage.getItem(`jugador${i}_puntaje`));

        // Agregar los datos del jugador al array
        jugadores.push({ nombre, puntaje });
    }

    // Ordenar los jugadores por puntaje
    jugadores.sort((a, b) => b.puntaje - a.puntaje);

    // Mostrar los primeros 5 jugadores en la tabla
    for (let i = 0; i < 5; i++) {
        if (i >= jugadores.length) {
            break;
        }
        const { nombre, puntaje } = jugadores[i];

        // Crear una fila en la tabla
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${nombre}</td>
            <td>${puntaje}</td>
        `;

        // Agregar la fila a la tabla
        tbody.appendChild(fila);
    }
}

//Función para austar el BoardSize
function adjustBoardSize() {
    const board = document.querySelector('.board');
    const squares = Array.from(board.querySelectorAll('div'));
    const boardWidth = board.clientWidth;
    const squareSize = boardWidth / 15;

    squares.forEach(square => {
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
    });

    const lasers = Array.from(document.querySelectorAll('.laser'));
    lasers.forEach(laser => {
        laser.style.width = `${squareSize}px`;
        laser.style.height = `${squareSize}px`;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const naveSeleccionada = localStorage.getItem('naveSeleccionada');
    if (naveSeleccionada) {
        configurarJuego(naveSeleccionada);
    }
    adjustBoardSize();
});

window.addEventListener('resize', adjustBoardSize);


//Botones de control para celulares:

document.getElementById('btn-izquierda').addEventListener('click', () => {
    if (!gameOver && disparoindex % boardtamaño !== 0) {
        squares[disparoindex].classList.remove('disparador', `disparador-nave${naveSeleccionada.charAt(naveSeleccionada.length - 1)}`);
        disparoindex -= 1;
        squares[disparoindex].classList.add('disparador', `disparador-nave${naveSeleccionada.charAt(naveSeleccionada.length - 1)}`);
    }
});

document.getElementById('btn-derecha').addEventListener('click', () => {
    if (!gameOver && disparoindex % boardtamaño < boardtamaño - 1) {
        squares[disparoindex].classList.remove('disparador', `disparador-nave${naveSeleccionada.charAt(naveSeleccionada.length - 1)}`);
        disparoindex += 1;
        squares[disparoindex].classList.add('disparador', `disparador-nave${naveSeleccionada.charAt(naveSeleccionada.length - 1)}`);
    }
});

document.getElementById('btn-disparar').addEventListener('click', (e) => {
    dispara({ key: 'ArrowUp' });
});

document.addEventListener('DOMContentLoaded', function () {
    const naveSeleccionada = localStorage.getItem('naveSeleccionada');
    if (naveSeleccionada) {
        configurarJuego(naveSeleccionada);
    }
    adjustBoardSize();

    
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        document.querySelector('.controles-moviles').style.display = 'block';
    }
});

window.addEventListener('resize', adjustBoardSize);
