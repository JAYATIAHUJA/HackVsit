const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const path = require('path');

const app = express();
const upload = multer();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Extract text from PDF using pdf.js-extract
async function extractTextFromPDF(buffer) {
    try {
        const uint8Array = new Uint8Array(buffer);
        const data = await pdfExtract.extractBuffer(uint8Array, {});
        
        if (!data || !data.pages || data.pages.length === 0) {
            throw new Error('No pages found in PDF');
        }

        const text = data.pages.map(page => {
            return page.content.map(item => item.str).join(' ');
        }).join('\n');

        if (!text || text.trim().length === 0) {
            throw new Error('No text content found in PDF');
        }

        console.log('Extracted text length:', text.length);
        return text;
    } catch (error) {
        console.error('PDF extraction error:', error);
        throw new Error('Failed to extract text from PDF: ' + error.message);
    }
}

// Extract text from Image using Tesseract
async function extractTextFromImage(buffer) {
    try {
        const { data: { text } } = await Tesseract.recognize(buffer);
        
        if (!text || text.trim().length === 0) {
            throw new Error('No text content found in image');
        }

        console.log('Extracted text length:', text.length);
        return text;
    } catch (error) {
        console.error('Image extraction error:', error);
        throw new Error('Failed to extract text from image: ' + error.message);
    }
}

// Local analysis function
function analyzeReport(text) {
    try {
        // Convert text to lowercase for easier matching
        const lowerText = text.toLowerCase();
        
        // Initialize results
        const findings = [];
        const precautions = [];
        const medications = [];
        const lifestyle = [];
        const followUp = [];
        
        // Common medical terms to look for
        const medicalTerms = {
            conditions: ['diabetes', 'hypertension', 'cholesterol', 'anemia', 'thyroid', 'vitamin', 'blood sugar', 'pressure'],
            vitals: ['pulse', 'temperature', 'weight', 'height', 'bmi'],
            tests: ['blood test', 'urine test', 'x-ray', 'mri', 'ct scan', 'ultrasound', 'ecg', 'blood count'],
            medications: ['tablet', 'capsule', 'injection', 'syrup', 'mg', 'ml', 'medicine', 'dose'],
            abnormal: ['high', 'low', 'abnormal', 'elevated', 'deficiency', 'positive', 'negative']
        };

        // Extract findings
        const sentences = text.split(/[.!?]+/);
        sentences.forEach(sentence => {
            const trimmedSentence = sentence.trim();
            if (trimmedSentence) {
                const lower = trimmedSentence.toLowerCase();
                
                // Check for medical terms
                for (const [category, terms] of Object.entries(medicalTerms)) {
                    for (const term of terms) {
                        if (lower.includes(term)) {
                            findings.push(trimmedSentence);
                            
                            // Add recommendations based on findings
                            if (category === 'conditions') {
                                if (term.includes('diabetes') || term.includes('blood sugar')) {
                                    precautions.push('Regular blood sugar monitoring');
                                    lifestyle.push('Follow a diabetic diet plan');
                                    lifestyle.push('Regular exercise');
                                    medications.push('Continue prescribed diabetes medications as directed');
                                } else if (term.includes('pressure') || term === 'hypertension') {
                                    precautions.push('Regular blood pressure monitoring');
                                    lifestyle.push('Reduce salt intake');
                                    lifestyle.push('Regular exercise');
                                    medications.push('Take blood pressure medications as prescribed');
                                }
                            }
                            
                            // Check for medications
                            if (category === 'medications') {
                                medications.push(trimmedSentence);
                            }
                        }
                    }
                }
                
                // Check for follow-up instructions
                if (lower.includes('follow') || lower.includes('next visit') || lower.includes('review')) {
                    followUp.push(trimmedSentence);
                }
            }
        });

        // Add default recommendations if none found
        if (lifestyle.length === 0) {
            lifestyle.push('Maintain a balanced diet');
            lifestyle.push('Regular exercise for 30 minutes daily');
            lifestyle.push('Ensure adequate sleep (7-8 hours)');
            lifestyle.push('Stay hydrated');
        }

        if (followUp.length === 0) {
            followUp.push('Schedule a follow-up visit in 4 weeks');
            followUp.push('Get regular health check-ups');
        }

        // Generate summary
        const summary = `Medical report analysis found ${findings.length} significant findings. ` +
            (medications.length ? 'Medications have been prescribed. ' : '') +
            (precautions.length ? 'Specific precautions are recommended. ' : '') +
            (lifestyle.length ? 'Lifestyle modifications are suggested.' : '');

        return {
            summary,
            findings: [...new Set(findings)],
            recommendations: {
                precautions: [...new Set(precautions)],
                medications: [...new Set(medications)],
                lifestyle: [...new Set(lifestyle)]
            },
            followUp: [...new Set(followUp)]
        };
    } catch (error) {
        console.error('Analysis error:', error);
        return {
            summary: 'Basic analysis completed',
            findings: ['Unable to extract detailed findings'],
            recommendations: {
                precautions: ['Consult with your healthcare provider'],
                medications: ['Continue any prescribed medications'],
                lifestyle: ['Maintain a healthy lifestyle']
            },
            followUp: ['Schedule a follow-up with your doctor']
        };
    }
}

// API endpoint for report analysis
app.post('/api/analyze', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Processing file:', req.file.originalname, 'Type:', req.file.mimetype);

        // Extract text based on file type
        let text;
        if (req.file.mimetype === 'application/pdf') {
            text = await extractTextFromPDF(req.file.buffer);
        } else if (req.file.mimetype.startsWith('image/')) {
            text = await extractTextFromImage(req.file.buffer);
        } else {
            return res.status(400).json({ error: 'Unsupported file type. Please upload PDF or image files only.' });
        }

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ 
                error: 'No text could be extracted from the file. Please ensure the file contains readable text.' 
            });
        }

        console.log('Text extracted successfully, length:', text.length);

        // Analyze the extracted text locally
        const analysis = analyzeReport(text);
        res.json(analysis);

    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({ 
            error: 'Failed to analyze report. Please try again with a different file.',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 