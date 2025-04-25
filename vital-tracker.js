// DOM Elements
const addVitalsBtn = document.getElementById('addVitalsBtn');
const vitalSignsHistory = document.getElementById('vitalSignsHistory');
const systolicInput = document.getElementById('systolic');
const diastolicInput = document.getElementById('diastolic');
const heartRateInput = document.getElementById('heartRate');
const temperatureInput = document.getElementById('temperature');
const oxygenSaturationInput = document.getElementById('oxygenSaturation');

// Chart instances
let bpChart, hrChart, tempChart, o2Chart;

// Initialize charts
function initializeCharts() {
    try {
        // Blood Pressure Chart
        const bpChartElement = document.getElementById('bpChart');
        if (!bpChartElement) {
            console.error('Blood Pressure chart element not found');
            return;
        }
        bpChart = new Chart(bpChartElement, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Systolic',
                        data: [],
                        borderColor: '#dc3545',
                        tension: 0.4
                    },
                    {
                        label: 'Diastolic',
                        data: [],
                        borderColor: '#0d6efd',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Blood Pressure Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });

        // Heart Rate Chart
        const hrChartElement = document.getElementById('hrChart');
        if (!hrChartElement) {
            console.error('Heart Rate chart element not found');
            return;
        }
        hrChart = new Chart(hrChartElement, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Heart Rate',
                    data: [],
                    borderColor: '#198754',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Heart Rate Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });

        // Temperature Chart
        const tempChartElement = document.getElementById('tempChart');
        if (!tempChartElement) {
            console.error('Temperature chart element not found');
            return;
        }
        tempChart = new Chart(tempChartElement, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature',
                    data: [],
                    borderColor: '#fd7e14',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Temperature Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });

        // Oxygen Saturation Chart
        const o2ChartElement = document.getElementById('o2Chart');
        if (!o2ChartElement) {
            console.error('Oxygen Saturation chart element not found');
            return;
        }
        o2Chart = new Chart(o2ChartElement, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'SpO2',
                    data: [],
                    borderColor: '#0dcaf0',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Oxygen Saturation Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 70,
                        max: 100
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing charts:', error);
        showError('Failed to initialize charts. Please refresh the page.');
    }
}

// Load vital signs from localStorage
function loadVitalSigns() {
    try {
        const vitalSigns = JSON.parse(localStorage.getItem('vitalSigns') || '[]');
        displayVitalSigns(vitalSigns);
        updateCharts(vitalSigns);
    } catch (error) {
        console.error('Error loading vital signs:', error);
        showError('Failed to load vital signs history.');
    }
}

// Save vital signs to localStorage
function saveVitalSigns(vitalSigns) {
    try {
        localStorage.setItem('vitalSigns', JSON.stringify(vitalSigns));
    } catch (error) {
        console.error('Error saving vital signs:', error);
        showError('Failed to save vital signs.');
    }
}

// Add new vital signs
function addVitalSigns() {
    try {
        const systolic = parseInt(systolicInput.value);
        const diastolic = parseInt(diastolicInput.value);
        const heartRate = parseInt(heartRateInput.value);
        const temperature = parseFloat(temperatureInput.value);
        const oxygenSaturation = parseInt(oxygenSaturationInput.value);

        // Validate inputs
        if (!systolic || !diastolic || !heartRate || !temperature || !oxygenSaturation) {
            showError('Please fill in all fields');
            return;
        }

        // Validate ranges
        if (systolic < 60 || systolic > 200) {
            showError('Systolic blood pressure must be between 60 and 200');
            return;
        }
        if (diastolic < 40 || diastolic > 120) {
            showError('Diastolic blood pressure must be between 40 and 120');
            return;
        }
        if (heartRate < 40 || heartRate > 200) {
            showError('Heart rate must be between 40 and 200');
            return;
        }
        if (temperature < 95 || temperature > 105) {
            showError('Temperature must be between 95 and 105');
            return;
        }
        if (oxygenSaturation < 70 || oxygenSaturation > 100) {
            showError('Oxygen saturation must be between 70 and 100');
            return;
        }

        const vitalSigns = JSON.parse(localStorage.getItem('vitalSigns') || '[]');
        const newRecord = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            systolic,
            diastolic,
            heartRate,
            temperature,
            oxygenSaturation
        };

        vitalSigns.unshift(newRecord);
        saveVitalSigns(vitalSigns);
        displayVitalSigns(vitalSigns);
        updateCharts(vitalSigns);
        clearInputs();
        showSuccess('Vital signs recorded successfully');
    } catch (error) {
        console.error('Error adding vital signs:', error);
        showError('Failed to add vital signs. Please try again.');
    }
}

// Display vital signs history
function displayVitalSigns(vitalSigns) {
    try {
        if (!vitalSignsHistory) {
            console.error('Vital signs history element not found');
            return;
        }

        if (vitalSigns.length === 0) {
            vitalSignsHistory.innerHTML = '<p class="no-records">No vital signs recorded yet</p>';
            return;
        }

        vitalSignsHistory.innerHTML = vitalSigns.map(record => `
            <div class="vital-record" data-id="${record.id}">
                <div class="vital-record-header">
                    <span class="vital-record-date">${new Date(record.timestamp).toLocaleString()}</span>
                    <button class="vital-record-delete" onclick="deleteVitalSign(${record.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="vital-record-item">
                    <span class="vital-record-label">Blood Pressure</span>
                    <span class="vital-record-value">${record.systolic}/${record.diastolic} mmHg</span>
                </div>
                <div class="vital-record-item">
                    <span class="vital-record-label">Heart Rate</span>
                    <span class="vital-record-value">${record.heartRate} bpm</span>
                </div>
                <div class="vital-record-item">
                    <span class="vital-record-label">Temperature</span>
                    <span class="vital-record-value">${record.temperature}°F</span>
                </div>
                <div class="vital-record-item">
                    <span class="vital-record-label">Oxygen Saturation</span>
                    <span class="vital-record-value">${record.oxygenSaturation}%</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error displaying vital signs:', error);
        showError('Failed to display vital signs history.');
    }
}

// Update charts with new data
function updateCharts(vitalSigns) {
    try {
        if (!bpChart || !hrChart || !tempChart || !o2Chart) {
            console.error('One or more charts not initialized');
            return;
        }

        const labels = vitalSigns.map(record => new Date(record.timestamp).toLocaleDateString());
        const systolicData = vitalSigns.map(record => record.systolic);
        const diastolicData = vitalSigns.map(record => record.diastolic);
        const heartRateData = vitalSigns.map(record => record.heartRate);
        const temperatureData = vitalSigns.map(record => record.temperature);
        const oxygenData = vitalSigns.map(record => record.oxygenSaturation);

        // Update Blood Pressure Chart
        bpChart.data.labels = labels;
        bpChart.data.datasets[0].data = systolicData;
        bpChart.data.datasets[1].data = diastolicData;
        bpChart.update();

        // Update Heart Rate Chart
        hrChart.data.labels = labels;
        hrChart.data.datasets[0].data = heartRateData;
        hrChart.update();

        // Update Temperature Chart
        tempChart.data.labels = labels;
        tempChart.data.datasets[0].data = temperatureData;
        tempChart.update();

        // Update Oxygen Saturation Chart
        o2Chart.data.labels = labels;
        o2Chart.data.datasets[0].data = oxygenData;
        o2Chart.update();
    } catch (error) {
        console.error('Error updating charts:', error);
        showError('Failed to update charts.');
    }
}

// Delete vital signs record
function deleteVitalSign(id) {
    try {
        const vitalSigns = JSON.parse(localStorage.getItem('vitalSigns') || '[]');
        const updatedVitalSigns = vitalSigns.filter(record => record.id !== id);
        saveVitalSigns(updatedVitalSigns);
        displayVitalSigns(updatedVitalSigns);
        updateCharts(updatedVitalSigns);
        showSuccess('Record deleted successfully');
    } catch (error) {
        console.error('Error deleting vital sign:', error);
        showError('Failed to delete record.');
    }
}

// Clear input fields
function clearInputs() {
    try {
        systolicInput.value = '';
        diastolicInput.value = '';
        heartRateInput.value = '';
        temperatureInput.value = '';
        oxygenSaturationInput.value = '';
    } catch (error) {
        console.error('Error clearing inputs:', error);
    }
}

// Show error message
function showError(message) {
    try {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    } catch (error) {
        console.error('Error showing error message:', error);
    }
}

// Show success message
function showSuccess(message) {
    try {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 5000);
    } catch (error) {
        console.error('Error showing success message:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (addVitalsBtn) {
            addVitalsBtn.addEventListener('click', addVitalSigns);
        } else {
            console.error('Add vitals button not found');
        }
        initializeCharts();
        loadVitalSigns();
    } catch (error) {
        console.error('Error initializing vital tracker:', error);
        showError('Failed to initialize vital tracker. Please refresh the page.');
    }
}); 