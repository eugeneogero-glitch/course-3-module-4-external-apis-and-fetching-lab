document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#weather-form');
  const stateInput = document.querySelector('#state-input');
  const alertsContainer = document.querySelector('#alerts-display') || document.querySelector('#alerts-container');
  const errorMessageDiv = document.querySelector('#error-message');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const state = stateInput ? stateInput.value.trim().toUpperCase() : '';
      
      clearUI();

      if (!state) {
        showError("Please enter a valid state abbreviation.");
        return;
      }

      fetchWeatherAlerts(state);
    });
  }

  function fetchWeatherAlerts(state) {
    const url = `https://api.weather.gov/alerts/active?area=${state}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok (Status: ${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        displayAlerts(data, state);
        
        if (stateInput) stateInput.value = '';

        const errorDiv = document.querySelector('#error-message');
        if (errorDiv) {
          errorDiv.textContent = '';
          errorDiv.classList.add('hidden');
        }
      })
      .catch((errorObject) => {
        console.log(errorObject.message);
        showError(errorObject.message);
      });
  }

  function displayAlerts(data, state) {
    const container = document.querySelector('#alerts-display') || alertsContainer;
    if (!container) return;
    container.innerHTML = '';

    const title = data.title || `Current watches, warnings, and advisories for ${state}`;
    const count = data.features ? data.features.length : 0;

    const summaryElem = document.createElement('h3');
    summaryElem.textContent = `${title}: ${count}`;
    container.appendChild(summaryElem);

    const listElem = document.createElement('ul');
    if (data.features && data.features.length > 0) {
      data.features.forEach((feature) => {
        const listItem = document.createElement('li');
        listItem.textContent = feature.properties.headline || 'No headline available';
        listElem.appendChild(listItem);
      });
    }
    container.appendChild(listElem);
  }

  function clearUI() {
    const container = document.querySelector('#alerts-display') || alertsContainer;
    if (container) container.innerHTML = '';
    
    const errorDiv = document.querySelector('#error-message') || errorMessageDiv;
    if (errorDiv) {
      errorDiv.textContent = '';
      errorDiv.classList.add('hidden');
    }
  }

  function showError(message) {
    const errorDiv = document.querySelector('#error-message') || errorMessageDiv;
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
    }
  }
});