document.getElementById('monto_deposito').addEventListener('input', function (e) {
    let value = e.target.value;
    if (value.includes('.')) {
        let [integer, decimal] = value.split('.');
        if (decimal.length > 2) {
            e.target.value = integer + '.' + decimal.slice(0, 2); // Limita a 2 decimales
        }
    }
});

function validarInputPositivo(inputId) {
    document.getElementById(inputId).addEventListener('input', function (e) {
        let value = e.target.value;


        // Si el valor es negativo, lo corrige a vacío o a 0
        if (value < 0) {
            e.target.value = Math.abs(value); // Convierte a positivo
        }

        // Limita a 2 decimales
        if (value.includes('.')) {
            let [integer, decimal] = value.split('.');
            if (decimal.length > 2) {
                e.target.value = integer + '.' + decimal.slice(0, 2);
            }
        }
        let numericValue = parseFloat(value);
        if (numericValue > 9999.99) {
            e.target.value = value.slice(0, -1); // Borra el último carácter ingresado
        }
    });
}

// Aplica la validación en ambos inputs
validarInputPositivo('monto_deposito');
validarInputPositivo('monto_retiro');
