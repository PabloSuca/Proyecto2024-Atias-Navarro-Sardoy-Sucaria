const board = document.querySelector('.board')
const boardtamaño = 24
const navesEnemigasBorradas=[]
let disparoindex =202


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

//La nave que dispara:

squares[disparoindex].classList.add('disparador') //Hasta que unifiquemos con la imagen del las 3 naves

function moverdisparador(e){  //Funcion para mover la nave, falta avanzarla
    squares[disparoindex].classList.remove('disparador')
    switch(e.key){
        case 'ArrowLeft':   
    }
}



