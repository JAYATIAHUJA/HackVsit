const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db-config');
const fs = require('fs');

const app = express();
const upload = multer();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// JWT Secret
const JWT_SECRET = 'your-secret-key'; // Change this to a secure secret key

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Superuser Routes
app.get('/api/superuser/users', authenticateSuperuser, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, full_name, email, role, created_at FROM users');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/superuser/user/role', authenticateSuperuser, async (req, res) => {
    try {
        const { userId, role } = req.body;
        await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/superuser/activity-log', authenticateSuperuser, async (req, res) => {
    try {
        const [logs] = await pool.query(
            'SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 100'
        );
        res.json(logs);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/superuser/system-backup', authenticateSuperuser, async (req, res) => {
    try {
        // Implement backup logic here
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(__dirname, 'backups', `backup-${timestamp}`);
        
        // Create backup directory if it doesn't exist
        if (!fs.existsSync(path.join(__dirname, 'backups'))) {
            fs.mkdirSync(path.join(__dirname, 'backups'));
        }
        
        // Backup database
        const tables = ['users', 'reports', 'appointments', 'activity_log'];
        for (const table of tables) {
            const [rows] = await pool.query(`SELECT * FROM ${table}`);
            fs.writeFileSync(
                path.join(backupPath, `${table}.json`),
                JSON.stringify(rows, null, 2)
            );
        }
        
        res.json({ message: 'Backup created successfully', path: backupPath });
    } catch (error) {
        console.error('Error creating backup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/superuser/settings', authenticateSuperuser, async (req, res) => {
    try {
        const { setting, value } = req.body;
        await pool.query(
            'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ' +
            'ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
            [setting, value]
        );
        res.json({ message: 'Setting updated successfully' });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to authenticate superuser
function authenticateSuperuser(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'superuser') {
            return res.status(403).json({ error: 'Access denied' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { full_name, email, password, phone, date_of_birth, gender, blood_group, address } = req.body;

        // Check if user already exists
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await pool.query(
            'INSERT INTO users (full_name, email, password, phone, date_of_birth, gender, blood_group, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [full_name, email, hashedPassword, phone, date_of_birth, gender, blood_group, address]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Book Appointment
app.post('/api/appointments', authenticateToken, async (req, res) => {
    try {
        const { doctor_id, hospital_id, appointment_date, appointment_time, reason } = req.body;
        const user_id = req.user.userId;

        const [result] = await pool.query(
            'INSERT INTO appointments (user_id, doctor_id, hospital_id, appointment_date, appointment_time, reason) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, doctor_id, hospital_id, appointment_date, appointment_time, reason]
        );

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointmentId: result.insertId
        });
    } catch (error) {
        console.error('Appointment booking error:', error);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});

// Get User Appointments
app.get('/api/appointments', authenticateToken, async (req, res) => {
    try {
        const [appointments] = await pool.query(
            `SELECT a.*, d.full_name as doctor_name, h.name as hospital_name 
             FROM appointments a 
             JOIN doctors d ON a.doctor_id = d.id 
             JOIN hospitals h ON a.hospital_id = h.id 
             WHERE a.user_id = ? 
             ORDER BY a.appointment_date, a.appointment_time`,
            [req.user.userId]
        );

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Cancel Appointment
app.put('/api/appointments/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const userId = req.user.userId;

        const [result] = await pool.query(
            'UPDATE appointments SET status = "cancelled" WHERE id = ? AND user_id = ?',
            [appointmentId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
});

// Get Hospitals
app.get('/api/hospitals', async (req, res) => {
    try {
        const [hospitals] = await pool.query('SELECT * FROM hospitals');
        res.json(hospitals);
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ error: 'Failed to fetch hospitals' });
    }
});

// Get Doctors
app.get('/api/doctors', async (req, res) => {
    try {
        const [doctors] = await pool.query('SELECT * FROM doctors');
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});

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

// Emergency Services
app.post('/api/emergency', authenticateToken, async (req, res) => {
    try {
        const { location, emergency_type, description } = req.body;
        const user_id = req.user.userId;

        // Get nearby hospitals
        const [hospitals] = await pool.query(
            'SELECT * FROM hospitals ORDER BY RAND() LIMIT 3'
        );

        // Create emergency record
        const [result] = await pool.query(
            'INSERT INTO emergency_services (user_id, location, emergency_type, description) VALUES (?, ?, ?, ?)',
            [user_id, location, emergency_type, description]
        );

        res.status(201).json({
            message: 'Emergency service requested',
            emergencyId: result.insertId,
            nearbyHospitals: hospitals
        });
    } catch (error) {
        console.error('Emergency service error:', error);
        res.status(500).json({ error: 'Failed to process emergency request' });
    }
});

// Medicine Reminder System
app.post('/api/reminders', authenticateToken, async (req, res) => {
    try {
        const { medicine_name, dosage, frequency, start_date, end_date, time_slots } = req.body;
        const user_id = req.user.userId;

        const [result] = await pool.query(
            'INSERT INTO medicine_reminders (user_id, medicine_name, dosage, frequency, start_date, end_date, time_slots) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, medicine_name, dosage, frequency, start_date, end_date, JSON.stringify(time_slots)]
        );

        res.status(201).json({
            message: 'Medicine reminder set successfully',
            reminderId: result.insertId
        });
    } catch (error) {
        console.error('Reminder setting error:', error);
        res.status(500).json({ error: 'Failed to set reminder' });
    }
});

// Get Medicine Reminders
app.get('/api/reminders', authenticateToken, async (req, res) => {
    try {
        const [reminders] = await pool.query(
            'SELECT * FROM medicine_reminders WHERE user_id = ? AND end_date >= CURDATE()',
            [req.user.userId]
        );

        res.json(reminders);
    } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
});

// Health Records Management
app.post('/api/health-records', authenticateToken, async (req, res) => {
    try {
        const { record_type, record_date, description, file_path } = req.body;
        const user_id = req.user.userId;

        const [result] = await pool.query(
            'INSERT INTO health_records (user_id, record_type, record_date, description, file_path) VALUES (?, ?, ?, ?, ?)',
            [user_id, record_type, record_date, description, file_path]
        );

        res.status(201).json({
            message: 'Health record added successfully',
            recordId: result.insertId
        });
    } catch (error) {
        console.error('Health record error:', error);
        res.status(500).json({ error: 'Failed to add health record' });
    }
});

// Get Health Records
app.get('/api/health-records', authenticateToken, async (req, res) => {
    try {
        const [records] = await pool.query(
            'SELECT * FROM health_records WHERE user_id = ? ORDER BY record_date DESC',
            [req.user.userId]
        );

        res.json(records);
    } catch (error) {
        console.error('Error fetching health records:', error);
        res.status(500).json({ error: 'Failed to fetch health records' });
    }
});

// Doctor Rating System
app.post('/api/doctors/:id/rate', authenticateToken, async (req, res) => {
    try {
        const { rating, review } = req.body;
        const doctor_id = req.params.id;
        const user_id = req.user.userId;

        const [result] = await pool.query(
            'INSERT INTO doctor_ratings (user_id, doctor_id, rating, review) VALUES (?, ?, ?, ?)',
            [user_id, doctor_id, rating, review]
        );

        // Update doctor's average rating
        await pool.query(
            'UPDATE doctors SET average_rating = (SELECT AVG(rating) FROM doctor_ratings WHERE doctor_id = ?) WHERE id = ?',
            [doctor_id, doctor_id]
        );

        res.status(201).json({
            message: 'Rating submitted successfully',
            ratingId: result.insertId
        });
    } catch (error) {
        console.error('Rating error:', error);
        res.status(500).json({ error: 'Failed to submit rating' });
    }
});

// Get Doctor Ratings
app.get('/api/doctors/:id/ratings', async (req, res) => {
    try {
        const [ratings] = await pool.query(
            `SELECT r.*, u.full_name as user_name 
             FROM doctor_ratings r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.doctor_id = ? 
             ORDER BY r.created_at DESC`,
            [req.params.id]
        );

        res.json(ratings);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
});

const PORT = process.env.PORT || 3002;

// Add error handling for the server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port or stop the existing server.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
}); 