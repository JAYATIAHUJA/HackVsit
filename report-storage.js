// DOM Elements
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');
const filterDate = document.getElementById('filterDate');
const reportsGrid = document.getElementById('reportsGrid');
const noReports = document.getElementById('noReports');
const previewModal = document.getElementById('previewModal');
const previewContainer = document.getElementById('previewContainer');
const confirmModal = document.getElementById('confirmModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

let reports = [];
let currentReport = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadReports();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', filterReports);
    filterType.addEventListener('change', filterReports);
    filterDate.addEventListener('change', filterReports);
    
    document.querySelector('.close-preview').addEventListener('click', closePreviewModal);
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) closePreviewModal();
    });
    
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeConfirmModal();
    });
    
    cancelDelete.addEventListener('click', closeConfirmModal);
    confirmDelete.addEventListener('click', deleteCurrentReport);
}

// Load reports from localStorage
function loadReports() {
    reports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    displayReports(reports);
}

// Display reports in grid
function displayReports(reportsToShow) {
    if (reportsToShow.length === 0) {
        reportsGrid.style.display = 'none';
        noReports.style.display = 'block';
        return;
    }
    
    reportsGrid.style.display = 'grid';
    noReports.style.display = 'none';
    
    reportsGrid.innerHTML = reportsToShow.map(report => `
        <div class="report-card" data-id="${report.id}">
            <i class="report-icon fas ${getFileIcon(report.type)}"></i>
            <div class="report-info">
                <h3>${report.name}</h3>
                <p>Uploaded: ${formatDate(report.uploadDate)}</p>
                <p>${formatFileSize(report.size)}</p>
            </div>
            <div class="report-actions">
                <button onclick="previewReport('${report.id}')" title="Preview">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="downloadReport('${report.id}')" title="Download">
                    <i class="fas fa-download"></i>
                </button>
                <button onclick="showDeleteConfirm('${report.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Filter reports based on search and filters
function filterReports() {
    const searchTerm = searchInput.value.toLowerCase();
    const typeFilter = filterType.value;
    const dateFilter = filterDate.value;
    
    let filtered = reports.filter(report => {
        const matchesSearch = report.name.toLowerCase().includes(searchTerm);
        const matchesType = typeFilter === 'all' || report.type === typeFilter;
        const matchesDate = dateFilter === 'all' || isWithinDateRange(report.uploadDate, dateFilter);
        
        return matchesSearch && matchesType && matchesDate;
    });
    
    displayReports(filtered);
}

// Preview report
async function previewReport(id) {
    const report = reports.find(r => r.id === id);
    if (!report) return;
    
    currentReport = report;
    previewModal.style.display = 'block';
    previewContainer.innerHTML = '<div class="loading">Loading preview...</div>';
    
    try {
        if (report.type === 'pdf') {
            await previewPDF(report.data);
        } else {
            previewImage(report.data);
        }
    } catch (error) {
        previewContainer.innerHTML = '<div class="error">Error loading preview</div>';
        console.error('Preview error:', error);
    }
}

// Preview PDF
async function previewPDF(data) {
    try {
        const pdfData = atob(data.split(',')[1]);
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
        
        previewContainer.innerHTML = '';
        previewContainer.appendChild(canvas);
    } catch (error) {
        previewContainer.innerHTML = '<div class="error">Error loading PDF preview</div>';
        console.error('PDF preview error:', error);
    }
}

// Preview image
function previewImage(data) {
    const img = document.createElement('img');
    img.src = data;
    img.onload = () => {
        previewContainer.innerHTML = '';
        previewContainer.appendChild(img);
    };
    img.onerror = () => {
        previewContainer.innerHTML = '<div class="error">Error loading image preview</div>';
    };
}

// Download report
function downloadReport(id) {
    const report = reports.find(r => r.id === id);
    if (!report) return;
    
    const link = document.createElement('a');
    link.href = report.data;
    link.download = report.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Show delete confirmation
function showDeleteConfirm(id) {
    const report = reports.find(r => r.id === id);
    if (!report) return;
    
    currentReport = report;
    confirmModal.style.display = 'block';
}

// Delete current report
function deleteCurrentReport() {
    if (!currentReport) return;
    
    reports = reports.filter(r => r.id !== currentReport.id);
    localStorage.setItem('savedReports', JSON.stringify(reports));
    
    closeConfirmModal();
    closePreviewModal();
    displayReports(reports);
    showSuccessMessage('Report deleted successfully');
}

// Close modals
function closePreviewModal() {
    previewModal.style.display = 'none';
    currentReport = null;
}

function closeConfirmModal() {
    confirmModal.style.display = 'none';
}

// Utility functions
function getFileIcon(type) {
    switch (type) {
        case 'pdf':
            return 'fa-file-pdf';
        case 'image':
            return 'fa-file-image';
        default:
            return 'fa-file';
    }
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function isWithinDateRange(date, range) {
    const reportDate = new Date(date);
    const now = new Date();
    
    switch (range) {
        case 'today':
            return reportDate.toDateString() === now.toDateString();
        case 'week':
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return reportDate >= weekAgo;
        case 'month':
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return reportDate >= monthAgo;
        default:
            return true;
    }
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Update report-analyzer.js to save reports
function saveReport(file, data) {
    const report = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        size: file.size,
        uploadDate: new Date().toISOString(),
        data: data
    };
    
    reports.push(report);
    localStorage.setItem('savedReports', JSON.stringify(reports));
    showSuccessMessage('Report saved successfully');
} 