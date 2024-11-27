const apiUrl = "http://localhost:3000/api"; // URL do backend
const apiUrlEndPoint = "http://localhost:3001/api";
let apostaSelecionada = null;

document.addEventListener("DOMContentLoaded", carregarApostas);

async function carregarEventos() {
    try {
        const response = await fetch(`${apiUrl}/getEvents?status=ativo`); 
        if (!response.ok) throw new Error("Erro ao carregar eventos");

        const eventos = await response.json();
        const ativos = eventos.filter(evento => evento.status === "ativo"); 

        atualizarUI(ativos); 
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
    }
}

function atualizarUI(disponiveis, apostadas) {
    const disponiveisList = document.getElementById("disponiveis-list");
    const apostadasList = document.getElementById("apostadas-list");

    disponiveisList.innerHTML = disponiveis.map(criarCardDisponivel).join("");
    apostadasList.innerHTML = apostadas.map(criarCardApostada).join("");
}

function criarCardDisponivel(aposta) {
    return `
        <div class="card">
            <p>ID: ${aposta.id}</p>
            <p>Descrição: ${aposta.descricao}</p>
            <button onclick="exibirFormulario(${aposta.id})">Apostar</button>
        </div>
    `;
}

function criarCardApostada(aposta) {
    return `
        <div class="card">
            <p>ID: ${aposta.id}</p>
            <p>Descrição: ${aposta.descricao}</p>
            <button onclick="cancelarAposta(${aposta.id})">Cancelar</button>
        </div>
    `;
}

function exibirFormulario(id) {
    apostaSelecionada = id;
    document.getElementById("form-aposta").classList.remove("hidden");
}

function fecharFormulario() {
    apostaSelecionada = null;
    document.getElementById("form-aposta").classList.add("hidden");
}

async function confirmarAposta(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const valor = document.getElementById("valor").value;
    const eventId = apostaSelecionada; 

    // o login nao está retornando o userId, apenas o token, isso precisa ser feito para esse endpoint funcionar 
    const userId = localStorage.getItem("userId");

    if (!userId) {
        console.error("Usuário não encontrado no localStorage");
        return;
    }

    try {
        const response = await fetch(`${apiUrlEndPoint}/betOnEvent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                eventId,
                betAmount: valor,
            }),
        });

        if (!response.ok) throw new Error("Erro ao apostar");

        const data = await response.json();
        console.log("Aposta confirmada:", data.message);

        fecharFormulario();
        carregarApostas();
    } catch (error) {
        console.error("Erro ao confirmar aposta:", error);
    }
}


async function cancelarAposta(id) {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        console.error("Usuário não encontrado no localStorage");
        return;
    }

    try {
        const response = await fetch(`${apiUrlEndPoint}/deleteEvent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventId: id, 
                userId: userId, 
            }),
        });

        if (!response.ok) {
            throw new Error("Erro ao cancelar aposta");
        }

        const data = await response.json();
        console.log(data.message);

        carregarApostas(); 
    } catch (error) {
        console.error("Erro ao cancelar aposta:", error);
    }
}



const toggleAside = () => {
    const aside = document.querySelector('.aside');
    aside.classList.toggle('hidden');
};

function logout() {
    alert("Logout realizado com sucesso!");
}

document.getElementById("aposta-form").addEventListener("submit", confirmarAposta);

