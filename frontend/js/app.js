const API_BASE_URL = "http://localhost:3000/api"; // URL do backend

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

document.addEventListener("DOMContentLoaded", () => {
  const balanceElement = document.getElementById("balance");
  const loadingElement = document.getElementById("loading");
  const errorMessageElement = document.getElementById("error-message");

  // Função para atualizar o saldo
  const updateBalance = async () => {
    try {
      const response = await fetch('/api/wallet'); // Ajuste para a URL correta
      if (!response.ok) throw new Error('Erro ao buscar o saldo');
      const data = await response.json();
      balanceElement.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.balance);
    } catch (error) {
      console.error(error);
      errorMessageElement.textContent = "Erro ao carregar o saldo.";
      errorMessageElement.style.display = "block";
    }
  };

  // Adicionar fundos
  document.getElementById("addFundsForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    loadingElement.style.display = "block";

    const amount = parseFloat(document.getElementById("addAmount").value);
    const cardNumber = document.getElementById("cardNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    // Validação de dados
    if (isNaN(amount) || amount <= 0) {
      errorMessageElement.textContent = "Por favor, insira um valor válido.";
      errorMessageElement.style.display = "block";
      loadingElement.style.display = "none";
      return;
    }

    try {
      const response = await fetch('/api/addFunds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, cardNumber, expiryDate, cvv })
      });

      if (!response.ok) throw new Error('Erro ao adicionar fundos');

      await updateBalance(); // Atualiza o saldo após adicionar fundos
      document.getElementById("addFundsForm").reset(); // Limpa o formulário
      alert("Fundos adicionados com sucesso!"); // Mensagem de sucesso
    } catch (error) {
      console.error(error);
      errorMessageElement.textContent = "Erro ao adicionar fundos.";
      errorMessageElement.style.display = "block";
    } finally {
      loadingElement.style.display = "none";
    }
  });

  // Retirar fundos
  document.getElementById("withdrawFundsForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    loadingElement.style.display = "block";

    const amount = parseFloat(document.getElementById("withdrawAmount").value);
    const bankName = document.getElementById("withdrawBankName").value;
    const agencyNumber = document.getElementById("withdrawAgencyNumber").value;
    const accountNumber = document.getElementById("withdrawAccountNumber").value;
    const pixKey = document.getElementById("withdrawPixKey").value;

    // Validação de dados
    if (isNaN(amount) || amount <= 0) {
      errorMessageElement.textContent = "Por favor, insira um valor válido.";
      errorMessageElement.style.display = "block";
      loadingElement.style.display = "none";
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      console.error("Token não encontrado no localStorage");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          bankDetails: {
              bankName,
              agencyNumber,
              accountNumber,
              pixKey
          }
      })
  });

      const errorData = await response.json();
      if (!response.ok) {
          console.log("Erro do servidor:", errorData); // Log da resposta do servidor
          throw new Error(errorData.message || 'Erro ao retirar fundos');
      }

      await updateBalance(); // Atualiza o saldo após retirar fundos
      document.getElementById("withdrawFundsForm").reset(); // Limpa o formulário
      alert("Fundos retirados com sucesso!");
        alert("Fundos retirados com sucesso!"); // Mensagem de sucesso
      } catch (error) {
        console.error(error);
        errorMessageElement.textContent = "Erro ao retirar fundos.";
        errorMessageElement.style.display = "block";
      } finally {
        loadingElement.style.display = "none";
      }
  });
  
  // Atualiza o saldo ao carregar a página
  updateBalance();
});

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
          
          // Verifique se o token está sendo retornado corretamente
          if (data.token) {
            localStorage.setItem("userToken", data.token);  // Armazenando o token
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


