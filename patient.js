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
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const abhaLoginBtn = document.getElementById('abhaLogin');
const abhaSignupBtn = document.getElementById('abhaSignup');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const abhaLoginModal = document.getElementById('abhaLoginModal');
const abhaSignupModal = document.getElementById('abhaSignupModal');
const closeButtons = document.querySelectorAll('.close');
const switchToSignup = document.querySelector('.switch-to-signup');
const switchToLogin = document.querySelector('.switch-to-login');

// Open Login Modal
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'block';
});

// Open Signup Modal
signupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'block';
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
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const abhaLoginForm = document.querySelector('#abhaLoginModal .abha-form');
const abhaSignupForm = document.querySelector('#abhaSignupModal .abha-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Login form submitted');
    loginModal.style.display = 'none';
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Signup form submitted');
    signupModal.style.display = 'none';
});

abhaLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('ABHA Login form submitted');
    abhaLoginModal.style.display = 'none';
});

abhaSignupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('ABHA Signup form submitted');
    abhaSignupModal.style.display = 'none';
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

    // Toggle chatbot
    chatbotBtn.addEventListener('click', () => {
        chatbotWidget.classList.toggle('active');
    });

    closeChatBtn.addEventListener('click', () => {
        chatbotWidget.classList.remove('active');
    });

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
                sendMessage('I understand your query. Let me help you with that.', false);
            }, 1000);
        }
    }

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

    // Voice recognition setup
    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = function(event) {
            const message = event.results[0][0].transcript;
            messageInput.value = message;
            sendMessage(message);
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
        };
    }

    // Voice input button functionality
    voiceInputBtn.addEventListener('click', () => {
        if (recognition) {
            voiceInputBtn.classList.add('listening');
            recognition.start();
            setTimeout(() => {
                recognition.stop();
                voiceInputBtn.classList.remove('listening');
            }, 5000);
        } else {
            alert('Speech recognition is not supported in your browser.');
        }
    });

    // Voice assistant button functionality
    voiceBtn.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
            const lastBotMessage = messagesContainer.querySelector('.bot-message:last-child');
            if (lastBotMessage) {
                const utterance = new SpeechSynthesisUtterance(lastBotMessage.textContent);
                speechSynthesis.speak(utterance);
            }
        } else {
            alert('Text-to-speech is not supported in your browser.');
        }
    });
}); 