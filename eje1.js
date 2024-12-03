// Variables globales
let candidatos = [];
let eleccionesIniciadas = false;
let votos = {};
let usuarioAutenticado = null;

// Obtener candidatos desde la API
fetch('https://raw.githubusercontent.com/cesarmcuellar/Elecciones/refs/heads/main/candidatos.json')
 .then(response => response.json())
 .then(data => {
        candidatos = data;
        // Agregar candidato en blanco
        candidatos.push({
            nombre: 'En Blanco',
            programa: 'En Blanco',
            foto: 'https://via.placeholder.com/150',
            aprendiz: 'En Blanco',
            ficha: 'En Blanco'
        });
    })
 .catch(error => console.error('Error al obtener candidatos:', error));

// Renderizar candidatos
function renderizarCandidatos() {
    const container = document.getElementById('candidatos');
    container.innerHTML = '';
    candidatos.forEach((candidato, index) => {
        const card = document.createElement('div');
        card.classList.add('candidato');
        card.innerHTML = `
            <h3>${candidato.nombre} ${candidato.programa}</h3>
            <img src="${candidato.foto}" alt="Foto de ${candidato.nombre}">
            <p>Aprendiz: ${candidato.aprendiz}</p>
            <p>Ficha: ${candidato.ficha}</p>
            <button class="votar" data-id="${index}" style="display: none;">Votar</button>
        `;
        container.appendChild(card);
    });
    // Mostrar botones de votación si el usuario está autenticado
    if (usuarioAutenticado) {
        const botonesVotar = document.querySelectorAll('.votar');
        botonesVotar.forEach(boton => boton.style.display = 'block');
        // Agregar evento de votación
        botonesVotar.forEach(boton => {
            boton.addEventListener('click', () => {
                if (eleccionesIniciadas) {
                    // Mostrar ventana de confirmación
                    const ventanaConfirmacion = document.getElementById('ventana-confirmacion');
                    ventanaConfirmacion.style.display = 'block';
                    // Establecer evento de confirmación
                    const confirmarVoto = document.getElementById('confirmar-voto');
                    confirmarVoto.addEventListener('click', () => {
                        // Registrar voto
                        const idCandidato = boton.getAttribute('data-id');
                        if (!votos[idCandidato]) {
                            votos[idCandidato] = 1;
                        } else {
                            votos[idCandidato]++;
                        }
                        // Ocultar ventana de confirmación
                        ventanaConfirmacion.style.display = 'none';
                    });
                    // Establecer evento de cancelación
                    const cancelarVoto = document.getElementById('cancelar-voto');
                    cancelarVoto.addEventListener('click', () => {
                        // Ocultar ventana de confirmación
                        ventanaConfirmacion.style.display = 'none';
                    });
                } else {
                    alert('Elecciones no iniciadas');
                }
            });
        });
    }
}

// Iniciar sesión
document.getElementById('iniciar-sesion').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'admin' && password === 'adso2874057') {
        usuarioAutenticado = { username, password };
        alert('Sesión iniciada con éxito');
        // Mostrar contenido principal
        document.getElementById('formulario-sesion').style.display = 'none';
        document.getElementById('contenido-principal').style.display = 'block';
        // Renderizar candidatos
        renderizarCandidatos();
        // Habilitar botón de inicio de elecciones
        document.getElementById('inicio-elecciones').disabled = false;
    } else {
        alert('Credenciales inválidas');
    }
});

// Iniciar elecciones
document.getElementById('inicio-elecciones').addEventListener('click', () => {
    if (usuarioAutenticado && usuarioAutenticado.username === 'admin') {
        eleccionesIniciadas = true;
        document.getElementById('inicio-elecciones').disabled = true;
        document.getElementById('cierre-elecciones').disabled = false;
        alert('Elecciones iniciadas');
    } else {
        alert('Debes iniciar sesión como administrador para iniciar las elecciones');
    }
});

// Cerrar elecciones
document.getElementById('cierre-elecciones').addEventListener('click', () => {
    if (usuarioAutenticado && usuarioAutenticado.username === 'admin') {
        // Mostrar resultados
        const resultados = document.getElementById('resultados');
        resultados.style.display = 'block';
        const listaResultados = document.getElementById('lista-resultados');
        listaResultados.innerHTML = '';
        Object.keys(votos).forEach(idCandidato => {
            const candidato = candidatos[idCandidato];
            const resultado = document.createElement('li');
            resultado.innerHTML = `
                <h3>${candidato.nombre} ${candidato.programa}</h3>
                <p>Votos: ${votos[idCandidato]}</p>
            `;
            listaResultados.appendChild(resultado);
        });
        // Restablecer estado de elecciones
        eleccionesIniciadas = false;
        document.getElementById('inicio-elecciones').disabled = false;
        document.getElementById('cierre-elecciones').disabled = true;
        alert('Elecciones cerradas');
    } else {
        alert('Debes iniciar sesión como administrador para cerrar las elecciones');
    }
});
