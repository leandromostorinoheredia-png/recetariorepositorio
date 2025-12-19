// Variables globales
let recetas = null;
let recetaActual = 0;
let totalRecetas = 0;

// Elementos del DOM
const vistaCuadricula = document.getElementById('vista-cuadricula');
const vistaDetalle = document.getElementById('vista-detalle');
const tituloReceta = document.getElementById('titulo-receta');
const imagenReceta = document.getElementById('imagen-receta');
const infoDuracion = document.getElementById('info-duracion');
const infoPorciones = document.getElementById('info-porciones');
const listaIngredientes = document.getElementById('lista-ingredientes');
const listaProcedimiento = document.getElementById('lista-procedimiento');
const contenedorDetalle = document.getElementById('contenedor-detalle');

// Cargar las recetas al iniciar
cargarRecetas();

async function cargarRecetas() {
try {
    const respuesta = await fetch('resources/recetas.json');
    recetas = await respuesta.json();
    iniciarApp();
} catch (error) {
    console.log('Error cargando las recetas:', error);
    // Usar datos de ejemplo si hay error
    recetas = {
        "Ceviche Peruano": {
            "Info": {
                "duracion": "30min",
                "porciones": "4 personas",
                "dificultad": "Fácil",
                "categoria": "Plato Principal",
                "calorias": "280 por porción",
                "descripcion": "El plato bandera del Perú"
            },
            "Ingredientes": ["Pescado fresco", "Limones", "Cebolla", "Ají", "Cilantro"],
            "Procedimiento": ["Cortar el pescado", "Mezclar con limón", "Agregar ingredientes"],
            "Imagen": "https://cdn0.recetasgratis.net/es/posts/7/4/1/ceviche_peruano_18147_600_square.jpg",
            "color": "#E6F7D4"
        }
    };
    iniciarApp();
}
}

function iniciarApp() {
totalRecetas = Object.keys(recetas).length;
mostrarCuadricula();
}

function mostrarCuadricula() {
vistaCuadricula.innerHTML = '';

const nombresRecetas = Object.keys(recetas);

nombresRecetas.forEach((nombre, indice) => {
    const receta = recetas[nombre];
    
    // Crear tarjeta
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta mostrar';
    
    // Imagen
    const imagen = document.createElement('img');
    imagen.src = receta.Imagen;
    imagen.alt = nombre;
    
    // Contenido de la tarjeta
    const contenido = document.createElement('div');
    contenido.className = 'tarjeta-contenido';
    
    // Título
    const titulo = document.createElement('h3');
    titulo.className = 'tarjeta-titulo';
    titulo.textContent = nombre;
    
    // Información
    const info = document.createElement('div');
    info.className = 'tarjeta-info';
    info.innerHTML = `⏱️ ${receta.Info.duracion} &nbsp; 👥 ${receta.Info.porciones}`;
    
    // Descripción
    const descripcion = document.createElement('p');
    descripcion.className = 'tarjeta-descripcion';
    descripcion.textContent = receta.Info.descripcion || 'Receta peruana';
    
    // Evento de clic
    tarjeta.onclick = function() {
        mostrarDetalle(indice);
    };
    
    // Unir todo
    contenido.appendChild(titulo);
    contenido.appendChild(info);
    contenido.appendChild(descripcion);
    tarjeta.appendChild(imagen);
    tarjeta.appendChild(contenido);
    vistaCuadricula.appendChild(tarjeta);
});
}

function mostrarDetalle(indice) {
recetaActual = indice;
actualizarDetalle();

// Cambiar vistas
vistaCuadricula.style.display = 'none';
vistaDetalle.style.display = 'block';
contenedorDetalle.classList.add('mostrar');

// Ir al inicio de la página
window.scrollTo(0, 0);
}

function volverACuadricula() {
vistaDetalle.style.display = 'none';
vistaCuadricula.style.display = 'grid';
}

function recetaAnterior() {
recetaActual--;
if (recetaActual < 0) {
    recetaActual = totalRecetas - 1;
}
actualizarDetalle();
window.scrollTo(0, 0);
}

function recetaSiguiente() {
recetaActual++;
if (recetaActual >= totalRecetas) {
    recetaActual = 0;
}
actualizarDetalle();
window.scrollTo(0, 0);
}

function actualizarDetalle() {
const nombresRecetas = Object.keys(recetas);
const nombre = nombresRecetas[recetaActual];
const receta = recetas[nombre];

// Actualizar título
tituloReceta.textContent = nombre;

// Actualizar imagen
imagenReceta.src = receta.Imagen;
imagenReceta.alt = nombre;

// Actualizar información
infoDuracion.innerHTML = `<strong>⏱️</strong> ${receta.Info.duracion}`;
infoPorciones.innerHTML = `<strong>👥</strong> ${receta.Info.porciones}`;

// Agregar información adicional si existe
let infoExtra = '';
if (receta.Info.dificultad) {
    infoExtra += `<div class="info-item"><strong>⚡ Dificultad: </strong> ${receta.Info.dificultad}</div>`;
}
if (receta.Info.categoria) {
    infoExtra += `<div class="info-item"><strong>📂</strong> ${receta.Info.categoria}</div>`;
}
if (receta.Info.calorias) {
    infoExtra += `<div class="info-item"><strong>🔥 Calorias: </strong> ${receta.Info.calorias}</div>`;
}

// Agregar información adicional al contenedor
if (infoExtra) {
    const contenedorInfo = document.querySelector('.info-receta');
    contenedorInfo.innerHTML = infoDuracion.outerHTML + infoPorciones.outerHTML + infoExtra;
}

// Actualizar ingredientes
listaIngredientes.innerHTML = '';
receta.Ingredientes.forEach(ingrediente => {
    const elemento = document.createElement('li');
    elemento.textContent = ingrediente;
    listaIngredientes.appendChild(elemento);
});

// Actualizar procedimiento
listaProcedimiento.innerHTML = '';
receta.Procedimiento.forEach(paso => {
    const elemento = document.createElement('li');
    elemento.textContent = paso;
    listaProcedimiento.appendChild(elemento);
});

// Cambiar color de fondo si existe
if (receta.color) {
    contenedorDetalle.style.borderLeft = `5px solid ${receta.color}`;
}
}