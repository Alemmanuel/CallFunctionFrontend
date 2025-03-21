document.getElementById('askForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const question = document.getElementById('questionInput').value;
    const resultDiv = document.getElementById('result');
    
    // Mostrar mensaje de carga
    const mensajesCarga = [
      '🧠 Descifrando los misterios del universo...',
      '⚡ Conectando con la sabiduría cósmica...',
      '🔮 Consultando a los oráculos digitales...',
      '🤔 Meditando profundamente sobre tu duda...',
      '🧪 Mezclando algoritmos mágicos...'
    ];
    
    const mensajeAleatorio = mensajesCarga[Math.floor(Math.random() * mensajesCarga.length)];
    resultDiv.textContent = mensajeAleatorio;
    
    // Animación de carga
    let dots = '';
    const loadingInterval = setInterval(() => {
      dots = dots.length < 3 ? dots + '.' : '';
      resultDiv.textContent = mensajeAleatorio + dots;
    }, 500);
    
    // Función para hacer la petición con reintentos
    const fetchWithRetry = async (url, options, maxRetries = 3) => {
      let lastError;
      
      for (let i = 0; i < maxRetries; i++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout
          
          const fetchOptions = {
            ...options,
            signal: controller.signal
          };
          
          const response = await fetch(url, fetchOptions);
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
          }
          
          return await response.json();
        } catch (error) {
          console.log(`Intento ${i + 1} fallido:`, error.message);
          lastError = error;
          
          // Si no es un error de timeout, no reintentar
          if (error.name !== 'AbortError' && error.message.indexOf('504') === -1) {
            throw error;
          }
          
          // Esperar antes de reintentar (tiempo exponencial de espera)
          if (i < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            resultDiv.textContent = `Reintentando conexión (${i + 2}/${maxRetries})...`;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      throw lastError;
    };
    
    try {
      const apiUrl = 'https://callfunctionbackend-1.onrender.com/ask?question=' + encodeURIComponent(question);
      
      console.log("Conectando a:", apiUrl);
      
      const data = await fetchWithRetry(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        mode: 'cors'
      });
      
      // Mostrar la respuesta
      resultDiv.textContent = data.response;
      
    } catch (error) {
      resultDiv.textContent = `Error: ${error.message}`;
      console.error("Error completo:", error);
    } finally {
      clearInterval(loadingInterval);
    }
});