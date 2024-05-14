const board = document.querySelector('.board')
const resultDisplay = document.querySelector('.results')
const boardtamaño = 15  
const navesEnemigasBorradas=[]
const cooldownDisparo=200; //milisegundos
let disparoindex = 187
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

let navesEnemigas= [
    0,1,2,3,
    15,16,17,18,
    30,31,32,33,
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

document.addEventListener('DOMContentLoaded', function() {
    // Verifica si hay una selección de nave en localStorage
    const naveSeleccionada = localStorage.getItem('naveSeleccionada');
    if (naveSeleccionada) {
        // Utiliza la selección de la nave para configurar el juego
        configurarJuego(naveSeleccionada);
            } 
        }
    );
//REVISAR ESTA FUNCION
    function generarOleadaEnemigos() {
        navesEnemigas = [];
        navesEnemigasBorradas.length = 0;
        for (let i = 0; i < boardtamaño; i++) {
            for (let j = 0; j < boardtamaño; j++) {
                if (i % 2 === 0 && j % 2 === 0) {
                    const index = i * boardtamaño + j;
                    navesEnemigas.push(index);
                    }
                }
            }
        draw();
        }
        
    


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
    squares[disparoindex].classList.remove('disparador', `disparador-nave${naveSeleccionada.charAt(naveSeleccionada.length-1)}`) //que cuando se mueva la nave, se vaya borrando lo anterior
    switch(e.key){
        case 'ArrowLeft':
            if(disparoindex % boardtamaño !==0) disparoindex -=1 //para que no se mueva mas a la izquierda del borde
            break
        case 'ArrowRight':
            if (disparoindex % boardtamaño < boardtamaño - 1)disparoindex +=1 //para que no se mueva a la derecha del borde, sino que vaya volviendo izq
            break
    }
    squares[disparoindex].classList.add('disparador', `disparador-nave${naveSeleccionada.charAt(naveSeleccionada.length-1)}`)
}

document.addEventListener('keydown', moverdisparador)



//REVISAR ESTA FUNCION
function moverenemigos(){ //funcion que maneja el movimiento de los enemigos

    if(gameOver){ //si pierde o gana, se detiene
    return
    }
    const leftEdge = navesEnemigas[0] % boardtamaño === 0 //bordes enemigos izq
    const rightEdge = navesEnemigas[navesEnemigas.length - 1] % boardtamaño === boardtamaño - 1 //bordes enemigos der, que no se muevan a la derecha del borde
    remove();
    if (navesEnemigas.filter(index => navesEnemigasBorradas.includes(index)).length === navesEnemigas.length) {
    generarOleadaEnemigos();
}

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
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.innerHTML = '<span class="perdisteTitulo">PERDISTE</span>';
    clearInterval(enemigosId)
    gameOver = true
    const botonVolver = document.querySelector('.botonVolver');
    botonVolver.style.display = 'block';
    botonVolver.addEventListener('click', function() {
    window.location.href = 'index.html';
                }
            );
        }

const ultimaFila = boardtamaño * (boardtamaño - 1);  //si las naves llegan al final, pierde
    if (navesEnemigas.some(index => index >= ultimaFila)) {
    const resultDisplay = document.getElementById('resultDisplay');
    resultDisplay.innerHTML = '<span class="perdisteTitulo">PERDISTE</span>';
    clearInterval(enemigosId)
    gameOver = true
    const botonVolver = document.querySelector('.botonVolver');
    botonVolver.style.display = 'block';
    botonVolver.addEventListener('click', function() {
    window.location.href = 'index.html';
                }
            );
        }
    }
enemigosId = setInterval(moverenemigos, 200) //muevo a los enemigos cada 300 milisegundos

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
    return}
    squares[laserindex].classList.remove('laser')
    laserindex -= boardtamaño
    squares[laserindex].classList.add('laser')

    if(squares[laserindex].classList.contains('enemigo')){//si toca el laser al enemigo
    squares[laserindex].classList.remove('laser') //se va el laser
    squares[laserindex].classList.remove('enemigo') //se va el enemigo
    squares[laserindex].classList.add('explotar') 

    setTimeout (() => squares[laserindex].classList.remove('explotar'), 600)//remueve la explosion despues de 600 milisegundos
    clearInterval(laserId) 

    const naveEnemigaBorrada = navesEnemigas.indexOf(laserindex)
    navesEnemigasBorradas.push(naveEnemigaBorrada)
    results++
    resultDisplay.innerHTML = results
    console.log(navesEnemigasBorradas) //borrar todo una vez q se destruye, enemigos y lasers
    }
    }
    if (e.key === 'ArrowUp'){
    laserId = setInterval(moverLaser, 100) //tiempo de movimiento laser
            }
        }
    }

document.addEventListener('keydown', dispara)



