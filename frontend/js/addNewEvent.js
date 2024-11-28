const API_BASE_URL = "http://localhost:3000/api"; // URL do backend

document.addEventListener("DOMContentLoaded", () => {
  const addEventForm = document.getElementById("addEventForm");
  const errorMessage = document.getElementById("errorMessage");

  // Função para validar as datas
  function validateDates(betStart, betEnd, eventDate) {
    const now = new Date();
    if (new Date(betStart) <= now) {
      return "A data de início da aposta deve ser no futuro.";
    }
    if (new Date(betEnd) <= new Date(betStart)) {
      return "A data de fim da aposta deve ser após a data de início.";
    }
    if (new Date(eventDate) <= new Date(betEnd)) {
      return "A data do evento deve ser após a data de fim das apostas.";
    }
    return null;
  }

  // Manipular envio do formulário
  addEventForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMessage.style.display = "none"; // Ocultar mensagens de erro anteriores

    const eventData = {
      name: document.getElementById("name").value.trim(),
      description: document.getElementById("shortDescription").value.trim(),
      quota: parseFloat(document.getElementById("quotaValue").value),
      betStartDate: document.getElementById("betStartDate").value,
      betEndDate: document.getElementById("betEndDate").value,
      eventDate: document.getElementById("eventDate").value,
    };

    // Verificar se os campos obrigatórios estão preenchidos
    const requiredFields = ['name', 'description', 'quota', 'betStartDate', 'betEndDate', 'eventDate'];
    for (let field of requiredFields) {
      if (!eventData[field]) {
        errorMessage.textContent = `${field} é obrigatório.`;
        errorMessage.style.display = "block";
        return;
      }
    }

    // Validar datas
    const dateError = validateDates(
      eventData.betStartDate,
      eventData.betEndDate,
      eventData.eventDate
    );
    if (dateError) {
      errorMessage.textContent = dateError;
      errorMessage.style.display = "block";
      return;
    }

    // Função para converter para o formato ISO com o horário local
    function convertToLocalISOString(dateStr) {
      const localDate = new Date(dateStr);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset()); // Ajusta para o horário local
      return localDate.toISOString().slice(0, 19) + ".000"; // Retorna a string ISO sem o "Z" no final
    }

    // Converter as datas para o formato ISO com o horário local
    const betStartDateISO = convertToLocalISOString(eventData.betStartDate);
    const betEndDateISO = convertToLocalISOString(eventData.betEndDate);
    const eventDateISO = convertToLocalISOString(eventData.eventDate);

    console.log("Dados do evento:", eventData);
    console.log("Data de início da aposta:", betStartDateISO);
    console.log("Data de fim da aposta:", betEndDateISO);
    console.log("Data do evento:", eventDateISO);

    try {
      // Obter o userId do localStorage
      const userId = localStorage.getItem("userId").trim();
      if (!userId) throw new Error("Você não está autenticado.");

      // Enviar a requisição com o userId
      console.log(`Enviando requisição para: ${API_BASE_URL}/addNewEvent/${userId}`);
      const response = await fetch(`${API_BASE_URL}/addNewEvent/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          ...eventData,
          createdBy: userId,
          betStartDate: betStartDateISO,
          betEndDate: betEndDateISO,
          eventDate: eventDateISO,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        throw new Error(errorData.message || "Falha ao criar evento.");
      }

      const responseData = await response.json();
      alert(`Evento criado com sucesso! ID do evento: ${responseData.eventId}`);
      window.location.href = "../homepage/index.html"; // Redireciona após sucesso
    } catch (error) {
      console.error("Erro ao enviar o evento:", error);
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    }
  });
});
