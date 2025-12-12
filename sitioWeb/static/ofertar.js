(function () {
    'use strict';
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation');
    
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {

            // Validar los archivos antes de la validación del formulario
            if (!validarArchivos() || !form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                // Mostrar alerta con SweetAlert si faltan campos
                Swal.fire({
                    icon: 'error',
                    title: 'Formulario incompleto',
                    text: 'Por favor, completa todos los campos requeridos con datos validos y selecciona archivos válidos antes de ofertar.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#02735E' // Color verde
                });
            }

            // Agregar la clase de validación de Bootstrap
            form.classList.add('was-validated');

            // Si el formulario es válido, manejar el envío
            if (form.checkValidity()) {
                validarFormulario(event);
            }
        }, false);
    });
})();

// Módulo de validación y manejo de archivos
const validarArchivos = () => {
    const archivoInput = document.getElementById('archivo');
    const fileNameDisplay = document.getElementById('file-name');
    const previewContainer = document.getElementById('preview-container');

    if (!archivoInput) return false;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxFileSize = 2 * 1024 * 1024; // 2 MB en bytes
    const maxFiles = 8; // Máximo de archivos permitidos
    const validFiles = [];
    const removedFiles = [];

    // Si se excede el número máximo de archivos
    if (archivoInput.files.length > maxFiles) {
        // Convertimos los archivos a un array y tomamos solo los primeros 8 archivos
        const selectedFiles = Array.from(archivoInput.files).slice(0, maxFiles);

        // Creamos un DataTransfer para asignar los archivos permitidos de nuevo al input
        const dataTransfer = new DataTransfer();
        selectedFiles.forEach(file => dataTransfer.items.add(file));
        archivoInput.files = dataTransfer.files;

        // Alerta de que se eliminaron archivos adicionales
        Swal.fire({
            icon: 'warning',
            title: 'Límite de archivos',
            text: `Solo se permiten ${maxFiles} archivos. Los archivos adicionales han sido eliminados automáticamente.`
        });
    }

    // Limpiar cualquier vista previa anterior
    previewContainer.innerHTML = "";

    // Filtrar archivos válidos y acumular los que se eliminarán
    Array.from(archivoInput.files).forEach(file => {
        const isValidType = validTypes.includes(file.type);
        const isValidSize = file.size <= maxFileSize;

        if (!isValidType || !isValidSize) {
            removedFiles.push(file.name); // Archivo no válido
        } else {
            validFiles.push(file);

            // Crear una miniatura para cada imagen válida
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                previewContainer.appendChild(img); // Añadir la miniatura al contenedor
            };
            reader.readAsDataURL(file);
        }
    });

    // Alerta de archivos eliminados por no ser válidos en formato o tamaño
    if (removedFiles.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Archivos eliminados',
            text: `Algunos archivos fueron eliminados por no cumplir con el formato o tamaño permitido: ${removedFiles.join(', ')}`,
            footer: '<label>Solo se aceptan 8 archivos en formato [.jpg, .jpeg, .png] de peso máximo 2MB</label>'
        });
    }

    // Mostrar nombres de archivos seleccionados en el elemento <span>
    if (validFiles.length > 0) {
        fileNameDisplay.textContent = `Archivos seleccionados: ${validFiles.map(file => file.name).join(', ')}`;
        fileNameDisplay.style.color = 'black'; // Cambiar el color a negro si hay archivos válidos
    } else {
        fileNameDisplay.textContent = "Debe seleccionar al menos una foto para su publicación";
        fileNameDisplay.style.color = 'red'; // Cambiar el color a rojo si no hay archivos válidos
    }
    return validFiles.length > 0; // Retorna true si hay archivos válidos
};

// Módulo de validación del formulario y tardanza del envío del Form
const validarFormulario = (event) => {
    event.preventDefault(); // Prevenir el envío del formulario
    // Si todo está completo, mostrar la alerta de éxito y retrasar el envío del formulario
    Swal.fire({
        title: '¡Tu oferta fue publicada correctamente!',
        //text: 'Tus cambios fueron guardados correctamente.',
        icon: 'success',
        showConfirmButton: false, // Quita el botón de "Aceptar"
      //  timer: 1250, // La alerta se cierra automáticamente después de 1.5 segundos
       // timerProgressBar: true
    });

    setTimeout(() => {
        event.target.submit(); // Enviar el formulario después del tiempo de la alerta
    }, 1750);
};


// Módulo de inicialización de eventos
const inicializarEventos = () => {
    
    //Añadir reporte de JS al apretar el boton Cancelar
    document.getElementById('button-cancelar').addEventListener('click', function() {
        Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Los datos ingresados NO se guardaran!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#666666",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar"
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
            title: "¡Oferta eliminada!",
            text: "Tu publicacion ha sido eliminado correctamente",
            icon: "success",
            confirmButtonColor: "#03A678"
        }).then(() => {
            // Redireccionar a la página home.html
            window.location.href = '/';
        });   
        }
        });
    });       
 
    // Asociar la validación de archivos al cambio del input de archivos
    document.getElementById('archivo').addEventListener('change', validarArchivos);
    // Asociar el cambio del departamento para actualizar las provincias
    document.getElementById('departamento').addEventListener('change', function() {
        const provinciaSelect = document.getElementById('provincia');
        provinciaSelect.innerHTML = '<option value="" disabled selected>Seleccionar Provincia</option>';

        const provincias = JSON.parse(this.options[this.selectedIndex].getAttribute('data-provincias'));

        provincias.forEach(function(provincia) {
            const option = document.createElement('option');
            option.value = provincia;
            option.textContent = provincia;
            provinciaSelect.appendChild(option);
        });
    });   
};

// Inicializar eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', inicializarEventos);