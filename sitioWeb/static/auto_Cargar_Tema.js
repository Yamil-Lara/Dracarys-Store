document.addEventListener("DOMContentLoaded", function () {
    // Acceder al div con el id 'Colorcito'
    const colorDiv = document.getElementById("Colorcito");
  
    // Obtener los valores de los atributos data-*
    const primaryColor = colorDiv.getAttribute("data-uno");
    const secondaryColor = colorDiv.getAttribute("data-dos");
    const tertiaryColor = colorDiv.getAttribute("data-tres");
    const textColor = colorDiv.getAttribute("data-cuatro");
    const backgroundColor = colorDiv.getAttribute("data-cinco");
  
    // Aplicar los colores a las variables CSS definidas en :root
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--tertiary-color', tertiaryColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
  
    // Imprimir los colores en la consola (opcional)
    console.log("Primary color de PERFIL: " + primaryColor);
    console.log("Secondary color de PERFIL: " + secondaryColor);
    console.log("Tertiary color de PERFIL: " + tertiaryColor);
    console.log("Text color de PERFIL: " + textColor);
    console.log("Background color de PERFIL: " + backgroundColor);
  });