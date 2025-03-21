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
    
    // Crear un conteo animado de puntos para indicar carga
    let dots = '';
    const loadingInterval = setInterval(() => {
      dots = dots.length < 3 ? dots + '.' : '';
      resultDiv.textContent = mensajeAleatorio + dots;
    }, 500);
    
    try {
      // URL usando el formato correcto para la consulta
      const apiUrl = 'https://callfunctions-backend.vercel.app/ask?question=' + encodeURIComponent(question);
      
      console.log("Conectando a:", apiUrl);
      
      // Crear un controlador de aborto para manejar timeouts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos de timeout
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal,
        mode: 'cors' // Asegurarse de que se maneje CORS correctamente
      });
      
      // Limpiar el timeout ya que la operación completó
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 504) {
          throw new Error("El servidor tardó demasiado en responder. Por favor, inténtalo de nuevo más tarde.");
        } else {
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      
      // Mostrar la respuesta completa
      resultDiv.textContent = data.response;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        resultDiv.textContent = "La conexión tardó demasiado. Verifica tu conexión a internet o intenta más tarde.";
      } else {
        resultDiv.textContent = `Error: ${error.message}`;
      }
      console.error("Error completo:", error);
    } finally {
      clearInterval(loadingInterval);
    }
});