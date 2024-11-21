const API_BASE_URL = "http://localhost:3000";

// Função para atualizar o saldo na interface
const updateBalance = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/walletBalance?userId=1`);
    const data = await response.json();

    if (response.ok) {
      document.getElementById("balance").innerText = `R$ ${data.balance.toFixed(2)}`;
    } else {
      throw new Error(data.error || "Erro ao obter saldo.");
    }
  } catch (error) {
    console.error("Erro ao atualizar saldo:", error);
    alert("Erro ao carregar saldo.");
  }
};

// Handler para adicionar fundos
document.getElementById("addFundsForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const amount = parseFloat(document.getElementById("addAmount").value);
  const bankDetails = {
    bank_name: document.getElementById("bankName").value,
    agency_number: document.getElementById("agencyNumber").value,
    account_number: document.getElementById("accountNumber").value,
    pix_key: document.getElementById("pixKey").value,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/addFunds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, amount, bankDetails }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      updateBalance();
    } else {
      throw new Error(data.error || "Erro desconhecido.");
    }
  } catch (error) {
    alert(`Erro ao adicionar fundos: ${error.message}`);
  }
});

// Handler para sacar fundos
document.getElementById("withdrawFundsForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const amount = parseFloat(document.getElementById("withdrawAmount").value);
  const bankDetails = {
    bank_name: document.getElementById("withdrawBankName").value,
    agency_number: document.getElementById("withdrawAgencyNumber").value,
    account_number: document.getElementById("withdrawAccountNumber").value,
    pix_key: document.getElementById("withdrawPixKey").value,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, amount, bankDetails }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      updateBalance();
    } else {
      throw new Error(data.error || "Erro desconhecido.");
    }
  } catch (error) {
    alert(`Erro ao sacar fundos: ${error.message}`);
  }
});

// Inicializa o saldo na interface ao carregar a página
updateBalance();
