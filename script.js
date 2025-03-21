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
      // URL del backend en Vercel (deberás actualizarla con tu dominio real)
      const backendUrl = 'https://callfunctions-backend.vercel.app/ask?question=' + encodeURIComponent(question);
      // Alternativa para desarrollo local
      // const backendUrl = 'http://localhost:3000/ask?question=' + encodeURIComponent(question);
      
      const response = await fetch(backendUrl);
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      const data = await response.json();
      
      // Mostrar la respuesta completa
      resultDiv.textContent = data.response;
      
    } catch (error) {
      resultDiv.textContent = 'Error obteniendo la respuesta';
      console.error(error);
    }
  });