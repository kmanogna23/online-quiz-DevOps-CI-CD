localStorage.clear();
// 1. Data Definitions
const quizzes = [
    { id: 1, name: 'Docker 101', icon: 'fa-docker' },
    { id: 2, name: 'Kubernetes basics', icon: 'fa-dharmachakra' },
    { id: 3, name: 'Cloud AWS', icon: 'fa-aws' }
];

let currentSlide = 0;

// 2. Navigation Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    // Show target section
    document.getElementById(`section-${sectionId}`).classList.add('active');
    
    // Update Nav Link Active state
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(`nav-${sectionId}`).classList.add('active');
}

// 3. Login/Logout Logic
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    localStorage.setItem('currentUser', user); // Remember user
    loadApp(user);
});

function logout() {
    localStorage.removeItem('currentUser'); // Forget user
    showScreen('login-page');
}

function loadApp(user) {
    document.getElementById('user-display').innerText = `Hello, ${user}`;
    renderQuizzes();
    showScreen('dashboard-page');
}

// 4. Slider Logic
function moveSlide(dir) {
    const slider = document.getElementById('slider');
    const total = document.querySelectorAll('.slide').length;
    currentSlide = (currentSlide + dir + total) % total;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// 5. Quiz Rendering
function renderQuizzes() {
    const list = document.getElementById('quiz-list');
    list.innerHTML = quizzes.map(q => `
        <div class="quiz-card" onclick="alert('Starting ${q.name}...')">
            <i class="fab ${q.icon} fa-3x" style="color: #6366f1"></i>
            <h3>${q.name}</h3>
            <p>5 Questions</p>
        </div>
    `).join('');
}

// 6. INITIALIZATION (This solves your issue)
window.onload = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        loadApp(savedUser);
    } else {
        showScreen('login-page'); // Force login page on start
    }
};

const themeToggle = document.getElementById('theme-toggle');
const body = document.documentElement; // Targets <html> for data-theme

// Check for saved theme in localStorage
const currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);
updateIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    let theme = body.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // Save preference
    updateIcon(newTheme);
});

function updateIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'light') {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

