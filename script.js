document.getElementById('askForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const question = document.getElementById('questionInput').value;
    const resultDiv = document.getElementById('result');
    
    // Mensajes creativos para mostrar mientras carga
    const mensajesCarga = [
      '🧠 Descifrando los misterios del universo...',
      '⚡ Conectando con la sabiduría cósmica...',
      '🔮 Consultando a los oráculos digitales...',
      '🤔 Meditando profundamente sobre tu duda...',
      '🧪 Mezclando algoritmos mágicos...',
      '📊 Calculando probabilidades imposibles...',
      '🚀 Viajando a través del tiempo y el espacio...',
      '🔍 Buscando en dimensiones paralelas...',
      '💫 Canalizando energías ancestrales...',
      '⏳ Manipulando la matriz de la realidad...'
    ];
    
    // Seleccionar un mensaje aleatorio
    const mensajeAleatorio = mensajesCarga[Math.floor(Math.random() * mensajesCarga.length)];
    resultDiv.textContent = mensajeAleatorio;
    
    try {
      // URL CORREGIDA - usando el formato correcto para la consulta
      const apiUrl = 'https://callfunctions-backend.vercel.app/ask?question=' + encodeURIComponent(question);
      
      console.log("Conectando a:", apiUrl); // Para depuración
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      
      const data = await response.json();
      
      // Mostrar la respuesta completa
      resultDiv.textContent = data.response;
      
    } catch (error) {
      resultDiv.textContent = `Error: ${error.message}`;
      console.error("Error completo:", error);
    }
});