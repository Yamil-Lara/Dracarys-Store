// Habilitar los campos para editar el producto
document.getElementById('editar-producto').addEventListener('click', function() {
    // Verificar si el botón está siendo clickeado correctamente
    console.log('Edit button clicked!');

    // Habilitar inputs, textareas y selects
    document.querySelectorAll('#producto-formulario input, #producto-formulario textarea, #producto-formulario select').forEach(input => {
        console.log('Habilitando campo:', input.name); // Verificar cada campo que está siendo habilitado
        input.disabled = false;
    });
    // Mostrar el label de "nuevas-imagenes" y habilitar el input correspondiente
    document.querySelector('label[for="nuevas-imagenes"]').hidden = false;
    // Mostrar el label de "nuevas-imagenes" y habilitar el input correspondiente
    document.querySelector('button[for="borrar-imagenes"]').hidden = false;

    // Habilitar todos los checkboxes de "imagenes_a_eliminar"
    const checkboxes = document.querySelectorAll('input[name="imagenes_a_eliminar"]');

    checkboxes.forEach((checkbox) => {
        checkbox.disabled = false; // Habilitar todos los checkboxes
        checkbox.hidden = false; // Asegurarse de que no estén ocultos
    });

    // Mostrar el botón de guardar y cancelar
    document.getElementById('boton-guardar-producto').style.display = 'inline-block'; 
    document.getElementById('boton-cancelar-producto').style.display = 'inline-block'; 
    console.log('Botón Guardar mostrado.');
    console.log('Botón Cancelar mostrado.');
    // Ocultar el botón de editar
    this.style.display = 'none';

    // ocultar el botón de eliminar
    document.getElementById("eliminar-producto").hidden = true; // Corrección aquí
});
//--------------------------------------------------------------------------------------
//Controla que el precio no se baje con scroll
document.addEventListener('DOMContentLoaded', function() {
    // Desactivar el scroll en el campo precio
    document.getElementById('precio-producto').addEventListener('wheel', function(e) {
        e.preventDefault(); // Esto evita que el scroll cambie el valor
    });
});

function manejarRestriccionesDeImagenes() {
    const inputImagenes = document.getElementById('nuevas-imagenes');
    const previewContainer = document.querySelector('#imagenes-producto ul');
    const mensajeImagenesLabel = document.getElementById('mensaje-imagenes-seleccionadas');
    const maxFiles = 8;
    const maxFileSize = 2 * 1024 * 1024;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    // Crear un DataTransfer para almacenar todas las imágenes válidas
    const dataTransfer = new DataTransfer();

    if (!inputImagenes) return;

    inputImagenes.addEventListener('change', () => {
        // Contar imágenes ya presentes en el contenedor de previsualización
        const existingImages = previewContainer.querySelectorAll('li img').length;
        let remainingSlots = maxFiles - existingImages;

        // Obtener archivos del input y filtrar para validar tipo y tamaño
        const files = Array.from(inputImagenes.files);
        const removedFiles = [];
        const nombresDeArchivos = [];

        // Filtrar y mostrar las nuevas imágenes
        files.forEach(file => {
            const isValidType = validTypes.includes(file.type);
            const isValidSize = file.size <= maxFileSize;

            // Si el archivo es válido y hay espacio, agregarlo
            if (isValidType && isValidSize && remainingSlots > 0) {
                dataTransfer.items.add(file); // Agregar al DataTransfer acumulado
                nombresDeArchivos.push(file.name);

                const reader = new FileReader();
                reader.onload = function (e) {
                    const li = document.createElement('li');
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = "Vista previa de imagen";
                    li.appendChild(img);
                    previewContainer.appendChild(li);
                };
                reader.readAsDataURL(file);

                remainingSlots--; // Reducir el número de espacios restantes
            } else if (remainingSlots <= 0) {
                // Mostrar una advertencia cuando se alcanza el límite
                Swal.fire({
                    icon: 'warning',
                    title: 'Límite de archivos',
                    text: `Ya has alcanzado el límite de ${maxFiles} imágenes.`
                });
            } else {
                // Si el archivo es inválido por tipo o tamaño, agregar a la lista de eliminados
                removedFiles.push(file.name);
            }
        });

        // Mostrar mensaje de selección de imágenes
        if (nombresDeArchivos.length > 0) {
            mensajeImagenesLabel.style.display = "block";
            mensajeImagenesLabel.innerHTML = `Se subirán las siguientes imágenes: ${nombresDeArchivos.map(nombre => `<em>${nombre}</em>`).join(', ')}`;
        } else {
            mensajeImagenesLabel.style.display = "none";
        }

        // Mostrar mensaje de advertencia para archivos eliminados
        if (removedFiles.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Archivos no válidos',
                text: `Se eliminaron algunos archivos no válidos por formato o tamaño: ${removedFiles.join(', ')}`,
                footer: 'Solo se aceptan archivos .jpg, .jpeg, .png de máximo 2 MB.'
            });
        }

        // Asignar el DataTransfer acumulado al input para mantener los archivos válidos seleccionados
        inputImagenes.files = dataTransfer.files;
    });
}

// Llama a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', manejarRestriccionesDeImagenes);

//--------------------------------------------------------------------------------------

// Actualización dinámica de subcategorías según la categoría seleccionada
document.getElementById('categoria-producto').addEventListener('change', function () {
    const categoriaId = this.value;
    console.log('Categoría seleccionada:', categoriaId); // Log para verificar la categoría seleccionada
    fetch(`/subcategorias/${categoriaId}/`)
        .then(response => response.json())
        .then(data => {
            const subcategoriaSelect = document.getElementById('subcategoria-producto');
            subcategoriaSelect.innerHTML = '';
            data.subcategorias.forEach(subcategoria => {
                const option = document.createElement('option');
                option.value = subcategoria.id;
                option.textContent = subcategoria.nombre;
                subcategoriaSelect.appendChild(option);
            });
        });
});

// Actualización dinámica de provincias según el departamento seleccionado
document.getElementById('departamento-producto').addEventListener('change', function () {
    const departamentoId = this.value;
    console.log('Departamento seleccionado:', departamentoId); // Log para verificar el departamento seleccionado
    fetch(`/provincias/${departamentoId}/`)
        .then(response => response.json())
        .then(data => {
            const provinciaSelect = document.getElementById('provincia-producto');
            provinciaSelect.innerHTML = '';
            data.provincias.forEach(provincia => {
                const option = document.createElement('option');
                option.value = provincia.id;
                option.textContent = provincia.nombre;
                provinciaSelect.appendChild(option);
            });
        });
});

// Función para obtener el CSRF token desde las cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let ajaxInProgress = false; // Control para saber si la solicitud AJAX está en progreso

// Funcionalidad del eliminar imágenes seleccionadas
document.getElementById('borrar-imagenes1').addEventListener('click', function(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    // Obtener los IDs de los checkboxes seleccionados
    const selectedImages = Array.from(document.querySelectorAll('input[name="imagenes_a_eliminar"]:checked'))
                                .map(checkbox => checkbox.value);

    if (selectedImages.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecciona al menos 1 imagen',
            text: 'Por favor marca en el cuadrito las imágenes que quieres eliminar',
            confirmButtonText: 'OK',
            confirmButtonColor: '#02735E' // Color verde
        });
        return;
    }

    // Ocultar temporalmente las imágenes seleccionadas (con checkbox tiqueado)
    selectedImages.forEach(id => {
        const liElement = document.querySelector(`input[value="${id}"]`).closest('li');
        if (liElement) {
            liElement.style.display = 'none'; // Oculta el <li> con la imagen
        }
    });

    // Confirmación de eliminación
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Las imágenes seleccionadas se eliminarán permanentemente!",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#666666",
        //cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        //cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Suspender la solicitud AJAX hasta que se haga clic en el botón "Guardar"
            ajaxInProgress = true;

            // Aquí puedes realizar otras acciones si es necesario, o mostrar un mensaje
            Swal.fire({
                icon: 'info',
                title: 'Eliminación pendiente',
                text: 'Las imágenes seleccionadas se eliminarán cuando guardes tus cambios. ¡No olvides guardar!',                
                showConfirmButton: false,
                timer: 1800,
                timerProgressBar: true
            });

        } else {
            // Si el usuario cancela, volver a mostrar las imágenes
            selectedImages.forEach(id => {
                const liElement = document.querySelector(`input[value="${id}"]`).closest('li');
                if (liElement) {
                    liElement.style.display = ''; // Muestra el <li> con la imagen
                }
            });
        }
    });
});

// Al hacer clic en el botón de guardar cambios
document.getElementById('boton-guardar-producto').addEventListener('click', function(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    const formulario = document.getElementById('producto-formulario');
    let yaSeDesplazo = false; // Control de si ya se hizo el scroll

    // Verifica si el formulario es válido según las validaciones HTML
    if (!formulario.checkValidity()) {
        event.preventDefault(); // Evita el envío si el formulario no es válido

        // Desplazar al primer campo inválido
        const campoInvalido = formulario.querySelector(':invalid');
        if (campoInvalido && !yaSeDesplazo) {
            campoInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
            yaSeDesplazo = true;
        }
    } else {
        // Si el formulario es válido, mostrar la alerta de confirmación
        Swal.fire({
            title: '¡Cambios Guardados!',
            text: 'Tus cambios fueron guardados correctamente.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1250,
            timerProgressBar: true
        }).then(() => {
            // Completar la solicitud AJAX solo si el usuario guardó
            if (ajaxInProgress) {
                // Crear el cuerpo de la solicitud con las imágenes a eliminar
                const selectedImages = Array.from(document.querySelectorAll('input[name="imagenes_a_eliminar"]:checked'))
                                            .map(checkbox => checkbox.value);

                const formData = new URLSearchParams();
                selectedImages.forEach(id => formData.append('imagenes_a_eliminar', id));

                // Realizar la solicitud AJAX
                fetch('/eliminar-imagenes/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': getCookie('csrftoken') // Agrega el CSRF token
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Eliminar las imágenes de la interfaz
                        selectedImages.forEach(id => {
                            document.querySelector(`input[value="${id}"]`).closest('li').remove();
                        });
                    } else {
                        Swal.fire("Error", data.message, "error");
                    }
                })
                .catch(error => console.error('Error en la solicitud:', error));
            }
       
            // Luego de la alerta, enviar el formulario manualmente
            formulario.submit(); // Aquí se ejecuta el envío del formulario
        
        });
    }
});

// Escuchar el clic en el botón de cancelar
document.getElementById('boton-cancelar-producto').addEventListener('click', function(event) {
    event.preventDefault(); // Evita que el formulario se restablezca de inmediato

    // Recargar la página después de un retraso
    setTimeout(() => {
        location.reload();
    }, 200);
});

//Alerta al clcikear el boton eliminar
document.getElementById('eliminar-producto').addEventListener('click', function() {
    var url = this.getAttribute('data-url'); // Obtiene la URL del atributo data-url

    // Muestra el SweetAlert de confirmación con colores personalizados
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Estás seguro de que deseas eliminar este producto?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--eliminarColor'),
        cancelButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--cancelarColor'),
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            const confirmButton = Swal.getConfirmButton();
            const cancelButton = Swal.getCancelButton();
            confirmButton.addEventListener('mouseenter', () => confirmButton.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--eliminarHover'));
            confirmButton.addEventListener('mouseleave', () => confirmButton.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--eliminarColor'));
            cancelButton.addEventListener('mouseenter', () => cancelButton.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--cancelarHover'));
            cancelButton.addEventListener('mouseleave', () => cancelButton.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--cancelarColor'));
        },
        preConfirm: () => {
            Swal.getConfirmButton().style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--eliminarActive');
        },
        preDeny: () => {
            Swal.getCancelButton().style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--cancelarActive');
        }
    }).then((result) => {
        if (result.isConfirmed) {
            console.log('Eliminando producto...');
            window.location.href = url; // Redirige a la URL de eliminación
        }
    });
});



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<

// Selecciona el contenedor de imágenes
const contenedorImagenes = document.getElementById('imagenes-producto');

// Función para mostrar la notificación flotante
const mostrarNotificacion = (mensaje) => {
    // Crea el elemento de la notificación
    const notificacion = document.createElement('div');
    notificacion.classList.add('notificacion-flotante');
    notificacion.textContent = mensaje;

    // Añade la notificación al body
    document.body.appendChild(notificacion);

    // Muestra la notificación
    setTimeout(() => {
        notificacion.style.opacity = 1;
    }, 100);

    // Oculta y elimina la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.style.opacity = 0;
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
};

// Función para contar imágenes y controlar el mínimo de 1 imagen
const actualizarConteo = () => {
    const imagenes = contenedorImagenes.querySelectorAll('img');
    const checkboxes = contenedorImagenes.querySelectorAll('input[name="imagenes_a_eliminar"]');

    // Actualiza el conteo de imágenes y muestra la notificación
   // const mensaje = `Cantidad de imágenes: ${imagenes.length}`;
   // mostrarNotificacion(mensaje);

    // Desactiva los checkboxes si solo queda una imagen
    if (imagenes.length <= 1) {
        checkboxes.forEach(checkbox => {
            checkbox.disabled = true;
        });
    } else {
        checkboxes.forEach(checkbox => {
            checkbox.disabled = false;
        });
    }

    // Llama a la función que verifica la selección de los checkboxes
    verificarSeleccionCheckboxes();
};

// Función para verificar que no se seleccionen todos los checkboxes a la vez
const verificarSeleccionCheckboxes = () => {
    const checkboxes = contenedorImagenes.querySelectorAll('input[name="imagenes_a_eliminar"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const seleccionados = Array.from(checkboxes).filter(chk => chk.checked);

            // Si todos están seleccionados, desmarcar el último que se intentó seleccionar
            if (seleccionados.length === checkboxes.length) {
                checkbox.checked = false;
                mostrarNotificacion("Debe dejar al menos una imagen sin seleccionar.");
            }
        });
    });
};

// Configuración del MutationObserver
const observer = new MutationObserver(actualizarConteo);
const config = { childList: true, subtree: true };
observer.observe(contenedorImagenes, config);

// Llama a la función inicialmente para verificar la cantidad de imágenes
actualizarConteo();


