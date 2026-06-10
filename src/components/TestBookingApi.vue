<template>
  <div class="api-test-panel">
    <h2>🧪 Prueba del Snippet de RapidAPI</h2>
    
    <div class="config-box">
      <p><strong>Endpoint:</strong> {{ url }}</p>
      <p><strong>Host:</strong> {{ host }}</p>
    </div>

    <div class="actions">
      <button class="btn btn-primary" @click="executeSnippet" :disabled="loading">
        {{ loading ? 'Ejecutando...' : 'Ejecutar Snippet' }}
      </button>
    </div>

    <div v-if="error" class="error-box">
      ⚠️ {{ error }}
    </div>

    <div v-if="resultText" class="results-box">
      <h3>Respuesta de la API:</h3>
      <pre>{{ resultText }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 1. EXTRAÍDO DEL SNIPPET: La URL exacta a la que quieres llamar
const url = 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query=new';

// 2. EXTRAÍDO DEL SNIPPET: El Host exacto de esta API
const host = 'booking-com15.p.rapidapi.com';

// Variables para la interfaz
const loading = ref(false);
const error = ref(null);
const resultText = ref('');

async function executeSnippet() {
  loading.value = true;
  error.value = null;
  resultText.value = '';

  try {
    // 3. EXTRAÍDO DEL SNIPPET: La Key, pero en lugar de ponerla en el código
    // a la vista de todos, la leemos de forma segura del archivo .env
    const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
    
    if (!apiKey) {
      throw new Error('No se ha encontrado VITE_RAPIDAPI_KEY en tu archivo .env. Por favor, añádelo.');
    }

    // 4. EXTRAÍDO DEL SNIPPET: El objeto options adaptado a Vue (Fetch API nativa)
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': host,
        'Content-Type': 'application/json'
      }
    };

    // 5. EXTRAÍDO DEL SNIPPET: La ejecución del fetch
    const response = await fetch(url, options);
    
    // 6. EXTRAÍDO DEL SNIPPET: Leer el resultado como texto
    const result = await response.text();
    
    // En lugar de console.log(result), lo guardamos para mostrarlo en pantalla
    resultText.value = result;
    console.log("Respuesta recibida:", result);

  } catch (err) {
    // En lugar de console.error(error), lo mostramos en pantalla
    error.value = err.message;
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.api-test-panel {
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid #4ade80;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  color: white;
  font-family: monospace;
}

.config-box p {
  margin: 5px 0;
  color: #9ca3af;
}

.actions {
  margin-top: 20px;
}

.btn {
  padding: 12px 24px;
  background: #4ade80;
  color: #000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.btn:disabled {
  opacity: 0.5;
}

.error-box {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 50, 50, 0.2);
  border: 1px solid rgba(255, 50, 50, 0.5);
  border-radius: 6px;
}

.results-box {
  margin-top: 20px;
  padding: 15px;
  background: #000;
  border-radius: 6px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #333;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
