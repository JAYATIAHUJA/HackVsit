// Remove the Google AI import since we're not using it
// const { GoogleGenAI } = require('@google/generative-ai');

// Chatbot responses database
const medicalResponses = {
    // Common symptoms and conditions
    headache: {
        keywords: ["headache", "sir dard", "sar dard", "migraine", "head pain", "head", "sar"],
        response: `For your headache, here's what you can do:

IMMEDIATE RELIEF:
1. Rest in a dark, quiet room
2. Apply cold/hot compress to head/neck
3. Stay hydrated
4. Take deep breaths

HOME REMEDIES:
- Adrak chai (Ginger tea)
- Pudina tel ki malish (Peppermint oil massage)
- 7-8 ghante ki neend (Adequate sleep)
- Halki neck stretching

YOGA:
- Shiro Abhyanga (Head massage)
- Pranayama
- 10 minute meditation

WHEN TO SEE DOCTOR:
- Bahut tej dard ho
- Bukhar ke saath ho
- 3 din se zyada ho
- Chot ke baad ho

Doctor se contact karein:
Dr. Sharma (Neurologist): +91-9876543210
Emergency: 108`
    },

    stomach: {
        keywords: ["stomach", "pet", "abdomen", "digestive", "gas", "acidity", "constipation", "diarrhea", "loose motion"],
        response: `For your stomach problem:

IMMEDIATE RELIEF:
1. Halka khana khayen
2. Garam pani piyen
3. Thoda walk karein
4. Seedhe baithen

HOME REMEDIES:
- Jeera pani
- Adrak-pudina chai
- Dahi with jeera powder
- Nimbu pani with salt

DIET TIPS:
- Halka khana khayen
- Masaledar/Teekha na khayen
- Thoda thoda karke khayen
- Paani zyada piyen

WHEN TO SEE DOCTOR:
- Bahut tej dard ho
- Ulti/dast mein khoon ho
- Tez bukhar ho
- Continuous vomiting ho

Contact Dr. Patel: +91-9876543211
Emergency: 108`
    },

    respiratory: {
        symptoms: ["breathing", "saans", "cough", "khansi", "cold", "flu", "zukam", "chest congestion", "wheezing"],
        response: `For respiratory issues:

SYMPTOMS CHECK:
- Dry or wet cough?
- Breathing difficulty level?
- Any fever/body ache?
- How long persisting?

IMMEDIATE RELIEF:
1. Steam inhalation
2. Sit upright/proper posture
3. Stay hydrated
4. Avoid cold items

HOME REMEDIES:
- Tulsi-ginger-honey tea
- Turmeric milk
- Salt water gargle
- Steam with eucalyptus oil

BREATHING EXERCISES:
- Deep breathing
- Anulom Vilom
- Bhramari Pranayama

PREVENTIVE MEASURES:
- Wear mask in pollution
- Keep room ventilated
- Maintain humidity
- Regular exercise

WHEN TO SEE DOCTOR:
- Difficulty breathing
- Chest pain
- High fever
- Blue lips/face

Contact Dr. Khan (Pulmonologist): +91-9876543212
Emergency: 108`
    },

    joints: {
        symptoms: ["joint pain", "arthritis", "knee pain", "back pain", "shoulder pain", "ghutne dard", "kamar dard", "body pain"],
        response: `For joint and body pain:

SYMPTOMS CHECK:
- Which joints affected?
- Pain type (sharp/dull)?
- Any swelling/redness?
- Movement limitations?

IMMEDIATE RELIEF:
1. RICE method
   - Rest
   - Ice pack
   - Compression
   - Elevation
2. Gentle movement
3. Proper posture

HOME REMEDIES:
- Turmeric milk
- Hot/cold compress
- Epsom salt bath
- Ginger-garlic paste

EXERCISES:
- Gentle stretching
- Range of motion exercises
- Swimming/water therapy
- Light walking

PREVENTIVE CARE:
- Maintain healthy weight
- Good posture
- Regular exercise
- Calcium-rich diet

WHEN TO SEE DOCTOR:
- Severe pain
- Joint swelling
- Limited movement
- After injury

Contact Dr. Singh (Orthopedic): +91-9876543213
Emergency: 108`
    },

    skin: {
        symptoms: ["skin", "rash", "allergy", "itching", "khujli", "acne", "pimples", "daane", "skin infection"],
        response: `For skin-related issues:

SYMPTOMS CHECK:
- Affected area?
- Any itching/burning?
- How long present?
- Any known allergies?

IMMEDIATE RELIEF:
1. Don't scratch
2. Cool compress
3. Keep area clean
4. Wear loose clothes

HOME REMEDIES:
- Aloe vera gel
- Neem paste
- Coconut oil
- Calamine lotion

PREVENTIVE CARE:
- Daily cleansing
- Stay hydrated
- Balanced diet
- Sun protection

DIET TIPS:
- Vitamin C rich foods
- Omega-3 foods
- Anti-inflammatory foods
- Avoid trigger foods

WHEN TO SEE DOCTOR:
- Spreading rash
- Fever/pain
- Skin breaks/bleeds
- Severe allergic reaction

Contact Dr. Verma (Dermatologist): +91-9876543214
Emergency: 108`
    },

    mental: {
        symptoms: ["stress", "anxiety", "depression", "tension", "worry", "sleep", "mood", "mental health"],
        response: `For mental health support:

SYMPTOMS CHECK:
- Sleep patterns affected?
- Appetite changes?
- Concentration issues?
- Energy levels?

IMMEDIATE HELP:
1. Deep breathing
2. Grounding exercises
3. Talk to someone
4. Take a break

SELF-CARE:
- Regular sleep schedule
- Healthy diet
- Physical exercise
- Social connections

MINDFULNESS PRACTICES:
- Meditation
- Yoga
- Journaling
- Nature walks

LIFESTYLE CHANGES:
- Regular exercise
- Healthy sleep habits
- Time management
- Hobby activities

WHEN TO SEEK HELP:
- Persistent symptoms
- Affecting daily life
- Harmful thoughts
- Unable to cope

Contact Dr. Gupta (Psychiatrist): +91-9876543215
24/7 Mental Health Helpline: 1800-599-0019`
    },

    emergency: {
        symptoms: ["emergency", "accident", "urgent", "bleeding", "chest pain", "heart", "stroke", "unconscious"],
        response: `MEDICAL EMERGENCY CONTACTS:

IMMEDIATE ACTION REQUIRED:
Call Emergency Services: 108

24/7 SPECIALISTS:
- General Physician: +91-9876543210
- Cardiologist: +91-9876543211
- Neurologist: +91-9876543212
- Trauma Care: +91-9876543213

NEAREST HOSPITALS:
1. City General Hospital
   - Emergency: +91-1234567890
   - Address: City Center

2. Medical Institute
   - Emergency: +91-1234567891
   - Address: Main Road

WHILE WAITING FOR HELP:
1. Stay calm
2. Check breathing/pulse
3. Don't move if injury
4. Apply direct pressure if bleeding

Keep victim comfortable and monitor until help arrives.`
    },

    diabetes: {
        keywords: ["sugar", "diabetes", "blood sugar", "sugar level", "diabetes", "thirst", "frequent urination", "sugar ki bimari"],
        response: `For Diabetes Management:

SYMPTOMS TO CHECK:
- Baar baar peshab aana
- Bahut pyaas lagna
- Thakan mehsoos hona
- Dhundla dikhna
- Bhook zyada lagna
- Wounds ka der se thik hona

IMMEDIATE STEPS:
1. Regular sugar check karein
   - Fasting: 70-130 mg/dL
   - After meals: <180 mg/dL
2. Insulin/medicines time pe lein
3. Kuch meetha paas rakhein (low sugar ke liye)

DIET CONTROL:
- Carbs ko control karein
- High fiber foods khayein
- Regular meals lein, skip na karein
- Green vegetables zyada khayein
- Fruits with low glycemic index:
  * Amrud
  * Santra
  * Jamun
  * Seb

EXERCISE:
- Daily 30 min walking
- Yoga (especially Pranayama)
- Swimming ya cycling
- Surya Namaskar

PRECAUTIONS:
- Regular BP check
- Foot care daily
- Wounds ko ignore na karein
- Eye check-up har 6 months
- Stress se bachein

WHEN TO CONTACT DOCTOR:
- Sugar 250+ ho
- Chakkar aaye
- Bahut kamzori lage
- Chest pain ho

Contact Dr. Kumar (Diabetologist): +91-9876543220
Emergency: 108`
    },

    thyroid: {
        keywords: ["thyroid", "weight gain", "weight loss", "throid", "thyroid problem", "gala", "throat", "neck"],
        response: `For Thyroid Management:

SYMPTOMS TO CHECK:
Hypothyroid (Low thyroid):
- Weight gain
- Thakan
- Thand zyada lagna
- Dry skin
- Depression
- Periods irregular

Hyperthyroid (High thyroid):
- Weight loss
- Heart rate fast
- Anxiety
- Garmi zyada lagna
- Weakness

TESTS TO DO:
- T3, T4, TSH test
- Anti-TPO test
- Thyroid scan if needed

DIET RECOMMENDATIONS:
Good for Thyroid:
- Iodine rich foods
- Selenium rich foods
- Brazil nuts
- Sea food
- Green vegetables

Avoid:
- Processed foods
- Caffeine
- Goitrogenic foods raw form mein
  (gobi, muli, soya)

LIFESTYLE CHANGES:
1. Regular exercise
2. Yoga poses:
   - Sarvangasana
   - Matsyasana
   - Halasana
3. Meditation for stress
4. 7-8 hours sleep

MEDICINES:
- Subah khali pet lein
- Coffee/chai se 1 hour gap
- Regular time pe lein
- Doctor ke bina dose na badlein

WHEN TO SEE DOCTOR:
- Bahut weight gain/loss ho
- Depression/anxiety badhe
- Heart rate abnormal ho
- Pregnancy planning kar rahe hain

Contact Dr. Gupta (Endocrinologist): +91-9876543221
Regular check-up: Every 6-8 weeks`
    },

    bloodPressure: {
        keywords: ["bp", "blood pressure", "hypertension", "low bp", "high bp", "dizziness", "chakkar"],
        response: `For Blood Pressure Management:

HIGH BP (>140/90):
IMMEDIATE STEPS:
1. Shaant ho jaayein
2. Deep breathing karein
3. Rest karein
4. BP check karein

LOW BP (<90/60):
IMMEDIATE STEPS:
1. Let jaayein ya baith jaayein
2. Paani mein namak daalkar piyein
3. Legs thoda upar rakhein
4. Tight clothes loose karein

DAILY MONITORING:
- Subah shaam BP check
- Reading note karein
- Doctor ko report karein
- BP diary maintain karein

DIET FOR HIGH BP:
Avoid:
- Namak kam karein
- Fried foods
- Processed foods
- Caffeine
- Alcohol

Recommended:
- Fresh fruits
- Green vegetables
- Whole grains
- Low-fat dairy
- DASH diet follow karein

LIFESTYLE CHANGES:
1. Weight control
2. Daily exercise:
   - 30 min walking
   - Swimming
   - Cycling
3. Stress management:
   - Meditation
   - Deep breathing
   - Yoga
4. Smoking/alcohol quit karein

EMERGENCY SIGNS:
High BP:
- Severe headache
- Vision problems
- Chest pain
- Breathing difficulty

Low BP:
- Bahut chakkar
- Behoshi
- Cold, clammy skin
- Confusion

Contact Dr. Verma (Cardiologist): +91-9876543222
Emergency: 108`
    },

    backPain: {
        keywords: ["back pain", "kamar dard", "spine", "slipped disc", "reedh", "lower back"],
        response: `For Back Pain Management:

IMMEDIATE RELIEF:
1. Hot/cold compress
2. Rest (2-3 days max)
3. Correct posture
4. Light stretching

EXERCISES:
1. Core strengthening:
   - Pelvic tilts
   - Bridge pose
   - Cat-cow stretch
2. Hamstring stretches
3. Swimming
4. Walking

LIFESTYLE CHANGES:
1. Correct posture:
   - Seedha baithen
   - Computer height sahi karein
   - Phone neck angle
2. Ergonomic chair use
3. Heavy lifting avoid
4. Regular breaks from sitting

YOGA ASANAS:
- Bhujangasana
- Balasana
- Marjaryasana
- Makarasana

PRECAUTIONS:
1. Mattress:
   - Medium-firm
   - Ortho mattress
2. Footwear:
   - Comfortable
   - Good arch support
3. Weight:
   - Healthy weight maintain
   - Belly fat reduce

WHEN TO SEE DOCTOR:
- Legs mein weakness/numbness
- Bathroom control issues
- Fever with back pain
- Injury ke baad pain
- Pain 6 weeks se zyada

Contact Dr. Singh (Orthopedic): +91-9876543223
Physiotherapist: +91-9876543224`
    },

    arthritis: {
        keywords: ["joint pain", "arthritis", "knee pain", "ghutne", "joints", "jodon me dard"],
        response: `For Arthritis & Joint Pain:

TYPES OF PAIN:
1. Osteoarthritis:
   - Age related
   - Movement pe pain
   - Morning stiffness
2. Rheumatoid:
   - Auto-immune
   - Multiple joints
   - Morning pain zyada

IMMEDIATE RELIEF:
1. RICE method:
   - Rest
   - Ice pack
   - Compression
   - Elevation
2. Hot water bottle
3. Pain relief cream
4. Light massage

EXERCISES:
1. Range of motion:
   - Joint rotation
   - Gentle stretching
2. Strength training:
   - Light weights
   - Resistance bands
3. Low impact:
   - Swimming
   - Cycling
   - Walking

DIET TIPS:
Anti-inflammatory foods:
- Haldi wala doodh
- Fish oil
- Dry fruits
- Green vegetables
- Berries

Avoid:
- Fried foods
- Red meat
- Excess sugar
- Alcohol

LIFESTYLE CHANGES:
1. Weight management
2. Regular exercise
3. Joint protection:
   - Assist devices
   - Proper techniques
4. Good posture

WHEN TO SEE DOCTOR:
- Severe swelling
- Red, hot joints
- Fever with pain
- Movement difficult
- New symptoms

Contact Dr. Sharma (Rheumatologist): +91-9876543225
Physiotherapy: +91-9876543226`
    },

    heartProblems: {
        keywords: ["heart", "chest pain", "heart attack", "cardiac", "dil", "seene me dard", "heart problem"],
        response: `For Heart Problems:

EMERGENCY SYMPTOMS:
- Chest pain/pressure
- Left arm pain
- Breathing difficulty
- Sweating
- Jaw/neck pain
- Chakkar aana

IMMEDIATE ACTION:
1. Call emergency: 108
2. Aspirin 300mg (if available)
3. Rest, sit up position
4. Tight clothes loose karein
5. AC/fan on karein

PREVENTION:
1. Diet control:
   - Low fat diet
   - Less salt
   - No processed food
   - More fruits/vegetables
2. Exercise:
   - Daily 30 min walk
   - Light exercises
   - Yoga
3. Stress management:
   - Meditation
   - Deep breathing
   - Regular rest

RISK FACTORS TO CONTROL:
1. BP control
2. Diabetes control
3. Cholesterol check
4. Weight management
5. Smoking/alcohol quit

REGULAR MONITORING:
- BP check daily
- ECG every 6 months
- Lipid profile
- Stress test yearly
- Echo if prescribed

EMERGENCY CONTACTS:
Cardiologist: Dr. Patel: +91-9876543227
Heart Hospital: +91-9876543228
Ambulance: 108

Keep these handy:
- Doctor numbers
- Medical reports
- Insurance cards
- Family emergency contacts`
    },

    mentalHealth: {
        keywords: ["depression", "anxiety", "stress", "tension", "mental", "dimag", "worry", "ghabrahat"],
        response: `For Mental Health Support:

IMMEDIATE HELP:
1. Deep breathing:
   - 4-7-8 technique
   - Box breathing
2. Grounding exercises
3. Talk to someone
4. Safe space find karein

ANXIETY MANAGEMENT:
1. Breathing exercises
2. Progressive muscle relaxation
3. Meditation
4. Walk in nature
5. Journal writing

DEPRESSION SUPPORT:
1. Daily routine maintain
2. Small tasks complete
3. Social connection
4. Light exercise
5. Sunlight exposure

LIFESTYLE CHANGES:
1. Sleep schedule:
   - Fixed time
   - 7-8 hours
   - No screens before bed
2. Exercise:
   - Daily 30 mins
   - Yoga
   - Walking
3. Diet:
   - Regular meals
   - Healthy food
   - Less caffeine
4. Social:
   - Family time
   - Friend connections
   - Support groups

PROFESSIONAL HELP:
When to seek:
- Daily life affected
- Sleep/appetite changes
- Continuous low mood
- Suicidal thoughts
- Panic attacks

24/7 HELPLINES:
Mental Health: 1800-599-0019
Suicide Prevention: 9152987821

DOCTORS:
Psychiatrist: Dr. Kumar +91-9876543229
Counselor: Ms. Sharma +91-9876543230`
    },

    pregnancy: {
        keywords: ["pregnancy", "pregnant", "conceive", "period miss", "garbhawastha", "pet me bachcha"],
        response: `For Pregnancy Care:

FIRST STEPS:
1. Doctor se confirm karein
2. Folic acid start
3. Diet improve
4. Rest increase

REGULAR CHECK-UPS:
Monthly tests:
- BP check
- Weight check
- Urine test
- Blood tests
- Ultrasound (as advised)

DIET PLAN:
Recommended:
- Protein rich foods
- Green vegetables
- Fruits
- Dairy products
- Nuts & dry fruits

Avoid:
- Raw foods
- Caffeine
- Unpasteurized dairy
- High mercury fish
- Street food

EXERCISE:
Safe exercises:
- Walking
- Prenatal yoga
- Swimming
- Light stretching

WARNING SIGNS:
Contact doctor if:
- Bleeding ho
- Severe pain ho
- High fever
- Less movement
- Water break
- High BP

LIFESTYLE TIPS:
1. Rest regularly
2. Stay hydrated
3. No smoking/alcohol
4. Light exercise
5. Stress avoid

TRIMESTER WISE CARE:
First Trimester:
- Morning sickness
- Rest zyada
- Small frequent meals

Second Trimester:
- Energy better
- Exercise start
- Baby movement

Third Trimester:
- Regular checkups
- Hospital bag ready
- Birth plan discuss

Emergency Contact:
Dr. Gupta (Gynecologist): +91-9876543231
Hospital Emergency: +91-9876543232`
    }
};

// Function to get appropriate response
function getResponse(message) {
    message = message.toLowerCase().trim();
    
    // Check for greetings
    if (message.match(/^(hi|hello|hey|namaste|hii|hiii|hiiii)/i)) {
        return "Namaste! Main aapka E-Swasthya medical assistant hoon. Aap apni health problem batayein, main aapki help karunga.";
    }

    // Check for help keywords
    if (message.includes('help') || message.includes('madad') || message.includes('problem')) {
        return "Main aapki kya help kar sakta hoon? Aap apni problem detail mein batayein (jaise sar dard, pet dard, bukhar, etc.)";
    }

    // Check message against all medical conditions
    for (const [condition, data] of Object.entries(medicalResponses)) {
        if (data.keywords.some(keyword => message.includes(keyword))) {
            return data.response;
        }
    }

    // Default response if no condition matches
    return `Main aapki help karna chahta hoon. Kripya batayein:

1. Kahan dard/takleef hai?
2. Kitne time se hai?
3. Koi aur symptoms hain?
4. Koi medicine li hai?

Ya emergency ke liye doctor ka number chahiye to batayen.`;
}

// DOM Elements
const chatMessages = document.querySelector('.chatbot-messages');
const chatInput = document.querySelector('.chatbot-input input');
const sendButton = document.querySelector('.send-btn');
const voiceButton = document.querySelector('.voice-input-btn');
const chatbotBtn = document.querySelector('.chatbot-btn');
const chatbotWidget = document.querySelector('.chatbot-widget');
const closeChatBtn = document.querySelector('.close-chat');

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
    // Show initial message
    if (chatbotWidget) {
        addMessageToChat('bot', "Hello! I'm your E-Swasthya medical assistant. How can I help you today? Please describe your health concern or symptoms.");
    }
});

// Toggle chatbot visibility
chatbotBtn.addEventListener('click', () => {
    chatbotWidget.style.display = chatbotWidget.style.display === 'none' ? 'flex' : 'none';
});

closeChatBtn.addEventListener('click', () => {
    chatbotWidget.style.display = 'none';
});

// Send message function
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat('user', message);
    chatInput.value = '';

    // Show typing indicator
    addTypingIndicator();

    // Get and display bot response after a short delay
    setTimeout(() => {
        removeTypingIndicator();
        const response = getResponse(message);
        addMessageToChat('bot', response);
    }, 1000);
}

// Add message to chat
function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    // Convert line breaks to HTML
    message = message.replace(/\n/g, '<br>');
    messageDiv.innerHTML = message;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add typing indicator
function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot-message', 'typing-indicator');
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = chatMessages.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Event listeners
if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Voice input functionality
let isRecording = false;
if ('webkitSpeechRecognition' in window && voiceButton) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN'; // Set to Hindi

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        sendMessage();
    };

    voiceButton.addEventListener('click', () => {
        if (!isRecording) {
            recognition.start();
            voiceButton.classList.add('recording');
        } else {
            recognition.stop();
            voiceButton.classList.remove('recording');
        }
        isRecording = !isRecording;
    });
} 