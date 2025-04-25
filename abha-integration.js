// DOM Elements
const connectAbhaBtn = document.getElementById('connectAbhaBtn');
const createAbhaBtn = document.getElementById('createAbhaBtn');
const abhaStatus = document.getElementById('abhaStatus');
const abhaConnectModal = document.getElementById('abhaConnectModal');
const abhaCreateModal = document.getElementById('abhaCreateModal');
const closeButtons = document.querySelectorAll('.close');
const faqItems = document.querySelectorAll('.faq-item');

// Check ABHA connection status
function checkAbhaStatus() {
    const isConnected = localStorage.getItem('abhaConnected') === 'true';
    if (isConnected) {
        abhaStatus.textContent = 'Connected';
        abhaStatus.style.color = '#4CAF50';
        connectAbhaBtn.textContent = 'Disconnect ABHA';
        connectAbhaBtn.innerHTML = '<i class="fas fa-unlink"></i> Disconnect ABHA';
    } else {
        abhaStatus.textContent = 'Not Connected';
        abhaStatus.style.color = '#666';
        connectAbhaBtn.textContent = 'Connect ABHA';
        connectAbhaBtn.innerHTML = '<i class="fas fa-link"></i> Connect ABHA';
    }
}

// Toggle ABHA connection
function toggleAbhaConnection() {
    const isConnected = localStorage.getItem('abhaConnected') === 'true';
    if (isConnected) {
        // Disconnect ABHA
        localStorage.setItem('abhaConnected', 'false');
        showSuccess('ABHA disconnected successfully');
    } else {
        // Show connect modal
        abhaConnectModal.style.display = 'block';
    }
    checkAbhaStatus();
}

// Show create ABHA modal
function showCreateAbhaModal() {
    abhaCreateModal.style.display = 'block';
}

// Close modals
function closeModals() {
    abhaConnectModal.style.display = 'none';
    abhaCreateModal.style.display = 'none';
}

// Handle ABHA connection form submission
function handleAbhaConnect(event) {
    event.preventDefault();
    const abhaId = event.target.querySelector('input').value;
    
    // Validate ABHA ID (simple validation for demo)
    if (abhaId.length < 10) {
        showError('Please enter a valid ABHA ID');
        return;
    }

    // Store ABHA connection
    localStorage.setItem('abhaConnected', 'true');
    localStorage.setItem('abhaId', abhaId);
    
    closeModals();
    checkAbhaStatus();
    showSuccess('ABHA connected successfully');
}

// Handle ABHA creation form submission
function handleAbhaCreate(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form data
    if (!data.fullName || !data.aadhaar || !data.mobile) {
        showError('Please fill in all required fields');
        return;
    }

    // Simulate ABHA creation (in real app, this would call an API)
    setTimeout(() => {
        const abhaId = 'ABHA' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('abhaConnected', 'true');
        localStorage.setItem('abhaId', abhaId);
        
        closeModals();
        checkAbhaStatus();
        showSuccess('ABHA account created successfully');
    }, 1500);
}

// Toggle FAQ items
function toggleFaqItem(event) {
    const faqItem = event.currentTarget.parentElement;
    faqItem.classList.toggle('active');
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

// Event Listeners
connectAbhaBtn.addEventListener('click', toggleAbhaConnection);
createAbhaBtn.addEventListener('click', showCreateAbhaModal);

closeButtons.forEach(button => {
    button.addEventListener('click', closeModals);
});

document.querySelector('.abha-form').addEventListener('submit', handleAbhaConnect);
document.querySelector('.create-form').addEventListener('submit', handleAbhaCreate);

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', toggleFaqItem);
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === abhaConnectModal) {
        closeModals();
    }
    if (event.target === abhaCreateModal) {
        closeModals();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAbhaStatus();
}); 