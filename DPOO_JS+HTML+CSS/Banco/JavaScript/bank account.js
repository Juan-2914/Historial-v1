class CuentaBancaria {
    #saldo;
    constructor(saldoInicial) {
        this.#saldo = saldoInicial;
    }

    getSaldo() {
        return this.#saldo;
    }

    consignar(monto) {
        if (monto > 0) {
            this.#saldo += monto;
            return true;
        }
        return false;
    }

    retirar(monto) {
        if (monto > 0 && monto <= this.#saldo) {
            this.#saldo -= monto;
            return true;
        }
        return false;
    }

    transferir(monto, cuentaDestino) {
        if (this.retirar(monto)) {
            cuentaDestino.consignar(monto);
            return true;
        }
        return false;
    }
}

class Empleado {
    constructor(nombre, edad, contrato, cuenta) {
        this.nombre = nombre;
        this.setEdad(edad);
        this.setContrato(contrato);
        this.cuenta = cuenta;
    }

    setEdad(edad) {
        if (!isNaN(edad) && edad >= 18) {
            this.edad = edad;
        } else {
            throw new Error("Edad inválida: debe ser mayor o igual a 18.");
        }
    }

    setContrato(tipo) {
        if (["Término fijo", "Término indefinido"].includes(tipo)) {
            this.contrato = tipo;
        } else {
            throw new Error("Tipo de contrato no válido.");
        }
    }
}

const empleados = [];

document.getElementById("empleadoForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const nombre = document.getElementById("nombre").value.trim();
    const edad = parseInt(document.getElementById("edad").value);
    const contrato = document.getElementById("contrato").value;
    const saldo = parseFloat(document.getElementById("saldoInicial").value);

    if (isNaN(edad) || edad < 18) {
        alert("Edad inválida. Debe ser un número y mínimo 18 años.");
        return;
    }

    if (!["Término fijo", "Término indefinido"].includes(contrato)) {
        alert("Contrato no válido.");
        return;
    }

    const cuenta = new CuentaBancaria(saldo);
    const nuevoEmpleado = new Empleado(nombre, edad, contrato, cuenta);

    empleados.push(nuevoEmpleado);
    actualizarLista();
    this.reset();
});

function actualizarLista() {
    const lista = document.getElementById("listaEmpleados");
    lista.innerHTML = "";

    empleados.forEach((emp, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${emp.nombre}</strong> (${emp.edad} años, ${emp.contrato})<br>
            Saldo: $${emp.cuenta.getSaldo().toFixed(2)}<br>
            <button onclick="accion('consignar', ${index})">Consignar</button>
            <button onclick="accion('retirar', ${index})">Retirar</button>
            <button onclick="accion('editar', ${index})">Editar</button>
        `;
        lista.appendChild(li);
    });
}

function accion(tipo, index) {
    const emp = empleados[index];

    if (tipo === "consignar") {
        const monto = parseFloat(prompt("Monto a consignar:"));
        if (emp.cuenta.consignar(monto)) {
            alert("Consignación exitosa.");
        } else {
            alert("Monto no válido.");
        }
    } else if (tipo === "retirar") {
        const monto = parseFloat(prompt("Monto a retirar:"));
        if (emp.cuenta.retirar(monto)) {
            alert("Retiro exitoso.");
        } else {
            alert("Fondos insuficientes o monto inválido.");
        }
    } else if (tipo === "editar") {
        const nuevoNombre = prompt("Nuevo nombre:", emp.nombre);
        const nuevaEdad = parseInt(prompt("Nueva edad:", emp.edad));
        const nuevoContrato = prompt("Nuevo contrato (Término fijo / Término indefinido):", emp.contrato);

        try {
            emp.nombre = nuevoNombre;
            emp.setEdad(nuevaEdad);
            emp.setContrato(nuevoContrato);
            alert("Empleado actualizado correctamente.");
        } catch (err) {
            alert(err.message);
        }
    }

    actualizarLista();
}
