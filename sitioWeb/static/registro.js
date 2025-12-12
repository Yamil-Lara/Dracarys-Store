// Función para activar/desactivar 'required' y mostrar mensajes de error

// Función para validar el nombre de usuario (solo letras, sin números ni caracteres especiales)
function validateUsername(input) {
    // Permite solo letras, no números ni caracteres especiales
    if (input.value.trim() === "") {
        input.setCustomValidity("Ingresa el nombre de usuario.");
    } else if (input.value.length < 3) {
        input.setCustomValidity("El nombre debe tener al menos 3 caracteres.");
    } else if (/[^A-Za-z]/.test(input.value)) { // Verifica si hay caracteres no permitidos
        input.setCustomValidity("El nombre de usuario solo debe contener letras.");
    } else {
        input.setCustomValidity(""); // Remueve el mensaje de error si es válido
    }
}

// Evitar la escritura de números y caracteres especiales en el campo de nombre de usuario
document.querySelector('input[name="username"]').addEventListener('input', function(event) {
    // Solo permite letras A-Z y a-z, elimina cualquier número o carácter especial
    this.value = this.value.replace(/[^A-Za-z]/g, '');
});

// Función de validación para el correo
function validateEmail(input) {
    if (input.value.trim() === "") {
        input.setCustomValidity("Ingresa el correo electrónico.");
    } else if (!input.value.includes("@gmail.com")) {
        input.setCustomValidity("El correo debe contener un '@gmail.com'.");
    } else {
        input.setCustomValidity(""); // Remueve el mensaje de error si es válido
    }
}

// Función de validación para el teléfono
function validatePhone(input) {
    if (input.value.trim() === "") {
        input.setCustomValidity("Ingresa el número de teléfono.");
    } else if (input.value.length < 8) {
        input.setCustomValidity("El número debe tener al menos 8 dígitos.");
    } else {
        input.setCustomValidity(""); // Remueve el mensaje de error si es válido
    }
}

// Función de validación para la contraseña
/*function validatePassword(input) {
    if (input.value.trim() === "") {
        input.setCustomValidity("Ingresa una contraseña.");
    } else if (input.value.length < 5) {
        input.setCustomValidity("La contraseña debe tener al menos 5 caracteres.");
    } else {
        input.setCustomValidity(""); // Remueve el mensaje de error si es válido
    }
}
*/
function validatePassword(input) {
    const username = document.querySelector('input[name="username"]').value.trim();
    const password = input.value;

    const hasUpperCase = /[A-Z]/.test(password); // Verifica si hay al menos una mayúscula
    const hasLowerCase = /[a-z]/.test(password); // Verifica si hay al menos una minúscula
    const hasNumber = /\d/.test(password); // Verifica si hay al menos un número
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Verifica caracteres especiales
    const containsUsername = username && password.includes(username); // Verifica si incluye el nombre de usuario

    if (password.trim() === "") {
        input.setCustomValidity("Ingresa una contraseña.");
    } else if (password.length < 8) {
        input.setCustomValidity("La contraseña debe tener al menos 8 caracteres.");
    } else if (!hasUpperCase) {
        input.setCustomValidity("La contraseña debe incluir al menos una letra mayúscula.");
    } else if (!hasLowerCase) {
        input.setCustomValidity("La contraseña debe incluir al menos una letra minúscula.");
    } else if (!hasNumber) {
        input.setCustomValidity("La contraseña debe incluir al menos un número.");
    } else if (!hasSpecialChar) {
        input.setCustomValidity("La contraseña debe incluir al menos un carácter especial.");
    } else if (containsUsername) {
        input.setCustomValidity("La contraseña no debe contener el nombre de usuario.");
    } else {
        input.setCustomValidity(""); // Contraseña válida
    }
}



// Función de validación para la confirmación de contraseña
function validateConfirmPassword(input, passwordField) {
    if (input.value.trim() === "") {
        input.setCustomValidity("Ingresa la confirmación de la contraseña.");
    } else if (input.value !== passwordField.value) {
        input.setCustomValidity("Las contraseñas no coinciden.");
    } else {
        input.setCustomValidity(""); // Remueve el mensaje de error si es válido
    }
}

// Añadir eventos de validación a los campos
document.addEventListener('DOMContentLoaded', function() {
    const usernameField = document.querySelector('input[name="username"]');
    const emailField = document.querySelector('input[name="email"]');
    const phoneField = document.querySelector('input[name="NumTelefono"]');
    const passwordField = document.querySelector('input[name="password"]');
    const confirmPasswordField = document.querySelector('input[name="confirmPassword"]');

    // Validar al escribir en los campos
    usernameField.addEventListener('input', function() {
        validateUsername(usernameField);
    });

    emailField.addEventListener('input', function() {
        validateEmail(emailField);
    });

    phoneField.addEventListener('input', function() {
        validatePhone(phoneField);
    });

    passwordField.addEventListener('input', function() {
        validatePassword(passwordField);
    });

    confirmPasswordField.addEventListener('input', function() {
        validateConfirmPassword(confirmPasswordField, passwordField);
    });

    // Notificación cuando las contraseñas no coinciden
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach(toast => {
        toast.classList.add('show'); // Muestra la notificación

        // Oculta la notificación después de 3 segundos (3000 ms)
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    });
});
