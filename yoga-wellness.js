// Sample Data
const yogaPoses = [
    {
        id: 1,
        name: 'Mountain Pose (Tadasana)',
        description: 'A foundational standing pose that improves posture and balance. Stand with feet together, arms at sides, and spine elongated.',
        difficulty: 'beginner',
        image: 'https://source.unsplash.com/800x600/?yoga-mountain-pose',
        benefits: ['Improves posture', 'Strengthens thighs and ankles', 'Increases body awareness']
    },
    {
        id: 2,
        name: 'Downward-Facing Dog (Adho Mukha Svanasana)',
        description: 'A classic yoga pose that stretches and strengthens the entire body. Form an inverted V shape with your body.',
        difficulty: 'beginner',
        image: 'https://source.unsplash.com/800x600/?yoga-downward-dog',
        benefits: ['Strengthens arms and legs', 'Stretches back and shoulders', 'Calms the mind']
    },
    {
        id: 3,
        name: 'Warrior I (Virabhadrasana I)',
        description: 'A powerful standing pose that builds strength and stability. Step one foot back and raise arms overhead.',
        difficulty: 'intermediate',
        image: 'https://source.unsplash.com/800x600/?yoga-warrior',
        benefits: ['Strengthens legs', 'Opens hip flexors', 'Improves balance']
    },
    {
        id: 4,
        name: 'Tree Pose (Vrksasana)',
        description: 'A balancing pose that promotes focus and concentration. Stand on one leg with the other foot placed on the inner thigh.',
        difficulty: 'beginner',
        image: 'https://source.unsplash.com/800x600/?yoga-tree-pose',
        benefits: ['Improves balance', 'Strengthens legs', 'Increases focus']
    },
    {
        id: 5,
        name: 'Child\'s Pose (Balasana)',
        description: 'A gentle resting pose that promotes relaxation and stress relief. Kneel and fold forward with arms extended.',
        difficulty: 'beginner',
        image: 'https://source.unsplash.com/800x600/?yoga-childs-pose',
        benefits: ['Relieves stress', 'Stretches back', 'Promotes relaxation']
    },
    {
        id: 6,
        name: 'Cobra Pose (Bhujangasana)',
        description: 'A backbend that strengthens the spine and opens the chest. Lie on your stomach and lift your upper body.',
        difficulty: 'intermediate',
        image: 'https://source.unsplash.com/800x600/?yoga-cobra-pose',
        benefits: ['Strengthens spine', 'Opens chest', 'Improves posture']
    }
];

const meditationGuides = [
    {
        id: 1,
        title: 'Mindful Breathing (Pranayama)',
        duration: '10 minutes',
        difficulty: 'beginner',
        description: 'A simple meditation focusing on breath awareness. Sit comfortably and observe your natural breath.'
    },
    {
        id: 2,
        title: 'Body Scan Meditation',
        duration: '20 minutes',
        difficulty: 'intermediate',
        description: 'Progressive relaxation through body awareness. Systematically scan and release tension from each body part.'
    },
    {
        id: 3,
        title: 'Loving-Kindness Meditation (Metta)',
        duration: '15 minutes',
        difficulty: 'beginner',
        description: 'Cultivate compassion and positive emotions. Send well-wishes to yourself and others.'
    },
    {
        id: 4,
        title: 'Transcendental Meditation',
        duration: '20 minutes',
        difficulty: 'advanced',
        description: 'A technique for transcending thought and experiencing pure awareness. Requires proper instruction.'
    }
];

const wellnessTips = [
    {
        id: 1,
        category: 'Nutrition',
        title: 'Mindful Eating',
        content: 'Practice eating slowly and without distractions to improve digestion and satisfaction.'
    },
    {
        id: 2,
        category: 'Sleep',
        title: 'Better Sleep Habits',
        content: 'Maintain a consistent sleep schedule and create a relaxing bedtime routine.'
    },
    {
        id: 3,
        category: 'Stress Management',
        title: 'Daily Meditation',
        content: 'Take 10 minutes each day for meditation to reduce stress and anxiety.'
    }
];

const classSchedule = [
    {
        id: 1,
        name: 'Morning Flow',
        instructor: 'Sarah Johnson',
        time: '7:00 AM',
        day: 'Monday',
        level: 'All Levels',
        type: 'yoga',
        duration: '60'
    },
    {
        id: 2,
        name: 'Power Yoga',
        instructor: 'Mike Chen',
        time: '5:30 PM',
        day: 'Tuesday',
        level: 'Intermediate',
        type: 'yoga',
        duration: '45'
    },
    {
        id: 3,
        name: 'Gentle Yoga',
        instructor: 'Emma Wilson',
        time: '9:00 AM',
        day: 'Wednesday',
        level: 'Beginner',
        type: 'yoga',
        duration: '30'
    }
];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    renderYogaPoses();
    renderMeditationGuides();
    renderWellnessTips();
    renderClassSchedule();
    initializeCarousel();
    setupEventListeners();
}

// Render Functions
function renderYogaPoses() {
    const posesGrid = document.querySelector('.poses-grid');
    if (!posesGrid) return;

    posesGrid.innerHTML = yogaPoses.map(pose => `
        <div class="pose-card fade-in" data-difficulty="${pose.difficulty}">
            <img src="${pose.image}" alt="${pose.name}">
            <div class="pose-card-content">
                <h3>${pose.name}</h3>
                <p>${pose.description}</p>
                <div class="difficulty-badge ${pose.difficulty}">${pose.difficulty}</div>
                <ul class="benefits">
                    ${pose.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

function renderMeditationGuides() {
    const meditationGrid = document.querySelector('.meditation-grid');
    if (!meditationGrid) return;

    meditationGrid.innerHTML = meditationGuides.map(guide => `
        <div class="meditation-card fade-in">
            <h3>${guide.title}</h3>
            <p>${guide.description}</p>
            <div class="meditation-details">
                <span>Duration: ${guide.duration}</span>
                <span>Level: ${guide.difficulty}</span>
            </div>
        </div>
    `).join('');
}

function renderWellnessTips() {
    const wellnessCarousel = document.querySelector('.wellness-carousel');
    if (!wellnessCarousel) return;

    wellnessCarousel.innerHTML = wellnessTips.map(tip => `
        <div class="wellness-tip fade-in">
            <h3>${tip.title}</h3>
            <span class="category">${tip.category}</span>
            <p>${tip.content}</p>
        </div>
    `).join('');
}

function renderClassSchedule() {
    const scheduleGrid = document.querySelector('.schedule-grid');
    if (!scheduleGrid) return;

    scheduleGrid.innerHTML = classSchedule.map(class_ => `
        <div class="schedule-card fade-in" 
             data-day="${class_.day}" 
             data-level="${class_.level}"
             data-type="${class_.type}"
             data-duration="${class_.duration}">
            <h3>${class_.name}</h3>
            <p>Instructor: ${class_.instructor}</p>
            <p>Time: ${class_.time}</p>
            <p>Day: ${class_.day}</p>
            <p>Level: ${class_.level}</p>
            <p>Duration: ${class_.duration} mins</p>
            <button class="cta-button">Book Class</button>
        </div>
    `).join('');
}

// Carousel Functionality
function initializeCarousel() {
    const carousel = document.querySelector('.wellness-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!carousel || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const tipWidth = carousel.querySelector('.wellness-tip')?.offsetWidth || 0;

    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateCarouselPosition();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(currentIndex + 1, wellnessTips.length - 1);
        updateCarouselPosition();
    });

    function updateCarouselPosition() {
        carousel.style.transform = `translateX(-${currentIndex * tipWidth}px)`;
    }
}

// Event Listeners
function setupEventListeners() {
    // Schedule Filtering
    const classTypeFilter = document.querySelector('#classType');
    const difficultyFilter = document.querySelector('#difficulty');
    const durationFilter = document.querySelector('#duration');

    if (classTypeFilter) {
        classTypeFilter.addEventListener('change', filterSchedule);
    }

    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', filterSchedule);
    }

    if (durationFilter) {
        durationFilter.addEventListener('change', filterSchedule);
    }

    // Class Booking
    document.querySelectorAll('.schedule-card .cta-button').forEach(button => {
        button.addEventListener('click', handleClassBooking);
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Filter Schedule
function filterSchedule() {
    const classTypeFilter = document.querySelector('#classType');
    const difficultyFilter = document.querySelector('#difficulty');
    const durationFilter = document.querySelector('#duration');
    const cards = document.querySelectorAll('.schedule-card');

    cards.forEach(card => {
        const typeMatch = classTypeFilter.value === 'all' || card.dataset.type === classTypeFilter.value;
        const difficultyMatch = difficultyFilter.value === 'all' || card.dataset.level === difficultyFilter.value;
        const durationMatch = durationFilter.value === 'all' || card.dataset.duration === durationFilter.value;
        
        card.style.display = typeMatch && difficultyMatch && durationMatch ? 'block' : 'none';
    });
}

// Handle Class Booking
function handleClassBooking(e) {
    const card = e.target.closest('.schedule-card');
    const className = card.querySelector('h3').textContent;
    const time = card.querySelector('p:nth-child(3)').textContent;
    
    alert(`Thank you for booking ${className} at ${time}! A confirmation email will be sent shortly.`);
}

// Progress Tracking (placeholder)
function updateProgress() {
    // This would typically connect to a backend to fetch user progress
    const progress = {
        classesAttended: 12,
        minutesPracticed: 360,
        streakDays: 7
    };

    const progressChart = document.querySelector('.progress-chart');
    if (progressChart) {
        progressChart.innerHTML = `
            <h3>Your Progress</h3>
            <div class="progress-stats">
                <div>Classes Attended: ${progress.classesAttended}</div>
                <div>Minutes Practiced: ${progress.minutesPracticed}</div>
                <div>Current Streak: ${progress.streakDays} days</div>
            </div>
        `;
    }
}

// Scroll to Classes Section
function scrollToClasses() {
    const scheduleSection = document.querySelector('.schedule-section');
    if (scheduleSection) {
        scheduleSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Initialize progress tracking
updateProgress(); 