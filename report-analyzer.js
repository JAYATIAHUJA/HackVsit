// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadedFiles = document.getElementById('uploadedFiles');
const analyzeBtn = document.getElementById('analyzeBtn');
const previewModal = document.getElementById('previewModal');
const previewContainer = document.getElementById('previewContainer');
const closePreview = document.querySelector('.close-preview');
const loadingSpinner = document.getElementById('loadingSpinner');
const analysisStatus = document.querySelector('.analysis-status');
const resultsSection = document.querySelector('.results-section');

// Global variables
let currentFile = null;

// Static analysis data for demonstration
const staticAnalysisData = {
    summary: "This is a sample medical report analysis showing normal results with some minor variations. The patient shows good overall health with a few areas that need attention.",
    findings: [
        "Blood pressure is within normal range (120/80 mmHg)",
        "Cholesterol levels are slightly elevated",
        "Blood sugar levels are normal",
        "Liver function tests show normal results",
        "Kidney function is within normal parameters"
    ],
    recommendations: {
        precautions: [
            "Monitor blood pressure regularly",
            "Maintain a balanced diet",
            "Exercise for at least 30 minutes daily"
        ],
        medications: [
            "Continue current medication as prescribed",
            "Take vitamin D supplements",
            "Consider omega-3 supplements"
        ],
        lifestyle: [
            "Reduce salt intake",
            "Increase water consumption",
            "Get 7-8 hours of sleep daily"
        ]
    },
    followUp: [
        "Schedule follow-up appointment in 3 months",
        "Get blood work done after 2 months",
        "Monitor weight and blood pressure weekly"
    ]
};

// Event Listeners
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
closePreview.addEventListener('click', closePreviewModal);
analyzeBtn.addEventListener('click', async () => {
    if (!currentFile) {
        showError('Please upload a file first');
        return;
    }
    
    loadingSpinner.style.display = 'flex';
    analyzeBtn.disabled = true;
    analysisStatus.textContent = 'Analyzing your report...';
    
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Use static analysis data
        const analysis = staticAnalysisData;
        displayResults(analysis);
        showSuccess('Analysis completed successfully');
        
        // Save the analyzed report
        saveAnalyzedReport({
            fileName: currentFile.name,
            analysis: analysis,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        showError(error.message);
    } finally {
        loadingSpinner.style.display = 'none';
        analyzeBtn.disabled = false;
    }
});

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFiles(files[0]);
    }
}

// File Selection Handlers
function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFiles(files[0]);
    }
}

function handleFiles(file) {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    
    if (!validTypes.includes(file.type)) {
        showError('Please upload a PDF, JPG, or PNG file.');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showError('File size should be less than 10MB.');
        return;
    }
    
    currentFile = file;
    displayFileInfo(file);
    analyzeBtn.disabled = false;
}

function displayFileInfo(file) {
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    uploadedFiles.innerHTML = `
        <div class="file-info" onclick="previewFile()">
            <i class="fas fa-file-medical"></i>
            <div class="file-details">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${fileSize} MB</span>
            </div>
            <button onclick="removeFile(event)" class="remove-file" title="Remove file">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    uploadedFiles.style.display = 'block';
}

function removeFile(event) {
    event.stopPropagation();
    currentFile = null;
    uploadedFiles.innerHTML = '';
    uploadedFiles.style.display = 'none';
    fileInput.value = '';
    analyzeBtn.disabled = true;
}

// Preview functionality
function previewFile() {
    if (!currentFile) return;
    
    previewModal.style.display = 'block';
    previewContainer.innerHTML = '<div class="loading">Loading preview...</div>';
    
    if (currentFile.type === 'application/pdf') {
        previewPDF(currentFile);
    } else if (currentFile.type.startsWith('image/')) {
        previewImage(currentFile);
    }
}

async function previewPDF(file) {
    try {
        const fileUrl = URL.createObjectURL(file);
        const loadingTask = pdfjsLib.getDocument(fileUrl);
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
        
        URL.revokeObjectURL(fileUrl);
        
        previewContainer.innerHTML = '';
        previewContainer.appendChild(canvas);
    } catch (error) {
        previewContainer.innerHTML = '<div class="error">Failed to load PDF preview</div>';
    }
}

function previewImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        previewContainer.innerHTML = '';
        previewContainer.appendChild(img);
    };
    reader.onerror = function() {
        previewContainer.innerHTML = '<div class="error">Failed to load image preview</div>';
    };
    reader.readAsDataURL(file);
}

function closePreviewModal() {
    previewModal.style.display = 'none';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

function displayResults(result) {
    const resultsSection = document.getElementById('resultsSection');
    
    // Display summary
    const summaryContent = resultsSection.querySelector('.summary-content');
    summaryContent.textContent = result.summary;
    
    // Display findings
    const findingsList = resultsSection.querySelector('.findings-list');
    findingsList.innerHTML = result.findings
        .map(finding => `<li>${finding}</li>`)
        .join('');
    
    // Display recommendations
    const precautionsList = resultsSection.querySelector('.precautions-list');
    precautionsList.innerHTML = result.recommendations.precautions
        .map(precaution => `<li>${precaution}</li>`)
        .join('');
    
    const medicationsList = resultsSection.querySelector('.medications-list');
    medicationsList.innerHTML = result.recommendations.medications
        .map(medication => `<li>${medication}</li>`)
        .join('');
    
    const lifestyleList = resultsSection.querySelector('.lifestyle-list');
    lifestyleList.innerHTML = result.recommendations.lifestyle
        .map(item => `<li>${item}</li>`)
        .join('');
    
    // Display follow-up actions
    const followUpList = resultsSection.querySelector('.follow-up-list');
    followUpList.innerHTML = result.followUp
        .map(action => `<li>${action}</li>`)
        .join('');
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Report Storage Functions
function saveAnalyzedReport(result) {
    try {
        const reports = JSON.parse(localStorage.getItem('analyzedReports') || '[]');
        // Add unique ID and timestamp if not present
        if (!result.id) {
            result.id = Date.now().toString();
        }
        if (!result.timestamp) {
            result.timestamp = new Date().toISOString();
        }
        reports.push(result);
        localStorage.setItem('analyzedReports', JSON.stringify(reports));
        showSuccess('Report saved successfully');
    } catch (error) {
        console.error('Failed to save report:', error);
        showError('Failed to save report. Please try again.');
    }
}

function getStoredReports() {
    try {
        return JSON.parse(localStorage.getItem('analyzedReports') || '[]');
    } catch (error) {
        console.error('Failed to retrieve reports:', error);
        showError('Failed to retrieve reports. Please try again.');
        return [];
    }
}

function deleteStoredReport(reportId) {
    try {
        const reports = getStoredReports();
        const updatedReports = reports.filter(report => report.id !== reportId);
        localStorage.setItem('analyzedReports', JSON.stringify(updatedReports));
        showSuccess('Report deleted successfully');
        return true;
    } catch (error) {
        console.error('Failed to delete report:', error);
        showError('Failed to delete report. Please try again.');
        return false;
    }
}

function displayStoredReports() {
    const reports = getStoredReports();
    const reportsContainer = document.getElementById('storedReports');
    
    if (!reportsContainer) {
        console.error('Reports container not found');
        return;
    }
    
    if (reports.length === 0) {
        reportsContainer.innerHTML = '<p class="no-reports">No reports found</p>';
        return;
    }
    
    const reportsList = reports.map(report => `
        <div class="stored-report" data-id="${report.id}">
            <div class="report-header">
                <h3>${report.fileName || 'Unnamed Report'}</h3>
                <span class="report-date">${new Date(report.timestamp).toLocaleDateString()}</span>
            </div>
            <div class="report-summary">${report.analysis.summary || 'No summary available'}</div>
            <div class="report-actions">
                <button class="view-btn" onclick="viewStoredReport('${report.id}')">View Details</button>
                <button class="delete-btn" onclick="deleteStoredReport('${report.id}')">Delete</button>
            </div>
        </div>
    `).join('');
    
    reportsContainer.innerHTML = reportsList;
}

function viewStoredReport(reportId) {
    const reports = getStoredReports();
    const report = reports.find(r => r.id === reportId);
    
    if (!report) {
        showError('Report not found');
        return;
    }
    
    // Hide the upload section
    const uploadSection = document.querySelector('.upload-section');
    if (uploadSection) {
        uploadSection.style.display = 'none';
    }
    
    // Show the results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    
    // Display the report details
    const analysis = report.analysis;
    
    // Update summary
    const summaryContent = resultsSection.querySelector('.summary-content');
    if (summaryContent) {
        summaryContent.textContent = analysis.summary;
    }
    
    // Update findings
    const findingsList = resultsSection.querySelector('.findings-list');
    if (findingsList) {
        findingsList.innerHTML = analysis.findings
            .map(finding => `<li>${finding}</li>`)
            .join('');
    }
    
    // Update recommendations
    const precautionsList = resultsSection.querySelector('.precautions-list');
    if (precautionsList) {
        precautionsList.innerHTML = analysis.recommendations.precautions
            .map(precaution => `<li>${precaution}</li>`)
            .join('');
    }
    
    const medicationsList = resultsSection.querySelector('.medications-list');
    if (medicationsList) {
        medicationsList.innerHTML = analysis.recommendations.medications
            .map(medication => `<li>${medication}</li>`)
            .join('');
    }
    
    const lifestyleList = resultsSection.querySelector('.lifestyle-list');
    if (lifestyleList) {
        lifestyleList.innerHTML = analysis.recommendations.lifestyle
            .map(item => `<li>${item}</li>`)
            .join('');
    }
    
    // Update follow-up actions
    const followUpList = resultsSection.querySelector('.follow-up-list');
    if (followUpList) {
        followUpList.innerHTML = analysis.followUp
            .map(action => `<li>${action}</li>`)
            .join('');
    }
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Add event listener to load stored reports when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayStoredReports();
});

// Add zoom functionality
let currentScale = 1.5;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;

async function zoomPDF(direction) {
    if (!currentFile || currentFile.type !== 'application/pdf') return;
    
    // Calculate new scale
    const scaleChange = direction === 'in' ? 0.25 : -0.25;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale + scaleChange));
    
    if (newScale === currentScale) return;
    
    currentScale = newScale;
    
    // Re-render PDF with new scale
    try {
        const fileUrl = URL.createObjectURL(currentFile);
        const pdf = await pdfjsLib.getDocument(fileUrl).promise;
        const page = await pdf.getPage(1);
        
        const viewport = page.getViewport({ scale: currentScale });
        const canvas = document.querySelector('#previewContainer canvas');
        
        if (!canvas) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
        }).promise;
        
        URL.revokeObjectURL(fileUrl);
    } catch (error) {
        console.error('Zoom error:', error);
    }
}

// Function to extract text from PDF
async function extractTextFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let textContent = '';
        
        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map(item => item.str).join(' ');
        }
        
        return textContent;
    } catch (error) {
        throw new Error('Failed to extract text from PDF: ' + error.message);
    }
}

// Function to extract text from image using OCR
async function extractTextFromImage(file) {
    try {
        // Convert image to base64
        const base64Image = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
        
        // Call OCR API (you'll need to implement this with a service like Tesseract.js or cloud OCR)
        // For now, we'll use a placeholder
        const response = await fetch('YOUR_OCR_API_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image })
        });
        
        const data = await response.json();
        return data.text;
    } catch (error) {
        throw new Error('Failed to extract text from image: ' + error.message);
    }
}

// Function to analyze the report using AI
// async function analyzeReport(textContent) {
//     // This function is now replaced by static analysis
// }

// Add event listener to load stored reports when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayStoredReports();
});