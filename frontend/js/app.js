const API_BASE_URL = "http://localhost:3000/api"; // URL do backend

// Função de login
document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();  // Impede o envio padrão do formulário
      console.log("Formulário de login enviado");

      // Dados do formulário de login
      const loginData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      };

      try {
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        });
      
        // Verifique se a resposta do backend foi bem-sucedida
        console.log('Status da resposta:', response.status);
      
        if (response.ok) {
          const data = await response.json();
          console.log("Resposta do backend:", data); // Aqui você verá o token gerado
          
          // Verifica se o token está sendo retornado corretamente
          if (data.token) {
            localStorage.setItem("userToken", data.token); // Armazenando o token
            localStorage.setItem("userId", data.userId); 
            console.log("Token armazenado no localStorage:", localStorage.getItem("userToken"));
            alert("Login bem-sucedido!");
            console.log("Redirecionando para: http://localhost:3001/homepage/index.html");
            window.location.href = "http://localhost:3001/homepage/index.html";            
          } else {
            console.error("Token não encontrado na resposta");
            alert("Erro: O token não foi gerado.");
          }
        } else {
          alert(data.error || "Erro ao fazer login.");
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao tentar fazer login: " + error.message);
      }      
    });
  } else {
    console.error("Formulário de login não encontrado!");
  }
});

//Função de cadastro
document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const errorMessage = document.getElementById("errorMessage");

  // Verifica se o formulário de cadastro existe
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Impede o envio padrão do formulário

      // Dados do formulário de cadastro
      const userData = {
        username: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("senha").value.trim(),
        confirmPassword: document.getElementById("confirmarSenha").value.trim(),
        date_of_birth: document.getElementById("dataNascimento").value || null,
      };

      // Verifica se as senhas coincidem
      if (userData.password !== userData.confirmPassword) {
        errorMessage.textContent = "As senhas não coincidem.";
        errorMessage.style.display = "block";
        return;
      }

      try {
        // Envia os dados para o backend
        const response = await fetch(`${API_BASE_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Cadastro realizado com sucesso!");
          window.location.href = "login.html"; // Redireciona para login
        } else {
          errorMessage.textContent = data.error || "Erro ao cadastrar.";
          errorMessage.style.display = "block";
        }
      } catch (error) {
        errorMessage.textContent = "Erro ao se conectar com o servidor.";
        errorMessage.style.display = "block";
      }
    });
  } else {
    console.error("Formulário de cadastro não encontrado!");
  }
});

// Função para buscar eventos
async function fetchEvents(query = "") {
  try {
    const response = await fetch(`${API_BASE_URL}/events?search=${encodeURIComponent(query)}`);
    console.log("Resposta bruta da API:", response); // Log para verificar a resposta
    if (!response.ok) throw new Error("Failed to fetch events.");
    const events = await response.json();
    console.log("Eventos retornados:", events); // Log para verificar os eventos retornados
    return events;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
}


// Renderizar eventos no HTML
function renderEvents(events) {
  const eventsContainer = document.querySelector(".events-container");
  console.log("Renderizando eventos:", events);
  if (events.length === 0) {
    eventsContainer.innerHTML = `<p class="text-center">No events found.</p>`;
  } else {
    eventsContainer.innerHTML = events
      .map(
        (event) => `
        <div class="card m-2" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">${event.name}</h5>
            <p class="card-text">${event.description}</p>
            <a href="#" class="btn btn-primary">Bet Now</a>
          </div>
        </div>`
      )
      .join("");
  }
}

// Função para lidar com a busca de eventos ao clicar no botão "Search"
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("input[type='text']");
  const searchButton = document.querySelector(".btn-custom");

  searchButton.addEventListener("click", async () => {
    const searchTerm = searchInput.value.trim();
    const events = await fetchEvents(searchTerm); // Busca os eventos
    renderEvents(events); // Renderiza os eventos na página
  });

  // Opcional: carregar eventos ao inicializar a página, se desejar mostrar todos
  fetchEvents().then((events) => {
    renderEvents(events);
  });
});

//Função de atualizar saldo
document.addEventListener("DOMContentLoaded", () => {
  const balanceElement = document.getElementById("balance");
  const loadingElement = document.getElementById("loading");
  const errorMessageElement = document.getElementById("error-message");

  const updateBalance = async () => {
      try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token não encontrado no localStorage");

          const userId = localStorage.getItem("userId");
          console.log("User  ID:", userId); 
          if (!userId) throw new Error("ID do usuário não encontrado no localStorage");

          if (loadingElement) {
              loadingElement.style.display = "block";
          }

          console.log(`Acessando URL: http://localhost:3000/api/wallet/${userId}/balance`);
          const response = await fetch(`http://localhost:3000/api/wallet/${userId}/balance`, {
              headers: { 'Authorization': `Bearer ${token}` },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Erro ${response.status}: ${errorText}`);
            throw new Error(`Erro ${response.status}: ${errorText}`);
          }

          const data = await response.json();
          console.log("Saldo recebido:", data);

          if (balanceElement) {
              balanceElement.textContent = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
              }).format(data.balance);
          } else {
              throw new Error("Elemento com ID 'balance' não encontrado");
          }
      } catch (error) {
          console.error("Erro ao buscar o saldo:", error);
          if (errorMessageElement) {
              errorMessageElement.textContent = "Erro ao carregar o saldo.";
              errorMessageElement.style.display = "block";
          }
      } finally {
          if (loadingElement) {
              loadingElement.style.display = "none";
          }
      }
  };

  // Chamar a função para atualizar o saldo ao carregar a página
  updateBalance();
});

//Função para botao da carteira
document.addEventListener("DOMContentLoaded", function() {
  const walletButton = document.getElementById("walletButton");
  if (walletButton) {
    walletButton.addEventListener("click", function() {
      window.location.href = "http://localhost:3001/wallet/wallets.html"; 
    });
  } else {
    console.error("Botão da carteira não encontrado!");
  }
});




