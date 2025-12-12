
document.addEventListener('DOMContentLoaded', function () {
    // Crear el botón
    const button = document.createElement('button');
    button.innerHTML = '&#x21E6; Inicio'; // Flecha hacia la izquierda (Unicode) + texto

    // Estilos del botón
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.padding = '8px 18px'; // Ajustado el tamaño del botón
    button.style.backgroundColor = 'var(--secondary-color)'; // Fondo verde medio
    button.style.color = 'var(--white)'; // Texto blanco
    button.style.border = '2px solid var(--white)'; // Borde blanco para resaltar
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    button.style.fontSize = '16px'; // Tamaño de fuente adecuado
    button.style.transition = 'background-color 0.3s, transform 0.3s'; // Transición suave en el hover

    // Hover para el botón
    button.addEventListener('mouseover', function() {
        button.style.backgroundColor = 'var(--secondary-color)'; // Cambio de color al pasar el mouse
        button.style.transform = 'scale(1.1)'; // Efecto de agrandamiento
    });

    button.addEventListener('mouseout', function() {
        button.style.backgroundColor = 'var(--secondary-color)'; // Vuelve al color original
        button.style.transform = 'scale(1)'; // Vuelve al tamaño original
    });

    // Funcionalidad del botón
    button.addEventListener('click', function () {
        window.location.href = 'http://127.0.0.1:8000/'; // Redirige a la página principal
         //'https://devsupweb.pythonanywhere.com/'
    });

    // Añadir el botón al DOM
    document.body.appendChild(button);
});

document.addEventListener('DOMContentLoaded', function() {
    var checkbox = document.getElementById('id_estadoUsuario');  // Obtén el checkbox por su id

    checkbox.addEventListener('change', function(event) {
        // Verificar si el checkbox está marcado antes de mostrar la alerta
        if (!checkbox.checked) {
            // Mostrar la alerta clásica de confirmación cuando se cambie el estado
            var confirmSuspension = window.confirm("¿Estás seguro de suspender a este usuario?");
            
            if (!confirmSuspension) {
                // Si el usuario cancela, revertir el estado del checkbox
                checkbox.checked = !checkbox.checked;
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Crear el botón de "Cancelar"
    var button = document.createElement("button");
    button.textContent = "Cancelar";
    button.className = "btn btn-cancel form-control"; // Se añade la clase form-control para asegurar que tenga el mismo tamaño

    // Añadir el botón al contenedor deseado
    var actionContainer = document.querySelector("#jazzy-actions");
    if (actionContainer) {
        var div = document.createElement("div");
        div.className = "form-group";
        div.appendChild(button);
        actionContainer.appendChild(div);
    }

    // Función para resetear el formulario y redirigir
    button.addEventListener("click", function(event) {
        event.preventDefault();  // Prevenir el comportamiento predeterminado del botón (por ejemplo, enviar el formulario)

        // Resetear el formulario
        var form = document.querySelector('form');
        if (form) {
            form.reset();  // Resetea todos los campos del formulario
        }

        // Redirigir a la página de lista de usuarios
        window.history.back();  // Regresa a la página anterior en el historial del navegador
    });
});

// Identificar por el texto contenido
document.querySelectorAll('th').forEach(th => {
    if (th.textContent.trim() === 'EstadoUsuario') {
        th.textContent = 'Activo/Inactivo';
        th.style.color = 'black';  // Cambia el color del texto a negro
    }
});














document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.querySelector('input[type="file"][name="logo"]'); // Selector del input
    const linkElement = document.querySelector('.file-upload a'); // Selector del enlace actual
    let currentPreview = null; // Variable para la vista previa actual

    // Crea un elemento de imagen para previsualización y configúralo
    const previewImage = document.createElement("img");
    previewImage.style.maxHeight = "100px";
    previewImage.style.marginTop = "10px";
    previewImage.style.display = "block";

    // Mostrar la imagen actual de la base de datos si existe
    if (linkElement) {
        previewImage.src = linkElement.href; // Usa el enlace como fuente
        linkElement.parentElement.appendChild(previewImage); // Inserta la imagen debajo del enlace
        currentPreview = previewImage; // Guarda la referencia a la vista previa actual
    }

    // Escuchar cambios en el input de archivo
    if (fileInput) {
        fileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    // Reemplaza la fuente de la vista previa actual con la nueva imagen seleccionada
                    previewImage.src = e.target.result;
                    if (!currentPreview) {
                        // Si no hay vista previa actual, agrega la nueva al DOM
                        linkElement.parentElement.appendChild(previewImage);
                        currentPreview = previewImage;
                    }
                };
                reader.readAsDataURL(file);
            } else {
                // Si no hay archivo seleccionado, vuelve a mostrar la imagen actual de la base de datos
                if (linkElement) {
                    previewImage.src = linkElement.href;
                } else {
                    previewImage.style.display = "none"; // Oculta la previsualización si no hay imagen
                }
            }
        });
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.querySelector('input[type="file"][name="form-0-logo"]'); // Selector del input
    const linkElement = document.querySelector('.file-upload a'); // Selector del enlace actual
    let currentPreview = document.querySelector('.file-upload img'); // Selector de la imagen inicial

    // Escuchar cambios en el input de archivo
    if (fileInput) {
        fileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    // Reemplaza la fuente de la imagen actual con la nueva previsualización
                    currentPreview.src = e.target.result;
                    currentPreview.style.display = "block"; // Asegurarse de que esté visible
                };
                reader.readAsDataURL(file);
            } else {
                // Si no hay archivo seleccionado, vuelve a mostrar la imagen actual de la base de datos
                if (linkElement) {
                    currentPreview.src = linkElement.href; // Volver al enlace original
                } else {
                    currentPreview.style.display = "none"; // Oculta la previsualización si no hay imagen
                }
            }
        });
    }
});




/*Dando color al boton SUBIR archivo en el admin*/
// Referencia al input
const fileInput = document.getElementById('id_form-0-logo');

// Crear un botón personalizado
const customButton = document.createElement('button');
customButton.id = 'customFileButton';
customButton.textContent = 'Seleccionar archivo';

// Insertar el botón antes del input
fileInput.parentNode.insertBefore(customButton, fileInput);

// Mostrar el nombre del archivo
const fileNameDisplay = document.createElement('div');
fileNameDisplay.id = 'fileNameDisplay';
fileNameDisplay.textContent = 'Ningún archivo seleccionado';
fileInput.parentNode.insertBefore(fileNameDisplay, fileInput.nextSibling);

// Manejar el clic en el botón para abrir el cuadro de diálogo de selección de archivos
customButton.addEventListener('click', (e) => {
  e.preventDefault(); // Evita recargar la página si el botón es un botón normal
  fileInput.click();
});

// Actualizar el texto al seleccionar un archivo
fileInput.addEventListener('change', () => {
  const fileName = fileInput.files.length ? fileInput.files[0].name : 'Ningún archivo seleccionado';
  fileNameDisplay.textContent = fileName;
});


