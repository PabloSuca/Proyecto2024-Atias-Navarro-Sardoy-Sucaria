// Cuando el usuario ingresa su nombre en el formulario
const nombreInput = document.getElementById('nombre'); // Suponiendo que tu input tiene el id "nombre"
const nombre = nombreInput.value;
localStorage.setItem('nombre', nombre);

// Cuando se actualizan los resultados del juego
localStorage.setItem('results', results);