document.getElementById('askForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const question = document.getElementById('questionInput').value;
    const resultDiv = document.getElementById('result');
    
    // Show loading message
    const loadingMessages = [
      '🧠 Deciphering the mysteries of the universe...',
      '⚡ Connecting with cosmic wisdom...',
      '🔮 Consulting digital oracles...',
      '🤔 Deeply contemplating your doubt...',
      '🧪 Mixing magical algorithms...'
    ];
    
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    resultDiv.textContent = randomMessage;
    
    // Loading animation
    let dots = '';
    const loadingInterval = setInterval(() => {
      dots = dots.length < 3 ? dots + '.' : '';
      resultDiv.textContent = randomMessage + dots;
    }, 500);
    
    // Function to make request with retries
    const fetchWithRetry = async (url, options, maxRetries = 3) => {
      let lastError;
      
      for (let i = 0; i < maxRetries; i++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
          
          const fetchOptions = {
            ...options,
            signal: controller.signal
          };
          
          const response = await fetch(url, fetchOptions);
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          
          return await response.json();
        } catch (error) {
          console.log(`Attempt ${i + 1} failed:`, error.message);
          lastError = error;
          
          // If it's not a timeout error, don't retry
          if (error.name !== 'AbortError' && error.message.indexOf('504') === -1) {
            throw error;
          }
          
          // Wait before retrying (exponential backoff)
          if (i < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            resultDiv.textContent = `Retrying connection (${i + 2}/${maxRetries})...`;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      throw lastError;
    };
    
    try {
      const apiUrl = 'https://callfunctionbackend-1.onrender.com/ask?question=' + encodeURIComponent(question);
      
      console.log("Connecting to:", apiUrl);
      
      const data = await fetchWithRetry(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        mode: 'cors'
      });
      
      // Display response
      resultDiv.textContent = data.response;
      
    } catch (error) {
      resultDiv.textContent = `Error: ${error.message}`;
      console.error("Full error:", error);
    } finally {
      clearInterval(loadingInterval);
    }
});
