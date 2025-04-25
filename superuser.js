// DOM Elements
const roleItems = document.querySelectorAll('.role-item');
const accessItems = document.querySelectorAll('.access-item');
const settingsForms = document.querySelectorAll('.settings-form');
const backupBtn = document.querySelector('.backup-btn');
const policyBtn = document.querySelector('.policy-btn');

// Handle role editing
function handleRoleEdit(event) {
    const roleItem = event.currentTarget.parentElement;
    const roleName = roleItem.querySelector('span').textContent;
    
    // Show edit modal or form (to be implemented)
    console.log(`Editing role: ${roleName}`);
}

// Handle access control toggle
function handleAccessToggle(event) {
    const accessItem = event.currentTarget.parentElement;
    const accessName = accessItem.querySelector('span').textContent;
    const isEnabled = event.target.checked;
    
    // Update access control (to be implemented)
    console.log(`${accessName} access ${isEnabled ? 'enabled' : 'disabled'}`);
}

// Handle settings form submission
function handleSettingsSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Update settings (to be implemented)
    console.log('Settings updated:', data);
    showSuccess('Settings updated successfully');
}

// Handle backup
function handleBackup() {
    // Simulate backup process
    backupBtn.disabled = true;
    backupBtn.textContent = 'Backing up...';
    
    setTimeout(() => {
        backupBtn.disabled = false;
        backupBtn.textContent = 'Backup Now';
        showSuccess('Backup completed successfully');
    }, 2000);
}

// Handle password policy configuration
function handlePasswordPolicy() {
    // Show password policy modal (to be implemented)
    console.log('Configuring password policy');
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Event Listeners
roleItems.forEach(item => {
    const editBtn = item.querySelector('.edit-btn');
    editBtn.addEventListener('click', handleRoleEdit);
});

accessItems.forEach(item => {
    const toggle = item.querySelector('input[type="checkbox"]');
    toggle.addEventListener('change', handleAccessToggle);
});

settingsForms.forEach(form => {
    form.addEventListener('submit', handleSettingsSubmit);
});

if (backupBtn) {
    backupBtn.addEventListener('click', handleBackup);
}

if (policyBtn) {
    policyBtn.addEventListener('click', handlePasswordPolicy);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here
    console.log('Superuser dashboard initialized');
}); 