import './style.css';
import { initMatrix } from './matrix.js';
import { fetchGitHubStats } from './github.js';
import { initProjects } from './projects.js';
import { initMiniProjects } from './projectsSection.js';
import { initParticles } from './particles.js';

// Initialize Matrix Animation
if (document.getElementById('matrix')) {
    initMatrix();
}

// Initialize Hero Particle Animation
if (document.getElementById('hero-particles')) {
    initParticles('hero-particles', {
        particleCount: 40,
        connectionDistance: 120,
        speed: 0.2,
        fpsLimit: 60
    });
}

// Initialize Projects Showcase
initProjects();

// Note: Mini Projects Showcase removed

// GitHub Stats Integration
fetchGitHubStats().then(stats => {
    if (stats) {
        document.getElementById('repo-count').innerText = stats.repos;
        document.getElementById('follower-count').innerText = stats.followers;
        document.getElementById('github-stats').classList.remove('hidden');
    }
});

// Mobile Menu Logic
const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');

if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
        navMenu.classList.toggle('flex');
    });
}

// Theme Toggle Logic
console.log('Portfolio V2 loaded via Vite!');
