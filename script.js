import { API_URL } from './config.js';

const agifyNameInput = document.getElementById('agify-name-input');
const agifySubmitBtn = document.getElementById('agify-submit-btn');
const agifyLoader = document.getElementById('agify-loader');
const agifyButtonText = document.querySelector('.agify-button-text');
const agifyResultContainer = document.getElementById('agify-result-container');
const agifyErrorContainer = document.getElementById('agify-error-container');
const agifyResultName = document.getElementById('agify-result-name');
const agifyResultAge = document.getElementById('agify-result-age');
const agifyResultCount = document.getElementById('agify-result-count');
const agifyErrorMessage = document.getElementById('agify-error-message');

agifyNameInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        agifyHandleSubmit();
    }
});

agifyNameInput.addEventListener('input', function() {
    agifyNameInput.classList.remove('agify-input-error');
    agifyHideError();
});

agifySubmitBtn.addEventListener('click', function() {
    agifyHandleSubmit();
});

// Dito sa function na to, ito yung parang tinatawag pag nag-click ng button o nag-enter sa input
function agifyHandleSubmit() {
    const name = agifyNameInput.value.trim();
    
    agifyHideResults();
    
    if (!name) {
        agifyShowError('Please enter a name to predict the age');
        agifyNameInput.classList.add('agify-input-error');
        return;
    }
    
    agifyNameInput.classList.remove('agify-input-error');
    agifyHideError();
    agifyFetchAge(name);
}

// Dito sa function na to, ito yung parang nag-fetch sa API para makuha yung age
function agifyFetchAge(name) {
    agifySetLoading(true);
    agifyHideResults();
    agifyHideError();
    agifyNameInput.classList.remove('agify-input-error');
    
    const url = API_URL + '?name=' + encodeURIComponent(name);
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to connect to server');
            }
            return response.json();
        })
        .then(data => {
            agifyDisplayResult(data);
        })
        .catch(error => {
            agifyShowError('There was a problem fetching the data. Please try again later.');
        })
        .finally(() => {
            agifySetLoading(false);
        });
}

// Dito sa function na to, ganito-ganyan yung pagpapakita ng loading animation para hindi ma-double click yung button
function agifySetLoading(isLoading) {
    if (isLoading) {
        agifySubmitBtn.disabled = true;
        agifyButtonText.style.display = 'none';
        agifyLoader.style.display = 'inline-block';
    } else {
        agifySubmitBtn.disabled = false;
        agifyButtonText.style.display = 'inline';
        agifyLoader.style.display = 'none';
    }
}

// Dito sa function na to, ganito-ganyan yung pagpapakita ng result ng age prediction sa screen
function agifyDisplayResult(data) {
    agifyResultName.textContent = data.name || 'Unknown';
    agifyResultAge.textContent = data.age || 'N/A';
    
    const countText = data.count ? 'Based on ' + data.count.toLocaleString() + ' people' : 'No data available';
    agifyResultCount.textContent = countText;
    
    agifyResultContainer.style.display = 'block';
    agifyErrorContainer.style.display = 'none';
}

// Dito sa function na to, ganito-ganyan yung pagpapakita ng error message pag may problema
function agifyShowError(message) {
    agifyErrorMessage.textContent = message;
    agifyErrorContainer.style.display = 'block';
    agifyResultContainer.style.display = 'none';
}

function agifyHideResults() {
    agifyResultContainer.style.display = 'none';
}

function agifyHideError() {
    agifyErrorContainer.style.display = 'none';
}

