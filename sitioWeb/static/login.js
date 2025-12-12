// Obtener el modal
var modal = document.getElementById("loginModal");

// Obtener el botón que abre el modal
var btn = document.getElementById("loginBtn"); // Utiliza el id que agregamos al botón

// Obtener el elemento <span> que cierra el modal
var span = document.getElementById("closeModal");

// Cuando el usuario hace clic en el botón, abrir el modal
if (btn) {  // Asegúrate de que el botón exista en la página
    btn.onclick = function() {
        modal.style.display = "block";
    }
}

// Cuando el usuario hace clic en <span> (x), cerrar el modal
if (span) {
    span.onclick = function() {
        modal.style.display = "none";  // Ocultar el modal de login
    }
}

// Cuando el usuario hace clic en cualquier parte fuera del modal, cerrarlo
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Cerrar el modal cuando el formulario de login sea enviado exitosamente
document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Si el login es exitoso (el servidor valida las credenciales), cerramos el modal
    modal.style.display = "none";
    // Aquí puedes agregar código para mostrar un mensaje o redirigir al usuario si el login es exitoso.
});
//Controlar mejor el login a traves de regstro,html para que se te abra directo cuando selecciones ya tienes cuenta ?
const params = new URLSearchParams(window.location.search);
if (params.get('login') === '1') {
    // Mostrar el modal de login si 'login=1' está en la URL
    document.getElementById("loginModal").style.display = "block";
}
// Cerrar el modal y limpiar el parámetro de la URL
if (span) {
    span.onclick = function() {
        modal.style.display = "none";
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// para q el mensaje flotante desaparesca despues de 2000 milisegundos (2 segundos)
document.addEventListener("DOMContentLoaded", function() {
    // Selecciona todas las alertas y las oculta después de 5 segundos
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach((alert) => {
        setTimeout(() => {
            alert.style.display = 'none';
        }, 2000); // Ocultar cada notificación después de 5 segundos
    });
});