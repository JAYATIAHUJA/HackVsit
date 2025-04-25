// DOM Elements
const appointmentForm = document.getElementById('appointmentForm');
const hospitalSelect = document.getElementById('hospital');
const departmentSelect = document.getElementById('department');
const doctorSelect = document.getElementById('doctor');
const dateInput = document.getElementById('date');
const timeSelect = document.getElementById('time');
const reasonInput = document.getElementById('reason');
const notesInput = document.getElementById('notes');

// Summary Elements
const summaryHospital = document.getElementById('summaryHospital');
const summaryDoctor = document.getElementById('summaryDoctor');
const summaryDate = document.getElementById('summaryDate');
const summaryTime = document.getElementById('summaryTime');

// Update Summary
function updateSummary() {
    summaryHospital.textContent = hospitalSelect.options[hospitalSelect.selectedIndex].text;
    summaryDoctor.textContent = doctorSelect.options[doctorSelect.selectedIndex].text;
    summaryDate.textContent = dateInput.value ? new Date(dateInput.value).toLocaleDateString() : 'Not selected';
    summaryTime.textContent = timeSelect.options[timeSelect.selectedIndex].text;
}

// Handle Form Submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }

    // Collect form data
    const formData = {
        hospital: hospitalSelect.value,
        department: departmentSelect.value,
        doctor: doctorSelect.value,
        date: dateInput.value,
        time: timeSelect.value,
        reason: reasonInput.value,
        notes: notesInput.value
    };

    // Simulate API call
    submitAppointment(formData);
}

// Validate Form
function validateForm() {
    let isValid = true;
    const requiredFields = [hospitalSelect, departmentSelect, doctorSelect, dateInput, timeSelect];
    
    requiredFields.forEach(field => {
        if (!field.value) {
            showError(`${field.previousElementSibling.textContent} is required`);
            isValid = false;
        }
    });

    if (dateInput.value) {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        
        if (selectedDate < today) {
            showError('Please select a future date');
            isValid = false;
        }
    }

    return isValid;
}

// Submit Appointment
function submitAppointment(data) {
    // Simulate API call
    console.log('Submitting appointment:', data);
    
    // Show loading state
    const submitBtn = appointmentForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Booking...';
    
    setTimeout(() => {
        // Reset form
        appointmentForm.reset();
        updateSummary();
        
        // Show success message
        showSuccess('Appointment booked successfully!');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Appointment';
        
        // Add to upcoming appointments
        addToUpcomingAppointments(data);
    }, 1500);
}

// Add to Upcoming Appointments
function addToUpcomingAppointments(data) {
    const appointmentsList = document.querySelector('.appointments-list');
    const appointmentCard = document.createElement('div');
    appointmentCard.className = 'appointment-card';
    
    appointmentCard.innerHTML = `
        <div class="appointment-header">
            <h3>${doctorSelect.options[doctorSelect.selectedIndex].text}</h3>
            <span class="status pending">Pending</span>
        </div>
        <div class="appointment-details">
            <p><i class="fas fa-hospital"></i> ${hospitalSelect.options[hospitalSelect.selectedIndex].text}</p>
            <p><i class="fas fa-calendar"></i> ${new Date(data.date).toLocaleDateString()}</p>
            <p><i class="fas fa-clock"></i> ${timeSelect.options[timeSelect.selectedIndex].text}</p>
        </div>
        <div class="appointment-actions">
            <button class="reschedule-btn">Reschedule</button>
            <button class="cancel-btn">Cancel</button>
        </div>
    `;
    
    appointmentsList.prepend(appointmentCard);
}

// Handle Reschedule
function handleReschedule(event) {
    if (event.target.classList.contains('reschedule-btn')) {
        const appointmentCard = event.target.closest('.appointment-card');
        const doctorName = appointmentCard.querySelector('h3').textContent;
        const hospitalName = appointmentCard.querySelector('.appointment-details p:first-child').textContent;
        
        // Pre-fill form with appointment details
        hospitalSelect.value = Array.from(hospitalSelect.options).find(option => option.text === hospitalName)?.value || '';
        doctorSelect.value = Array.from(doctorSelect.options).find(option => option.text === doctorName)?.value || '';
        
        // Scroll to form
        appointmentForm.scrollIntoView({ behavior: 'smooth' });
        
        // Remove old appointment
        appointmentCard.remove();
    }
}

// Handle Cancel
function handleCancel(event) {
    if (event.target.classList.contains('cancel-btn')) {
        const appointmentCard = event.target.closest('.appointment-card');
        
        if (confirm('Are you sure you want to cancel this appointment?')) {
            appointmentCard.remove();
            showSuccess('Appointment cancelled successfully');
        }
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

// Event Listeners
appointmentForm.addEventListener('submit', handleFormSubmit);

// Update summary when form fields change
[hospitalSelect, doctorSelect, dateInput, timeSelect].forEach(field => {
    field.addEventListener('change', updateSummary);
});

// Handle appointment actions
document.querySelector('.appointments-list').addEventListener('click', (event) => {
    handleReschedule(event);
    handleCancel(event);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}); 