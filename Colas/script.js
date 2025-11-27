// Class for Normal Queue (FIFO/LIFO)
class Cola {
    constructor(capacidad = 10) {
        this.elementos = [];
        this.capacidad = capacidad;
        this.frente = 0; // Index of the front element
        this.final = -1; // Index of the rear element
        this.esFIFO = true; // Default is FIFO
    }

    // Add element to the queue
    enqueue(elemento) {
        if (this.estaLlena()) {
            throw new Error("Desbordamiento: La cola está llena");
        }

        this.final++;
        this.elementos[this.final] = elemento;
        return true;
    }

    // Remove element from the queue
    dequeue() {
        if (this.estaVacia()) {
            throw new Error("Subdesbordamiento: La cola está vacía");
        }

        let elemento;
        if (this.esFIFO) {
            // FIFO: remove from the front
            elemento = this.elementos[this.frente];
            this.frente++;
        } else {
            // LIFO: remove from the rear
            elemento = this.elementos[this.final];
            this.final--;
        }

        // If the queue is empty after dequeue, reset indexes
        if (this.estaVacia()) {
            this.frente = 0;
            this.final = -1;
            // Clear the underlying array for memory optimization in normal queue
            this.elementos = [];
        }

        return elemento;
    }

    // Consult the front element
    front() {
        if (this.estaVacia()) {
            throw new Error("La cola está vacía");
        }

        return this.esFIFO ? this.elementos[this.frente] : this.elementos[this.final];
    }

    // Consult the rear element
    rear() {
        if (this.estaVacia()) {
            throw new Error("La cola está vacía");
        }

        return this.esFIFO ? this.elementos[this.final] : this.elementos[this.frente];
    }

    // Get current size
    size() {
        if (this.estaVacia()) return 0;
        return this.final - this.frente + 1;
    }

    // Check if empty
    estaVacia() {
        return this.final < this.frente;
    }

    // Check if full
    estaLlena() {
        return this.size() >= this.capacidad;
    }

    // Empty the queue
    clear() {
        this.elementos = [];
        this.frente = 0;
        this.final = -1;
    }

    // Get all elements (for visualization)
    getElementos() {
        if (this.estaVacia()) return [];
        return this.elementos.slice(this.frente, this.final + 1);
    }

    // Toggle between FIFO and LIFO
    toggleFifoLifo() {
        this.esFIFO = !this.esFIFO;
        // When changing mode, reverse elements and reset indexes
        if (!this.estaVacia()) {
            this.elementos = this.elementos.slice(this.frente, this.final + 1).reverse();
            this.frente = 0;
            this.final = this.elementos.length - 1;
        }
    }
}

// Class for Circular Queue (FIFO/LIFO)
class ColaCircular {
    constructor(capacidad = 10) {
        this.elementos = new Array(capacidad);
        this.capacidad = capacidad;
        this.frente = -1; // Index of the front element
        this.final = -1; // Index of the rear element
        this.tamaño = 0; // Current number of elements
        this.esFIFO = true; // Default is FIFO
    }

    // Add element to the queue
    enqueue(elemento) {
        if (this.estaLlena()) {
            throw new Error("Desbordamiento: La cola está llena");
        }

        if (this.estaVacia()) {
            this.frente = 0;
            this.final = 0;
        } else {
            this.final = (this.final + 1) % this.capacidad;
        }

        this.elementos[this.final] = elemento;
        this.tamaño++;
        return true;
    }

    // Remove element from the queue
    dequeue() {
        if (this.estaVacia()) {
            throw new Error("Subdesbordamiento: La cola está vacía");
        }

        let elemento;
        if (this.esFIFO) {
            // FIFO: remove from the front
            elemento = this.elementos[this.frente];
            if (this.frente === this.final) {
                // Last element
                this.frente = -1;
                this.final = -1;
            } else {
                this.frente = (this.frente + 1) % this.capacidad;
            }
        } else {
            // LIFO: remove from the rear
            elemento = this.elementos[this.final];
            if (this.frente === this.final) {
                // Last element
                this.frente = -1;
                this.final = -1;
            } else {
                // Circular subtraction: (index - 1 + capacity) % capacity
                this.final = (this.final - 1 + this.capacidad) % this.capacidad;
            }
        }

        this.tamaño--;
        return elemento;
    }

    // Consult the front element
    front() {
        if (this.estaVacia()) {
            throw new Error("La cola está vacía");
        }

        return this.esFIFO ? this.elementos[this.frente] : this.elementos[this.final];
    }

    // Consult the rear element
    rear() {
        if (this.estaVacia()) {
            throw new Error("La cola está vacía");
        }

        return this.esFIFO ? this.elementos[this.final] : this.elementos[this.frente];
    }

    // Get current size
    size() {
        return this.tamaño;
    }

    // Check if empty
    estaVacia() {
        return this.tamaño === 0;
    }

    // Check if full
    estaLlena() {
        return this.tamaño === this.capacidad;
    }

    // Empty the queue
    clear() {
        this.elementos = new Array(this.capacidad);
        this.frente = -1;
        this.final = -1;
        this.tamaño = 0;
    }

    // Get all elements (for visualization)
    getElementos() {
        if (this.estaVacia()) return [];

        const elementos = [];
        let actual = this.frente;

        for (let i = 0; i < this.tamaño; i++) {
            elementos.push({
                valor: this.elementos[actual],
                posicion: actual // Used for circular positioning
            });
            actual = (actual + 1) % this.capacidad;
        }

        // If LIFO, reverse the display order
        if (!this.esFIFO) {
            return elementos.reverse();
        }

        return elementos;
    }

    // Toggle between FIFO and LIFO
    toggleFifoLifo() {
        this.esFIFO = !this.esFIFO;
        // For circular queue, we just change the mode
        // The visualization will adapt by reversing the order in getElementos
    }
}

// Variables globales
let colaActual;
let esCircular = false;
let esFIFO = true;

// Elementos DOM
const colaNormalElement = document.getElementById('colaNormal');
const colaCircularElement = document.getElementById('colaCircular');
const statusElement = document.getElementById('status');
const elementoInput = document.getElementById('elementoInput');
const enqueueBtn = document.getElementById('enqueueBtn');
const dequeueBtn = document.getElementById('dequeueBtn');
const frontBtn = document.getElementById('frontBtn');
const rearBtn = document.getElementById('rearBtn');
const sizeBtn = document.getElementById('sizeBtn');
const clearBtn = document.getElementById('clearBtn');
const toggleModeBtn = document.getElementById('toggleMode');
const toggleFifoLifoBtn = document.getElementById('toggleFifoLifo');
const modeText = document.getElementById('modeText');
const fifoLifoText = document.getElementById('fifoLifoText');
const infoTitle = document.getElementById('infoTitle');
const infoList = document.getElementById('infoList');
const indicadoresNormal = document.getElementById('indicadoresNormal');

// Initialize queue
function inicializarCola() {
    if (esCircular) {
        colaActual = new ColaCircular(10);
        modeText.textContent = 'Cambiar a Cola Sencilla';
        infoTitle.textContent = 'Cola Circular - Características implementadas:';
        actualizarInfoCircular();
        colaNormalElement.style.display = 'none';
        colaCircularElement.style.display = 'block';
        indicadoresNormal.style.display = 'none';
    } else {
        colaActual = new Cola(10);
        modeText.textContent = 'Cambiar a Cola Circular';
        infoTitle.textContent = 'Cola Sencilla - Características implementadas:';
        actualizarInfoNormal();
        colaNormalElement.style.display = 'flex';
        colaCircularElement.style.display = 'none';
        indicadoresNormal.style.display = 'flex';
    }

    // Set the FIFO/LIFO mode
    colaActual.esFIFO = esFIFO;
    actualizarFifoLifoText();

    actualizarCola();
    mostrarMensaje(
        `${esCircular ? 'Cola Circular' : 'Cola Sencilla'} activada - Modo ${esFIFO ? 'FIFO' : 'LIFO'}`,
        'info'
    );
}

// Update info for normal queue
function actualizarInfoNormal() {
    infoList.innerHTML = `
    <li><strong>Iteradores Frente y Final:</strong> Apuntan al primer y último elemento de la cola</li>
    <li><strong>Manejo de errores:</strong> Desbordamiento (overflow) y subdesbordamiento (underflow)</li>
    <li><strong>Interactividad:</strong> Interfaz visual atractiva con retroalimentación inmediata</li>
    <li><strong>Operaciones:</strong> Enqueue, Dequeue, Front, Rear, Size y Clear</li>
    <li><strong>Modo:</strong> ${esFIFO ? 'FIFO (First-In-First-Out)' : 'LIFO (Last-In-First-Out)'}</li>
    `;
}

// Update info for circular queue
function actualizarInfoCircular() {
    infoList.innerHTML = `
    <li><strong>Iteradores Frente y Final:</strong> Apuntan al primer y último elemento de la cola</li>
    <li><strong>Manejo de errores:</strong> Desbordamiento (overflow) y subdesbordamiento (underflow)</li>
    <li><strong>Interactividad:</strong> Interfaz visual atractiva con retroalimentación inmediata</li>
    <li><strong>Operaciones:</strong> Enqueue, Dequeue, Front, Rear, Size y Clear</li>
    <li><strong>Característica Circular:</strong> Reutilización eficiente del espacio de memoria</li>
    <li><strong>Ventaja:</strong> No requiere desplazamiento de elementos al eliminar</li>
    <li><strong>Modo:</strong> ${esFIFO ? 'FIFO (First-In-First-Out)' : 'LIFO (Last-In-First-Out)'}</li>
    `;
}

// Update FIFO/LIFO button text
function actualizarFifoLifoText() {
    fifoLifoText.textContent = esFIFO ? 'Cambiar a LIFO' : 'Cambiar a FIFO';
}

// Update queue visualization
function actualizarCola() {
    if (esCircular) {
        actualizarColaCircular();
    } else {
        actualizarColaNormal();
    }
}

// Update normal queue visualization
function actualizarColaNormal() {
    colaNormalElement.innerHTML = '';
    const elementos = colaActual.getElementos();

    if (elementos.length === 0) {
        const emptyElement = document.createElement('div');
        emptyElement.className = 'elemento-normal';
        emptyElement.textContent = 'Vacía';
        emptyElement.style.background = 'var(--color-bg-primary)';
        emptyElement.style.color = 'var(--color-text-subtle)';
        emptyElement.style.opacity = '0.7';
        colaNormalElement.appendChild(emptyElement);
        return;
    }

    // Create visual elements for each item in the queue
    elementos.forEach((elemento, index) => {
        const div = document.createElement('div');
        div.className = 'elemento-normal';
        div.textContent = elemento;

        // Mark the front and rear based on the mode
        if (esFIFO) {
            // FIFO: front is the first, rear is the last
            if (index === 0) {
                div.classList.add('frente-normal');
            }
            if (index === elementos.length - 1) {
                div.classList.add('final-normal');
            }
        } else {
            // LIFO: front is the last (stack-like), rear is the first
            if (index === elementos.length - 1) {
                div.classList.add('frente-normal');
            }
            if (index === 0) {
                div.classList.add('final-normal');
            }
        }

        colaNormalElement.appendChild(div);
    });
}

// Update circular queue visualization
function actualizarColaCircular() {
    colaCircularElement.innerHTML = '<div class="circular-track"></div>';
    const elementos = colaActual.getElementos();

    if (elementos.length === 0) {
        const emptyElement = document.createElement('div');
        emptyElement.className = 'elemento-circular';
        emptyElement.textContent = 'Vacía';
        emptyElement.style.background = 'var(--color-bg-primary)';
        emptyElement.style.color = 'var(--color-text-subtle)';
        emptyElement.style.opacity = '0.7';
        emptyElement.style.top = '50%';
        emptyElement.style.left = '50%';
        emptyElement.style.transform = 'translate(-50%, -50%)';
        colaCircularElement.appendChild(emptyElement);
        return;
    }

    // Create visual elements for each item in the circular queue
    const radio = 135; // Radius of the circle
    const centroX = 160; // Center X of the container
    const centroY = 160; // Center Y of the container
    const anguloInicial = -Math.PI / 2; // Start from the top
    const anguloPorElemento = (2 * Math.PI) / elementos.length;

    // Variables to track positions of front and rear
    let posicionFrente = null;
    let posicionFinal = null;

    elementos.forEach((elementoObj, index) => {
        const angulo = anguloInicial + (index * anguloPorElemento);
        const x = centroX + radio * Math.cos(angulo);
        const y = centroY + radio * Math.sin(angulo);

        const div = document.createElement('div');
        div.className = 'elemento-circular';
        div.textContent = elementoObj.valor;
        div.style.left = `${x - 27.5}px`; // Adjust to center the element (width/2)
    div.style.top = `${y - 27.5}px`; // Adjust to center the element (height/2)

    // Mark the front and rear based on the mode
    if (esFIFO) {
        // FIFO: front is the first, rear is the last
        if (index === 0) {
            div.classList.add('frente-circular');
            posicionFrente = { x, y };
        }
        if (index === elementos.length - 1) {
            div.classList.add('final-circular');
            posicionFinal = { x, y };
        }
    } else {
        // LIFO: front is the last (stack-like), rear is the first
        if (index === elementos.length - 1) {
            div.classList.add('frente-circular');
            posicionFrente = { x, y };
        }
        if (index === 0) {
            div.classList.add('final-circular');
            posicionFinal = { x, y };
        }
    }

    colaCircularElement.appendChild(div);
    });

    // Add dynamic indicators for front and rear
    if (posicionFrente) {
        const indicadorFrente = document.createElement('div');
        indicadorFrente.className = 'indicador-circular indicador-frente-circular';
        indicadorFrente.textContent = 'Frente';
        indicadorFrente.style.left = `${posicionFrente.x + 35}px`;
        indicadorFrente.style.top = `${posicionFrente.y - 35}px`;
        colaCircularElement.appendChild(indicadorFrente);
    }

    if (posicionFinal) {
        const indicadorFinal = document.createElement('div');
        indicadorFinal.className = 'indicador-circular indicador-final-circular';
        indicadorFinal.textContent = 'Final';
        indicadorFinal.style.left = `${posicionFinal.x + 35}px`;
        indicadorFinal.style.top = `${posicionFinal.y - 35}px`;
        colaCircularElement.appendChild(indicadorFinal);
    }
}

// Show status message
function mostrarMensaje(mensaje, tipo = 'info') {
    statusElement.textContent = mensaje;
    statusElement.className = 'status ' + tipo;

    // Reset status after a few seconds
    setTimeout(() => {
        if(statusElement.textContent === mensaje) {
            statusElement.textContent = 'Presiona un botón para interactuar con la cola';
            statusElement.className = 'status info';
        }
    }, 4000);
}

// Event Listeners
enqueueBtn.addEventListener('click', () => {
    const valor = elementoInput.value.trim();

    if (valor === '') {
        mostrarMensaje('Error: Ingresa un valor antes de agregar', 'error');
        return;
    }

    try {
        colaActual.enqueue(valor);
        mostrarMensaje(`Elemento "${valor}" agregado a la cola`, 'success');
        elementoInput.value = '';
        actualizarCola();
        actualizarInfoNormal();
        actualizarInfoCircular();
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
});

dequeueBtn.addEventListener('click', () => {
    try {
        const elemento = colaActual.dequeue();
        mostrarMensaje(`Elemento "${elemento}" eliminado de la cola`, 'success');
        actualizarCola();
        actualizarInfoNormal();
        actualizarInfoCircular();
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
});

frontBtn.addEventListener('click', () => {
    try {
        const elemento = colaActual.front();
        mostrarMensaje(`Elemento en el frente: "${elemento}"`, 'info');
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
});

rearBtn.addEventListener('click', () => {
    try {
        const elemento = colaActual.rear();
        mostrarMensaje(`Elemento en el final: "${elemento}"`, 'info');
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
});

sizeBtn.addEventListener('click', () => {
    const tamaño = colaActual.size();
    mostrarMensaje(`Tamaño actual de la cola: ${tamaño} elemento(s)`, 'info');
});

clearBtn.addEventListener('click', () => {
    colaActual.clear();
    mostrarMensaje('Cola vaciada', 'success');
    actualizarCola();
    actualizarInfoNormal();
    actualizarInfoCircular();
});

toggleModeBtn.addEventListener('click', () => {
    esCircular = !esCircular;
    inicializarCola();
});

toggleFifoLifoBtn.addEventListener('click', () => {
    colaActual.toggleFifoLifo();
    esFIFO = colaActual.esFIFO; // Update global state
    actualizarFifoLifoText();
    actualizarCola();
    actualizarInfoNormal();
    actualizarInfoCircular();
    mostrarMensaje(
        `Modo cambiado a ${esFIFO ? 'FIFO (First-In-First-Out)' : 'LIFO (Last-In-First-Out)'}`,
                   'info'
    );
});

// Allow adding with Enter key
elementoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        enqueueBtn.click();
    }
});

// Initialize the application
inicializarCola();
