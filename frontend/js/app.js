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

// Função para adicionar fundos
async function addFunds(userId, amount, creditCardDetails) {
  try {
    const response = await fetch(`${API_BASE_URL}/add-funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Use o token armazenado
      },
      body: JSON.stringify({
        userId,
        amount,
        creditCardDetails
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar fundos: ' + response.statusText);
    }

    const data = await response.json();
    console.log(data.message); // Mensagem de sucesso
    alert("Fundos adicionados com sucesso!");
  } catch (error) {
    console.error('Erro:', error);
    alert("Erro ao adicionar fundos: " + error.message);
  }
}

// Manipulador de evento para o formulário de adicionar fundos
document.addEventListener("DOMContentLoaded", () => {
  const addFundsForm = document.getElementById("addFundsForm");

  if (addFundsForm) {
    addFundsForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Impede o envio padrão do formulário

      const userId = localStorage.getItem("userId"); // Obtenha o ID do usuário do localStorage
      const amount = parseFloat(document.getElementById("addAmount").value); // Obtenha o valor a ser adicionado
      const creditCardDetails = {
        card_number: document.getElementById("cardNumber").value,
        expiry_date: document.getElementById("expiryDate").value,
        cvv: document.getElementById("cvv").value
      };

      await addFunds(userId, amount, creditCardDetails);
    });
  } else {
    console.error("Formulário de adicionar fundos não encontrado!");
  }
});

// Função para retirar fundos
async function withdrawFunds(userId, amount, bankDetails) {
  try {
    const response = await fetch(`${API_BASE_URL}/withdraw-funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Use o token armazenado
      },
      body: JSON.stringify({
        userId,
        amount,
        bankDetails
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao retirar fundos: ' + response.statusText);
    }

    const data = await response.json();
    console.log(data.message); // Mensagem de sucesso
    alert("Fundos retirados com sucesso!");
  } catch (error) {
    console.error('Erro:', error);
    alert("Erro ao retirar fundos: " + error.message);
  }
}

// Adicionar manipulador de evento para o formulário de retirar fundos
document.addEventListener("DOMContentLoaded", () => {
  const withdrawFundsForm = document.getElementById("withdrawFundsForm");

  if (withdrawFundsForm) {
    withdrawFundsForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Impede o envio padrão do formulário

      const userId = localStorage.getItem("userId"); // Obtenha o ID do usuário do localStorage
      const amount = parseFloat(document.getElementById("withdrawAmount").value); // Obtenha o valor a ser retirado
      const bankDetails = {
        bank_name: document.getElementById("withdrawBankName").value,
        agency_number: document.getElementById("withdrawAgencyNumber").value,
        account_number: document.getElementById("withdrawAccountNumber").value,
        pix_key: document.getElementById("withdrawPixKey").value
      };

      await withdrawFunds(userId, amount, bankDetails);
    });
  } else {
    console.error("Formulário de retirar fundos não encontrado!");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente carregado.");
  const userId = localStorage.getItem("userId");

  if (userId) {
    // Função para buscar transações
    async function fetchTransactions(userId) {
      try {
        const token = localStorage.getItem("userToken");
        if (!token || !userId) {
          throw new Error("Token ou ID do usuário não encontrados");
        }

        const response = await fetch(`${API_BASE_URL}/transactions/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao buscar transações');
        }

        const transactions = await response.json();
        return transactions;
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
        alert("Erro ao buscar transações: " + error.message);
        return [];
      }
    }

    // Função para renderizar transações na tabela
    function renderTransactions(transactions) {
      const transactionsTableBody = document.querySelector("#transaction-history tbody");
      console.log(transactionsTableBody);
      if (!transactionsTableBody) {
        console.error("Elemento tbody não encontrado!");
        return;
      }
      
      console.log("Transações recebidas:", transactions); // Log para verificar os dados
  
      // Limpar as transações anteriores (caso haja)
      transactionsTableBody.innerHTML = "";
  
      if (transactions.length === 0) {
        transactionsTableBody.innerHTML = `<tr><td colspan="4" class="text-center">Sem transações encontradas.</td></tr>`;
      } else {
        transactions.forEach(transaction => {
          const transactionType = transaction.transaction_type === 'deposito' ? 'Depósito' : 'Retirada';
          const formattedAmount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount);
          const formattedDate = new Date(transaction.created_at).toLocaleString('pt-BR');
  
          // Criar uma nova linha da tabela
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transactionType}</td>
            <td>${formattedAmount}</td>
          `;
          
          // Adicionar a linha à tabela
          transactionsTableBody.appendChild(row);
        });
      }
    }    

    // Buscar transações e renderizá-las
    fetchTransactions(userId).then(transactions => {
      renderTransactions(transactions); // Renderiza as transações na tabela
    });
  } else {
    console.error("ID do usuário não encontrado no localStorage");
  }
});

// function loadPurchaseHistory() {
//   const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
//   const purchaseTableBody = document.getElementById('purchase-history').querySelector('tbody');

//   purchaseHistory.forEach(purchase => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//           <td>${new Date(purchase.date).toLocaleDateString()}</td>
//           <td>${purchase.amount.toFixed(2)}</td>
//           <td>${purchase.status}</td>
//       `;
//       purchaseTableBody.appendChild(row);
//   });
// }

// function loadCreditUsageHistory() {
//   const creditUsageHistory = JSON.parse(localStorage.getItem('creditUsageHistory')) || [];
//   const creditTableBody = document.getElementById('credit-usage-history').querySelector('tbody');

//   creditUsageHistory.forEach(usage => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//           <td>${new Date(usage.date).toLocaleDateString()}</td>
//           <td>${usage.amount.toFixed(2)}</td>
//           <td>${usage.result}</td>
//       `;
//       creditTableBody.appendChild(row);
//   });
// }

// // Chame as funções ao carregar a página
// window.addEventListener('load', () => {
//   loadPurchaseHistory();
//   loadCreditUsageHistory();
// });