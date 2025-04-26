// Gender Switch Functionality
const genderSwitch = document.querySelector('.gender-switch');
const genderButtons = document.querySelectorAll('.gender-btn');

genderButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        genderButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update sliding background
        genderSwitch.dataset.active = button.dataset.gender;
        
        // Here you can add logic to switch between male and female care content
        const gender = button.dataset.gender;
        console.log(`Switched to ${gender} care`);
    });
});

// Modal Functionality
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const abhaLoginBtn = document.getElementById('abhaLogin');
const abhaSignupBtn = document.getElementById('abhaSignup');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const abhaLoginModal = document.getElementById('abhaLoginModal');
const abhaSignupModal = document.getElementById('abhaSignupModal');
const closeButtons = document.querySelectorAll('.close');
const switchToSignup = document.querySelector('.switch-to-signup');
const switchToLogin = document.querySelector('.switch-to-login');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const userProfile = document.getElementById('userProfile');
const authButtons = document.querySelector('.auth-buttons');
const userName = document.getElementById('userName');
const userAvatar = document.getElementById('userAvatar');
const logoutBtn = document.getElementById('logoutBtn');

// Open Login Modal
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
    signupModal.style.display = 'none';
});

// Open Signup Modal
signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'block';
    loginModal.style.display = 'none';
});

// Open ABHA Login Modal
abhaLoginBtn.addEventListener('click', () => {
    abhaLoginModal.style.display = 'block';
});

// Open ABHA Signup Modal
abhaSignupBtn.addEventListener('click', () => {
    abhaSignupModal.style.display = 'block';
});

// Close Modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
        abhaLoginModal.style.display = 'none';
        abhaSignupModal.style.display = 'none';
    });
});

// Switch between Login and Signup
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
    loginModal.style.display = 'block';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === signupModal) {
        signupModal.style.display = 'none';
    }
    if (e.target === abhaLoginModal) {
        abhaLoginModal.style.display = 'none';
    }
    if (e.target === abhaSignupModal) {
        abhaSignupModal.style.display = 'none';
    }
});

// Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:3002/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Update UI
            showUserProfile(data.user);
            loginModal.style.display = 'none';
            showSuccess('Login successful!');
        } else {
            showError(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Login failed. Please try again.');
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        full_name: document.getElementById('fullName').value,
        email: document.getElementById('signupEmail').value,
        password: document.getElementById('signupPassword').value,
        phone: document.getElementById('phone').value,
        date_of_birth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value
    };

    if (formData.password !== document.getElementById('confirmPassword').value) {
        showError('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('http://localhost:3002/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            signupModal.style.display = 'none';
            showSuccess('Registration successful! Please login.');
            loginModal.style.display = 'block';
        } else {
            showError(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Registration failed. Please try again.');
    }
});

// Handle Logout
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    hideUserProfile();
    showSuccess('Logged out successfully');
});

// Show User Profile
function showUserProfile(user) {
    authButtons.style.display = 'none';
    userProfile.style.display = 'flex';
    userName.textContent = user.full_name;
    // You can set a custom avatar here if available
}

// Hide User Profile
function hideUserProfile() {
    authButtons.style.display = 'flex';
    userProfile.style.display = 'none';
}

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
        showUserProfile(user);
    } else {
        hideUserProfile();
    }
}

// Show Success Message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

// Show Error Message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Feature Button Click Handlers
const featureButtons = document.querySelectorAll('.feature-btn');
featureButtons.forEach(button => {
    button.addEventListener('click', () => {
        const featureName = button.closest('.feature-card').querySelector('h3').textContent;
        console.log(`${featureName} button clicked`);
        // Add feature-specific logic here
    });
});

// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotBtn = document.querySelector('.chatbot-btn');
    const chatbotWidget = document.querySelector('.chatbot-widget');
    const closeChatBtn = document.querySelector('.close-chat');
    const sendBtn = document.querySelector('.send-btn');
    const messageInput = document.querySelector('.chatbot-input input');
    const messagesContainer = document.querySelector('.chatbot-messages');
    const voiceBtn = document.querySelector('.voice-btn');
    const voiceInputBtn = document.querySelector('.voice-input-btn');

    let isListening = false;
    let recognition = null;
    let speechSynthesis = window.speechSynthesis;

    // Initialize speech recognition
    function initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                isListening = true;
                voiceInputBtn.classList.add('recording');
                showTypingIndicator();
            };

            recognition.onresult = (event) => {
                const message = event.results[0][0].transcript;
                messageInput.value = message;
                sendMessage(message);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                showError('Voice recognition failed. Please try again.');
            };

            recognition.onend = () => {
                isListening = false;
                voiceInputBtn.classList.remove('recording');
                removeTypingIndicator();
            };
        } else {
            console.error('Speech recognition not supported');
            voiceInputBtn.style.display = 'none';
        }
    }

    // Initialize text-to-speech
    function initTextToSpeech() {
        if (!speechSynthesis) {
            console.error('Text-to-speech not supported');
            voiceBtn.style.display = 'none';
            return;
        }

        // Get available voices
        let voices = [];
        speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
            // Try to find a female English voice
            const preferredVoice = voices.find(voice => 
                voice.name.includes('female') && voice.lang.includes('en')
            ) || voices[0];
            
            if (preferredVoice) {
                window.chatbotVoice = preferredVoice;
            }
        };
    }

    // Show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot-message typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const indicator = messagesContainer.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Send message function
    function sendMessage(message, isUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (isUser) {
            // Simulate bot response
            setTimeout(() => {
                const botResponse = generateBotResponse(message);
                sendMessage(botResponse, false);
                speakMessage(botResponse);
            }, 1000);
        }
    }

    // Generate bot response
    function generateBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Simple response logic
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hello! How can I help you today?';
        } else if (lowerMessage.includes('appointment')) {
            return 'I can help you book an appointment. Would you like to schedule one now?';
        } else if (lowerMessage.includes('doctor')) {
            return 'I can help you find a doctor. What specialization are you looking for?';
        } else if (lowerMessage.includes('emergency')) {
            return 'For emergencies, please call 911 or visit the nearest hospital immediately.';
        } else if (lowerMessage.includes('thank')) {
            return 'You\'re welcome! Is there anything else I can help you with?';
        } else {
            return 'I understand your query. Let me help you with that. Could you please provide more details?';
        }
    }

    // Speak message using text-to-speech
    function speakMessage(message) {
        if (!speechSynthesis) return;

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.voice = window.chatbotVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        speechSynthesis.speak(utterance);
    }

    // Toggle chatbot
    chatbotBtn.addEventListener('click', () => {
        chatbotWidget.classList.toggle('active');
        if (chatbotWidget.classList.contains('active')) {
            initSpeechRecognition();
            initTextToSpeech();
        }
    });

    // Close chatbot
    closeChatBtn.addEventListener('click', () => {
        chatbotWidget.classList.remove('active');
        if (isListening) {
            recognition.stop();
        }
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
    });

    // Send message on button click
    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message);
            messageInput.value = '';
        }
    });

    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = messageInput.value.trim();
            if (message) {
                sendMessage(message);
                messageInput.value = '';
            }
        }
    });

    // Voice input button functionality
    voiceInputBtn.addEventListener('click', () => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
                showError('Could not start voice recognition. Please try again.');
            }
        }
    });

    // Voice assistant button functionality
    voiceBtn.addEventListener('click', () => {
        const lastBotMessage = messagesContainer.querySelector('.bot-message:last-child');
        if (lastBotMessage) {
            speakMessage(lastBotMessage.textContent);
        }
    });

    // Initialize on page load
    initSpeechRecognition();
    initTextToSpeech();
}); 