
document.addEventListener("DOMContentLoaded", function () {
    const colorData = document.getElementById("colorData");

    // Obtener los valores de color desde los atributos data-*
    const primaryColor = colorData.getAttribute("data-primary");
    const secondaryColor = colorData.getAttribute("data-secondary");
    const tertiaryColor = colorData.getAttribute("data-tertiary");
    const textColor = colorData.getAttribute("data-text");
    const backgroundColor = colorData.getAttribute("data-background");

    // Imprimir los valores en la consola
    console.log("Primary Color dede BASE:", primaryColor);
    console.log("Secondary Color dede BASE:", secondaryColor);
    console.log("Tertiary Color dede BASE:", tertiaryColor);
    console.log("Text Color dede BASE:", textColor);
    console.log("Background Color dede BASE:", backgroundColor);

    // Aplicar estos valores como variables CSS en :root
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty("--secondary-color", secondaryColor);
    document.documentElement.style.setProperty("--tertiary-color", tertiaryColor);
    document.documentElement.style.setProperty("--text-color", textColor);
    document.documentElement.style.setProperty("--background-color", backgroundColor);
});


