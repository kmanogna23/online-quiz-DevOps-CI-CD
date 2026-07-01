// FORCES LOGIN PAGE TO SHOW BY CLEARING OLD DATA SESSIONS ONCE
if (!localStorage.getItem('app_initialized')) {
    localStorage.clear();
    localStorage.setItem('app_initialized', 'true');
}

// 1. Data Definitions
const quizzes = [
    { id: 1, name: 'Docker 101', icon: 'fa-docker' },
    { id: 2, name: 'Kubernetes Basics', icon: 'fa-dharmachakra' },
    { id: 3, name: 'Cloud AWS', icon: 'fa-aws' }
];

const quizQuestions = {
    1: [
        { q: "What tool helps build container images automatically?", options: ["Docker Compose", "Dockerfile", "Docker Hub", "Kubernetes"], answer: 1 },
        { q: "Which command runs a container detached in the background?", options: ["docker run -b", "docker start", "docker run -d", "docker execute"], answer: 2 },
        { q: "What is the primary layer difference between an image and a container?", options: ["No difference", "Read-only layer", "Writable layer", "None of these"], answer: 2 }
    ],
    2: [
        { q: "What is the smallest deployable computing unit in Kubernetes?", options: ["Service", "Pod", "Node", "Deployment"], answer: 1 },
        { q: "Which tool acts as the command line interface for running K8s tasks?", options: ["kubeadm", "minikube", "kubectl", "docker"], answer: 2 }
    ],
    3: [
        { q: "Which AWS service offers scalable virtual computing servers?", options: ["S3", "EC2", "RDS", "Lambda"], answer: 1 },
        { q: "What system manages programmatic permissions and API access safely?", options: ["IAM", "VPC", "CloudTrail", "Route53"], answer: 0 }
    ]
};

// Application State Variables
let currentSlide = 0;
let activeQuizId = null;
let currentQuestionIndex = 0;
let runningScore = 0;

// 2. Navigation Control Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${sectionId}`).classList.add('active');
    
    const slider = document.getElementById('dashboard-slider');
    if (sectionId === 'gameplay') {
        slider.style.display = 'none';
    } else {
        slider.style.display = 'block';
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const navLink = document.getElementById(`nav-${sectionId}`);
        if(navLink) navLink.classList.add('active');
    }
}

// 3. Quiz Gameplay Core Logic
function startQuiz(quizId) {
    activeQuizId = quizId;
    currentQuestionIndex = 0;
    runningScore = 0;
    
    showSection('gameplay');
    loadQuestion();
}

function loadQuestion() {
    const quizData = quizzes.find(q => q.id === activeQuizId);
    const questions = quizQuestions[activeQuizId];
    
    if (!questions || currentQuestionIndex >= questions.length) {
        endQuiz(questions ? questions.length : 0);
        return;
    }

    const questionData = questions[currentQuestionIndex];
    
    document.getElementById('gameplay-quiz-title').innerText = quizData.name;
    document.getElementById('gameplay-progress').innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    
    const percentage = (currentQuestionIndex / questions.length) * 100;
    document.getElementById('gameplay-progress-bar').style.width = `${percentage}%`;
    
    document.getElementById('gameplay-question').innerText = questionData.q;
    
    const optionsContainer = document.getElementById('gameplay-options');
    optionsContainer.innerHTML = questionData.options.map((opt, index) => `
        <button class="option-btn" onclick="handleAnswerSelection(${index})">${opt}</button>
    `).join('');
}

function handleAnswerSelection(selectedIndex) {
    const questions = quizQuestions[activeQuizId];
    if (selectedIndex === questions[currentQuestionIndex].answer) {
        runningScore++;
    }
    
    currentQuestionIndex++;
    loadQuestion();
}

function endQuiz(totalQuestions) {
    document.getElementById('gameplay-progress-bar').style.width = '100%';
    
    setTimeout(() => {
        document.getElementById('final-score').innerText = `${runningScore} / ${totalQuestions}`;
        showScreen('result-page');
    }, 300);
}

// 4. Login/Logout Access Architecture
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    if (user) {
        localStorage.setItem('currentUser', user);
        loadApp(user);
    }
});

function logout() {
    localStorage.removeItem('currentUser');
    showScreen('login-page');
}

function loadApp(user) {
    document.getElementById('user-display').innerText = `Hello, ${user}`;
    renderQuizzes();
    showScreen('dashboard-page');
    showSection('quizzes');
}

// 5. Featured Dashboard Slider Navigation
function moveSlide(dir) {
    const slider = document.getElementById('slider');
    const total = document.querySelectorAll('.slide').length;
    currentSlide = (currentSlide + dir + total) % total;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// 6. Component Element Renderers
function renderQuizzes() {
    const list = document.getElementById('quiz-list');
    list.innerHTML = quizzes.map(q => `
        <div class="quiz-card" onclick="startQuiz(${q.id})">
            <i class="fab ${q.icon} fa-3x" style="color: #6366f1"></i>
            <h3>${q.name}</h3>
            <p>${quizQuestions[q.id] ? quizQuestions[q.id].length : 0} Questions</p>
        </div>
    `).join('');
}

// 7. INITIALIZATION RUNNER
window.onload = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        loadApp(savedUser);
    } else {
        showScreen('login-page');
    }
};

// System Appearance configuration modules
const themeToggle = document.getElementById('theme-toggle');
const body = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);
updateIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    let theme = body.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
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