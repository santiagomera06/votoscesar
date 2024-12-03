let candidatos = [];
let eleccionesIniciadas = false;
let votos = [];
let usuarioAutenticado = null;

fetch('https://raw.githubusercontent.com/cesarmcuellar/Elecciones/refs/heads/main/candidatos.json')
    .then(response => response.json())
    .then(data => {
        candidatos = data;
        votos = new Array(candidatos.length).fill(0);
    });

function Candidatos() {
    const container = document.getElementById('candidatos');
    container.innerHTML = '';
    candidatos.forEach((candidato, index) => {
        const card = document.createElement('div');
        card.classList.add('candidato');
        card.innerHTML = `
            <h2>${candidato.curso}</h2>
            <img src="${candidato.foto}" alt="Foto de ${candidato.nombre}" data-id="${index}">
            <h3>${candidato.nombre} ${candidato.apellido}</h3>
            <p>Ficha: ${candidato.ficha}</p>
        `;
        container.appendChild(card);
    });
    if (usuarioAutenticado) {
        document.querySelectorAll('.candidato img').forEach(img => {
            img.addEventListener('click', () => {
                if (eleccionesIniciadas) {
                    const ventanaConfirmacion = document.getElementById('ventana-confirmacion');
                    ventanaConfirmacion.style.display = 'block';
                    const confirmarVoto = document.getElementById('confirmar-voto');
                    const cancelarVoto = document.getElementById('cancelar-voto');

                    const confirmarHandler = () => {
                        const idCandidato = img.getAttribute('data-id');
                        votos[idCandidato]++;
                        ventanaConfirmacion.style.display = 'none';
                        confirmarVoto.removeEventListener('click', confirmarHandler);
                        cancelarVoto.removeEventListener('click', cancelarHandler);
                    };

                    const cancelarHandler = () => {
                        ventanaConfirmacion.style.display = 'none';
                        confirmarVoto.removeEventListener('click', confirmarHandler);
                        cancelarVoto.removeEventListener('click', cancelarHandler);
                    };

                    confirmarVoto.addEventListener('click', confirmarHandler);
                    cancelarVoto.addEventListener('click', cancelarHandler);
                } else {
                    alert('Elecciones no iniciadas');
                }
            });
        });
    }
}

document.getElementById('iniciar-sesion').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'admin' && password === 'adso2874057') {
        usuarioAutenticado = { username, password };
        alert('Sesión iniciada con éxito');
        document.getElementById('formulario-sesion').style.display = 'none';
        document.getElementById('contenido-principal').style.display = 'block';
        Candidatos();
        document.getElementById('inicio-elecciones').disabled = false;
    } else {
        alert('Credenciales inválidas');
    }
});

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

document.getElementById('cierre-elecciones').addEventListener('click', () => {
    if (usuarioAutenticado && usuarioAutenticado.username === 'admin') {
        const resultados = document.getElementById('resultados');
        resultados.style.display = 'block';
        const listaResultados = document.getElementById('lista-resultados');
        listaResultados.innerHTML = '';
        votos.forEach((voto, idCandidato) => {
            const candidato = candidatos[idCandidato];
            const resultado = document.createElement('li');
            resultado.innerHTML = `
                <h3>${candidato.nombre} ${candidato.apellido} - ${candidato.programa}</h3>
                <p>Votos: ${voto}</p>
            `;
            listaResultados.appendChild(resultado);
        });
        eleccionesIniciadas = false;
        document.getElementById('inicio-elecciones').disabled = false;
        document.getElementById('cierre-elecciones').disabled = true;
        alert('Elecciones cerradas');
    } else {
        alert('Debes iniciar sesión como administrador para cerrar las elecciones');
    }
});
