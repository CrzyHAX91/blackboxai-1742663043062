// DOM Elements
const audioPlayers = document.querySelectorAll('audio');
const playButtons = document.querySelectorAll('.fa-play');

// Initialize audio players
playButtons.forEach((button, index) => {
    const player = audioPlayers[index];
    const container = button.closest('.bg-gradient');

    if (player && container) {
        // Click on the play icon
        container.addEventListener('click', async (e) => {
            if (!e.target.closest('audio')) {  // Don't trigger if clicking on audio controls
                try {
                    if (player.paused) {
                        // Stop all other players first
                        await Promise.all(Array.from(audioPlayers).map(p => {
                            if (p !== player && !p.paused) {
                                p.pause();
                                p.currentTime = 0;
                                const btn = p.closest('.bg-gradient').querySelector('.fa-pause');
                                if (btn) {
                                    btn.classList.remove('fa-pause');
                                    btn.classList.add('fa-play');
                                }
                            }
                        }));
                        // Then play the clicked player
                        await player.play();
                        button.classList.remove('fa-play');
                        button.classList.add('fa-pause');
                    } else {
                        await player.pause();
                        button.classList.remove('fa-pause');
                        button.classList.add('fa-play');
                    }
                } catch (error) {
                    console.log('Playback interrupted or audio not loaded');
                }
            }
        });

        // When audio ends
        player.addEventListener('ended', () => {
            button.classList.remove('fa-pause');
            button.classList.add('fa-play');
        });
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Stop all audio players when navigating
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

// Show active section in navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
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
});