document.addEventListener("DOMContentLoaded", function () {
  // Obtener el valor de user_id desde el atributo data-user-id
  var userId = document.getElementById("user-id").getAttribute("data-user-id");
  console.log("User ID: ", userId); // Ver en la consola para asegurarse de que se guardó correctamente
  const modal = document.getElementById("ventana-Estilos");
  const openModal = document.getElementById("openVentanaEstilos");
  const closeModal = modal.querySelector(".ventana-estilos-close");
  const images = modal.querySelectorAll(".selectable-image");
  const selectedImageInfo = document.getElementById("selected-image-info");

  let selectedImage = null;

  // Colores agradables para cada imagen
  const colorThemes = {
    "Imagen 1": { primary: "#02735E", secondary: "#014040", tertiary: "#F27405", text: "#333", background: "#f4f4f4" },
    "Imagen 2": { primary: "#8BADC0", secondary: "#F2D1A0", tertiary: "#F5A8B5", text: "#4A4A4A", background: "#F9F9F9" },
    "Imagen 3": { primary: "#2F4858", secondary: "#E8A598", tertiary: "#A2D5C6", text: "#333333", background: "#F6F7F7" },
    "Imagen 4": { primary: "#3D5A80", secondary: "#98C7E6", tertiary: "#EE6C4D", text: "#333", background: "#D9EAF7" },
    "Imagen 5": { primary: "#cc978b", secondary: "#A3C9D7", tertiary: "#D4B89A", text: "#4D4D4D", background: "#F5F5F5" },
    "Imagen 6": { primary: "#b58ba0", secondary: "#A2B9D6", tertiary: "#F1D0A2", text: "#4A4A4A", background: "#F7F4F1" },
    "Imagen 7": { primary: "#81a679", secondary: "#D8E4D3", tertiary: "#F1C4B0", text: "#3E3E3E", background: "#F9F9F9" },
    "Imagen 8": { primary: "#d6936d", secondary: "#A3D2D3", tertiary: "#E1C1A6", text: "#4B4B4B", background: "#F7F7F7" }
  };

  // Variables para almacenar los colores seleccionados
  let primary = '';
  let secondary = '';
  let tertiary = '';
  let text = '';
  let background = '';

  // Abre el modal al hacer clic en el enlace
  openModal.addEventListener("click", function (event) {
    event.preventDefault();
    modal.style.display = "flex";
  });

  // Cierra el modal al hacer clic en el icono de cerrar
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Cierra el modal si se hace clic fuera del contenido
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Agregar evento de selección a las imágenes
  images.forEach(function (image) {
    image.addEventListener("click", function () {
      // Si ya hay una imagen seleccionada, quitar la selección
      if (selectedImage) {
        selectedImage.classList.remove("selected");
      }

      // Selecciona la nueva imagen
      image.classList.add("selected");
      selectedImage = image;
      selectedImageInfo.textContent = `Imagen seleccionada: ${image.alt}`;

      // Cambiar colores según la imagen seleccionada
      const theme = colorThemes[image.alt];
      if (theme) {
        // Almacenar los colores seleccionados en las variables correspondientes
        primary = theme.primary;
        secondary = theme.secondary;
        tertiary = theme.tertiary;
        text = theme.text;
        background = theme.background;

        // Actualiza la interfaz con los nuevos colores
        changeColors(theme);
        saveColorSettings(userId, primary, secondary, tertiary, text, background);

        // Mostrar los valores de las variables de color en la consola
        console.log('Colores seleccionados:');
        console.log('Primary:', primary);
        console.log('Secondary:', secondary);
        console.log('Tertiary:', tertiary);
        console.log('Text:', text);
        console.log('Background:', background);
      }
    });
  });

  // Función para cambiar los colores en :root
  function changeColors(theme) {
    document.documentElement.style.setProperty("--primary-color", theme.primary);
    document.documentElement.style.setProperty("--secondary-color", theme.secondary);
    document.documentElement.style.setProperty("--tertiary-color", theme.tertiary);
    document.documentElement.style.setProperty("--text-color", theme.text);
    document.documentElement.style.setProperty("--background-color", theme.background);
  }
  function saveColorSettings(userId, primary, secondary, tertiary, text, background) {
    fetch('/guardar-colores/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        user_id: userId,
        primary: primary,
        secondary: secondary,
        tertiary: tertiary,
        text: text,
        background: background
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Colores guardados correctamente:', data);
    })
    .catch(error => {
      console.error('Error al guardar los colores:', error);
    });
  }

  // Función para obtener el token CSRF de las cookies
  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});
