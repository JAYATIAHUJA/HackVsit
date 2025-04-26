// DOM Elements
const roleItems = document.querySelectorAll('.role-item');
const accessItems = document.querySelectorAll('.access-item');
const settingsForms = document.querySelectorAll('.settings-form');
const backupBtn = document.querySelector('.backup-btn');
const policyBtn = document.querySelector('.policy-btn');
const userList = document.querySelector('.user-list');
const activityLog = document.querySelector('.activity-log');

// API Functions
async function fetchUsers() {
    try {
        const response = await fetch('/api/superuser/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        showError('Failed to fetch users');
        console.error('Error:', error);
    }
}

async function updateUserRole(userId, role) {
    try {
        const response = await fetch('/api/superuser/user/role', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId, role })
        });
        if (response.ok) {
            showSuccess('User role updated successfully');
            fetchUsers(); // Refresh user list
        } else {
            throw new Error('Failed to update user role');
        }
    } catch (error) {
        showError(error.message);
        console.error('Error:', error);
    }
}

async function fetchActivityLog() {
    try {
        const response = await fetch('/api/superuser/activity-log', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const logs = await response.json();
        displayActivityLog(logs);
    } catch (error) {
        showError('Failed to fetch activity logs');
        console.error('Error:', error);
    }
}

async function createBackup() {
    try {
        const response = await fetch('/api/superuser/system-backup', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const result = await response.json();
            showSuccess('Backup created successfully');
            console.log('Backup path:', result.path);
        } else {
            throw new Error('Failed to create backup');
        }
    } catch (error) {
        showError(error.message);
        console.error('Error:', error);
    }
}

async function updateSystemSetting(setting, value) {
    try {
        const response = await fetch('/api/superuser/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ setting, value })
        });
        if (response.ok) {
            showSuccess('Setting updated successfully');
        } else {
            throw new Error('Failed to update setting');
        }
    } catch (error) {
        showError(error.message);
        console.error('Error:', error);
    }
}

// Display Functions
function displayUsers(users) {
    if (!userList) return;
    
    userList.innerHTML = users.map(user => `
        <div class="user-item" data-id="${user.id}">
            <div class="user-info">
                <h4>${user.full_name}</h4>
                <p>${user.email}</p>
                <span class="user-role">${user.role}</span>
            </div>
            <div class="user-actions">
                <select class="role-select" onchange="updateUserRole('${user.id}', this.value)">
                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                    <option value="doctor" ${user.role === 'doctor' ? 'selected' : ''}>Doctor</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="superuser" ${user.role === 'superuser' ? 'selected' : ''}>Superuser</option>
                </select>
                <button class="delete-btn" onclick="deleteUser('${user.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function displayActivityLog(logs) {
    if (!activityLog) return;
    
    activityLog.innerHTML = logs.map(log => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${getActivityIcon(log.type)}"></i>
            </div>
            <div class="activity-details">
                <h4>${log.action}</h4>
                <p>${log.description}</p>
                <span class="activity-time">${new Date(log.created_at).toLocaleString()}</span>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        'login': 'fa-sign-in-alt',
        'user': 'fa-user',
        'report': 'fa-file-medical',
        'system': 'fa-cog',
        'default': 'fa-info-circle'
    };
    return icons[type] || icons.default;
}

// Event Handlers
function handleRoleEdit(event) {
    const roleItem = event.currentTarget.parentElement;
    const roleName = roleItem.querySelector('span').textContent;
    
    // Show edit modal
    const newRole = prompt('Enter new role name:', roleName);
    if (newRole && newRole !== roleName) {
        updateSystemSetting('role_' + roleName.toLowerCase(), newRole);
    }
}

function handleAccessToggle(event) {
    const accessItem = event.currentTarget.parentElement;
    const accessName = accessItem.querySelector('span').textContent;
    const isEnabled = event.target.checked;
    
    updateSystemSetting('access_' + accessName.toLowerCase().replace(/\s+/g, '_'), isEnabled);
}

function handleSettingsSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    Object.entries(data).forEach(([key, value]) => {
        updateSystemSetting(key, value);
    });
}

function handleBackup() {
    if (confirm('Are you sure you want to create a system backup?')) {
        createBackup();
    }
}

// Message Functions
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    fetchActivityLog();
    
    roleItems.forEach(item => {
        const editBtn = item.querySelector('.edit-btn');
        editBtn?.addEventListener('click', handleRoleEdit);
    });

    accessItems.forEach(item => {
        const toggle = item.querySelector('input[type="checkbox"]');
        toggle?.addEventListener('change', handleAccessToggle);
    });

    settingsForms.forEach(form => {
        form.addEventListener('submit', handleSettingsSubmit);
    });

    backupBtn?.addEventListener('click', handleBackup);

    // Refresh data periodically
    setInterval(fetchActivityLog, 30000); // Every 30 seconds
}); 