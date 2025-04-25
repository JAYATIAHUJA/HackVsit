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
        // Create form data
        const formData = new FormData();
        formData.append('file', currentFile);
        
        // Send file to backend for analysis
        const response = await fetch('http://localhost:3001/api/analyze', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to analyze report');
        }
        
        const analysis = await response.json();
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

function saveAnalyzedReport(result) {
    try {
        const reports = JSON.parse(localStorage.getItem('analyzedReports') || '[]');
        reports.push(result);
        localStorage.setItem('analyzedReports', JSON.stringify(reports));
    } catch (error) {
        console.error('Failed to save report:', error);
    }
}

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
async function analyzeReport(textContent) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a medical report analyzer. Analyze the given medical report and provide a detailed analysis including summary, key findings, recommendations, precautions, suggested medications, lifestyle changes, and follow-up actions. Format the response as JSON."
                    },
                    {
                        role: "user",
                        content: textContent
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error('Failed to analyze report');
        }

        const data = await response.json();
        const analysis = JSON.parse(data.choices[0].message.content);
        
        return {
            summary: analysis.summary,
            findings: analysis.findings,
            recommendations: {
                precautions: analysis.recommendations.precautions,
                medications: analysis.recommendations.medications,
                lifestyle: analysis.recommendations.lifestyle
            },
            followUp: analysis.followUp
        };
    } catch (error) {
        throw new Error('Failed to analyze report: ' + error.message);
    }
} 