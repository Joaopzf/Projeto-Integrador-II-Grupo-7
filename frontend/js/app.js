const API_BASE_URL = "http://localhost:3000/api"; // URL do backend

// Função de login
document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();  // Impede o envio padrão do formulário

      // Dados do formulário de login
      const loginData = {
        email: document.getElementById("email").value,
        password: document.getElementById("senha").value,
      };

      try {
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Login bem-sucedido!");
          // Redirecionar ou fazer algo após o login bem-sucedido
        } else {
          alert(data.error || "Erro ao fazer login.");
        }
      } catch (error) {
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


