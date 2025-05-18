/* DJ Portfolio and Social Media Dashboard Frontend Script */

const audioPlayers = document.querySelectorAll('audio');
const playButtons = document.querySelectorAll('.fa-play');


// Audio player initialization
playButtons.forEach((button, index) => {
    const player = audioPlayers[index];
    const container = button.closest('.bg-gradient');

    if (player && container) {
        container.addEventListener('click', async (e) => {
            if (!e.target.closest('audio')) {
                try {
                    if (player.paused) {
                        // Stop all other players
                        audioPlayers.forEach(p => {
                            if (p !== player && !p.paused) {
                                p.pause();
                                p.currentTime = 0;
                                const btn = p.closest('.bg-gradient').querySelector('.fa-pause');
                                if (btn) {
                                    btn.classList.remove('fa-pause');
                                    btn.classList.add('fa-play');
                                }
                            }
                        });
                        // Play clicked player
                        await player.play();
                        button.classList.remove('fa-play');
                        button.classList.add('fa-pause');
                    } else {
                        await player.pause();
                        button.classList.remove('fa-pause');
                        button.classList.add('fa-play');
                    }
                } catch (error) {
                    console.error('Playback interrupted or audio not loaded:', error);
                }
            }
        });

        player.addEventListener('ended', () => {
            button.classList.remove('fa-pause');
            button.classList.add('fa-play');
        });
    }
});

// Smooth scrolling navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            audioPlayers.forEach(player => {
                if (!player.paused) {
                    player.pause();
                    player.currentTime = 0;
                    const btn = player.closest('.bg-gradient').querySelector('.fa-pause');
                    if (btn) {
                        btn.classList.remove('fa-pause');
                        btn.classList.add('fa-play');
                    }
                }
            });
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const mobileMenuButton = document.querySelector('.md\\:hidden button');
const mobileMenu = document.querySelector('.hidden.md\\:flex');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
        mobileMenu.classList.toggle('flex-col');
        mobileMenu.classList.toggle('absolute');
        mobileMenu.classList.toggle('top-16');
        mobileMenu.classList.toggle('left-0');
        mobileMenu.classList.toggle('right-0');
        mobileMenu.classList.toggle('bg-black');
        mobileMenu.classList.toggle('p-4');
    });
}

// Gradient text animation
const gradientTexts = document.querySelectorAll('.gradient-text');
gradientTexts.forEach(text => {
    text.style.transition = 'all 0.3s ease';
    text.addEventListener('mouseover', () => {
        text.style.transform = 'scale(1.05)';
    });
    text.addEventListener('mouseout', () => {
        text.style.transform = 'scale(1)';
    });
});

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const updateActiveNav = () => {
    let current = '';
    const scrollY = window.scrollY || window.pageYOffset;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-[#4ECDC4]');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('text-[#4ECDC4]');
        }
    });
};

window.addEventListener('scroll', updateActiveNav);

// Live estimated time testing indicator
const testingDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
let testingStartTime = null;
let testingTimerInterval = null;

function startTestingTimer() {
    testingStartTime = Date.now();
    testingTimerInterval = setInterval(updateTestingTimer, 1000);
}

function updateTestingTimer() {
    const elapsed = Date.now() - testingStartTime;
    const remaining = testingDuration - elapsed;
    if (remaining <= 0) {
        clearInterval(testingTimerInterval);
        displayTestingTime('Testing time completed');
        return;
    }
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    const timeString = \`\${hours.toString().padStart(2,'0')}:\${minutes.toString().padStart(2,'0')}:\${seconds.toString().padStart(2,'0')}\`;
    displayTestingTime(\`Time left: \${timeString}\`);
}

function displayTestingTime(message) {
    let timerElement = document.getElementById('testing-timer');
    if (!timerElement) {
        timerElement = document.createElement('div');
        timerElement.id = 'testing-timer';
        timerElement.style.position = 'fixed';
        timerElement.style.bottom = '10px';
        timerElement.style.right = '10px';
        timerElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
        timerElement.style.color = '#4ECDC4';
        timerElement.style.padding = '8px 12px';
        timerElement.style.borderRadius = '8px';
        timerElement.style.fontFamily = 'monospace';
        timerElement.style.zIndex = '10000';
        document.body.appendChild(timerElement);
    }
    timerElement.textContent = message;
}

// Start the timer when the script loads
startTestingTimer();
