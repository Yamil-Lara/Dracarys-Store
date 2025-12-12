// JavaScript para abrir la ventana de selección de archivos
document.getElementById('editar-imagen').addEventListener('click', function() {
    document.getElementById('imagenPerfil').click(); // Simula el clic en el input de archivo
    
});


// Opcional: Mostrar una vista previa de la imagen seleccionada
document.getElementById('imagenPerfil').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Obtiene el archivo seleccionado
    if (file&& (file.type === 'image/png' || file.type === 'image/jpeg')) {
        const reader = new FileReader(); // Crea una única instancia de FileReader
        reader.onload = function(e) {
            const preview = document.getElementById('preview');
            const previewed = document.getElementById('previewed');

            if (preview && previewed) {
                preview.src = e.target.result; // Asigna el resultado a la primera imagen
                previewed.src = e.target.result; // Asigna el resultado a la segunda imagen
                
                // Asegúrate de que las imágenes sean visibles
                preview.style.display = 'block';
                previewed.style.display = 'block';
            }
        };
        reader.readAsDataURL(file); // Lee el archivo como una URL de datos
        alert("Imagen seleccionada. ¡No te olvides guardar los cambios!");
        const saveButton = document.querySelector('.save-imagen');
        saveButton.style.display = 'flex';  // Muestra el botón como flexbox para centrar el texto
        saveButton.style.justifyContent = 'center';  // Centra el texto horizontalmente
        saveButton.style.alignItems = 'center';  // Centra el texto verticalmentee
        
    }else {
        alert("Por favor selecciona una imagen en formato PNG o JPG.");
        event.target.value = ""; // Limpia el input si el archivo no es válido
    }  
});
//------------modal nombre-------------

let valorOriginalNombre;
let valorOriginalCorreo;
let valorOriginalCelular;

// Función para validar el nombre
function esNombreValido(nombre) {
    // Expresión regular que permite letras mayúsculas, minúsculas y espacios
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(nombre);
}

// Abrir el modal y guardar el valor original del nombre
document.getElementById('editar-nombre').addEventListener('click', function() {
    valorOriginalNombre = document.getElementById('name').value;
    document.getElementById('input-editar-nombre').value = valorOriginalNombre;
    document.getElementById('modal-editar-nombre').style.display = 'flex';
});

// Cerrar el modal para nombre
document.getElementById('cancelar-nombre').addEventListener('click', function() {
    document.getElementById('modal-editar-nombre').style.display = 'none';
});

// Validar en tiempo real que solo se permitan letras y espacios en el input del nombre
document.getElementById('input-editar-nombre').addEventListener('input', function(event) {
    const input = event.target;
    const soloLetrasYEspacios = input.value.replace(/[^A-Za-z\s]/g, ''); // Eliminar cualquier carácter que no sea letra o espacio
    input.value = soloLetrasYEspacios;
});

// Guardar nombre
document.getElementById('guardar-nombre').addEventListener('click', function() {
    const nuevoNombre = document.getElementById('input-editar-nombre').value;
    if (esNombreValido(nuevoNombre)) {
        document.getElementById('name').value = nuevoNombre;
        document.getElementById('modal-editar-nombre').style.display = 'none';
        document.getElementById('modal-final').style.display = 'flex';
    } else {
        alert("El nombre solo puede contener letras y espacios.");
    }
});

// Repite lo mismo para el correo------------
// Función para validar el correo electrónico
function esCorreoValido(correo) {
    // Expresión regular para validar que el correo termine en @gmail.com
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(correo);
}

// Función para ajustar el tamaño de la fuente en un input
// Función para ajustar el tamaño de la fuente de un input
function ajustarTamañoFuente(input) {
    const longitudTexto = input.value.length;

    // Establecer un tamaño máximo y mínimo de fuente
    const tamañoFuenteMax = 20; // Tamaño máximo de la fuente
    const tamañoFuenteMin = 10; // Tamaño mínimo de la fuente

    // Ajustar el tamaño de la fuente de acuerdo con la longitud del texto
    let nuevoTamañoFuente = tamañoFuenteMax - (longitudTexto / 3); // Calculamos el tamaño en función de la longitud

    // Asegurarse de que el tamaño de la fuente no sea menor que el mínimo
    if (nuevoTamañoFuente < tamañoFuenteMin) {
        nuevoTamañoFuente = tamañoFuenteMin;
    }

    // Establecer el nuevo tamaño de fuente
    input.style.fontSize = `${nuevoTamañoFuente}px`;

    // Retornar el tamaño ajustado para usarlo en otro input si es necesario
    return nuevoTamañoFuente;
}

// Aplicar ajuste de tamaño al escribir en el input de correo
document.getElementById('input-editar-correo').addEventListener('input', function(event) {
    ajustarTamañoFuente(event.target); // Ajusta el tamaño de la fuente en el input de edición
});

// Mostrar el modal de edición de correo
document.getElementById('editar-correo').addEventListener('click', function() {
    const inputEmail = document.getElementById('email');
    const inputCorreo = document.getElementById('input-editar-correo');

    // Copiar el valor y estilo de fuente del input principal al de edición
    inputCorreo.value = inputEmail.value;

    // Copiar todas las propiedades de estilo del input "email" al input "input-editar-correo"
    inputCorreo.style.fontSize = inputEmail.style.fontSize;
    inputCorreo.style.lineHeight = inputEmail.style.lineHeight;
    inputCorreo.style.padding = inputEmail.style.padding;

    // Aplicar el ajuste de tamaño también en el input "email" para que refleje el cambio
    ajustarTamañoFuente(inputEmail); // Este paso asegura que el tamaño de fuente en #email se ajuste al escribir

    document.getElementById('modal-editar-correo').style.display = 'flex';
});

// Cerrar el modal para correo
document.getElementById('cancelar-correo').addEventListener('click', function() {
    document.getElementById('modal-editar-correo').style.display = 'none';
});

// Guardar correo
document.getElementById('guardar-correo').addEventListener('click', function() {
    const inputCorreo = document.getElementById('input-editar-correo');
    const inputEmail = document.getElementById('email');
    const nuevoCorreo = inputCorreo.value;

    if (esCorreoValido(nuevoCorreo)) {
        // Actualizar el valor del input "email"
        inputEmail.value = nuevoCorreo;

        // Asegurarse de que el tamaño de fuente, line-height y padding se copien correctamente
        inputEmail.style.fontSize = inputCorreo.style.fontSize;
        inputEmail.style.lineHeight = inputCorreo.style.lineHeight;
        inputEmail.style.padding = inputCorreo.style.padding;

        // Aplicar ajuste de tamaño también en el input "email" para que refleje el cambio
        ajustarTamañoFuente(inputEmail); // Este paso ajusta el tamaño de fuente en #email según el texto guardado

        document.getElementById('modal-editar-correo').style.display = 'none';
        document.getElementById('modal-final').style.display = 'flex';
    } else {
        alert("El correo electrónico debe ser de Gmail y seguir el formato xxxx@gmail.com.");
    }
});

// Lo mismo para el celular--------------
function esCelularValido(celular) {
    // Comprobar si el celular es un número y tiene exactamente 8 dígitos
    const regex = /^[0-9]{8}$/;
    return regex.test(celular);
}
document.getElementById('editar-celular').addEventListener('click', function() {
    valorOriginalCelular = document.getElementById('celular').value;
    document.getElementById('input-editar-celular').value = valorOriginalCelular;
    document.getElementById('modal-editar-celular').style.display = 'flex';
});

// Validar en tiempo real que solo se permitan números y no más de 8 caracteres
document.getElementById('input-editar-celular').addEventListener('input', function(event) {
    const input = event.target;
    let soloNumeros = input.value.replace(/[^0-9]/g, ''); // Eliminar cualquier carácter que no sea un número

    if (soloNumeros.length > 8) {
        soloNumeros = soloNumeros.slice(0, 8); // Limitar a 8 caracteres
    }

    input.value = soloNumeros;
});

// Cerrar el modal para celular
document.getElementById('cancelar-celular').addEventListener('click', function() {
    document.getElementById('modal-editar-celular').style.display = 'none';
});

// Guardar celular
document.getElementById('guardar-celular').addEventListener('click', function() {
    const nuevoCelular = document.getElementById('input-editar-celular').value;
    if (esCelularValido(nuevoCelular)) {
        document.getElementById('celular').value = nuevoCelular;
        document.getElementById('modal-editar-celular').style.display = 'none';
        document.getElementById('modal-final').style.display = 'flex';
    } else {
        alert("El número de celular debe contener exactamente 8 dígitos numéricos y no puede ser negativo.");
    }
});
//-----------fin modal

document.getElementById('input-editar-nombre').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('guardar-nombre').click();
    }
});

document.getElementById('input-editar-correo').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('guardar-correo').click();
    }
});

document.getElementById('input-editar-celular').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('guardar-celular').click();
    }
});

//------------------------------------------------------------------------BILLETERA----------------------------------------------------------------------
// Función para mostrar y ocultar el saldo
// Función para mostrar y ocultar el saldo con cambio de imagen y texto
function toggleSaldo() {
    const saldo = document.getElementById('saldo');
    const toggleButton = document.getElementById('toggle-saldo');

    // Cambiar la visibilidad del saldo
    saldo.classList.toggle('oculto');

    // Cambiar el texto y el icono dependiendo del estado
    if (saldo.classList.contains('oculto')) {
        // Si está oculto, mostrar "Mostrar" y el icono de ojo cerrado
        toggleButton.innerHTML = '👁️‍🗨️ Mostrar';  // Icono de ojo cerrado con texto "Mostrar"
    } else {
        // Si está visible, mostrar "Ocultar" y el icono de ojo abierto
        toggleButton.innerHTML = '👁️ Ocultar';  // Icono de ojo abierto con texto "Ocultar"
    }
}


// Función para activar el campo de entrada correspondiente
function activarInput(inputId) {
    const depositoInput = document.getElementById('deposito-input');
    const retiroInput = document.getElementById('retiro-input');

    // Ocultar ambos formularios y luego mostrar el seleccionado
    depositoInput.style.display = 'none';
    retiroInput.style.display = 'none';

    document.getElementById(inputId).style.display = 'flex';
}
