window.onload = function() {
    document.getElementById('miFormulario').addEventListener('submit', function(event) {
        event.preventDefault();
        var nombre = document.getElementById('nombre').value;
        var errorNombre = document.getElementById('error-nombre');
        if (nombre.trim() == "") {
            errorNombre.textContent = "El campo nombre no puede estar vacío.";
            errorNombre.classList.add("mostrar");
            setTimeout(function() {
                errorNombre.textContent = "";
                errorNombre.classList.remove("mostrar");
            }, 3000); // 3000 milisegundos = 3 segundos
        } else {
            errorNombre.textContent = "";
            errorNombre.classList.remove("mostrar");
        }
    });
} 