/**
 * Mini Project Showcase - Render & Animation Module
 * Handles DOM rendering and scroll-triggered animations
 */

import { miniProjects } from './projects.js';

/**
 * SVG Icons as template literals
 */
const icons = {
    github: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg>`,
    external: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`
};

/**
 * Generate tag HTML
 * @param {string} tag 
 * @param {number} index 
 * @returns {string}
 */
const createTag = (tag, index) => {
    const gradients = [
        'from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30',
        'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30',
        'from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30',
        'from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30'
    ];
    const gradient = gradients[index % gradients.length];
    
    return `<span class="px-3 py-1 text-xs font-medium bg-gradient-to-r ${gradient} rounded-full border backdrop-blur-sm">${tag}</span>`;
};

/**
 * Generate project card HTML
 * @param {Object} project 
 * @param {number} index 
 * @returns {string}
 */
const createProjectCard = (project, index) => {
    const staggerDelay = index * 100;
    
    return `
        <article class="project-card group relative opacity-0 translate-y-8 transition-all duration-700 ease-out"
                 data-index="${index}"
                 style="transition-delay: ${staggerDelay}ms">
            
            <div class="relative h-full bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 
                        backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 
                        hover:border-blue-500/30 transition-all duration-500
                        hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-2">
                
                <div class="relative overflow-hidden aspect-video">
                    <img src="${project.image}" 
                         alt="${project.title}"
                         class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                         loading="lazy">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent 
                                opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
                    
                    <div class="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer"
                           class="p-3 bg-gray-900/80 backdrop-blur-md rounded-full border border-gray-600/50 text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 transform hover:scale-110"
                           aria-label="View GitHub repository">
                            ${icons.github}
                        </a>
                        <a href="${project.demoUrl}" 
                           class="p-3 bg-gray-900/80 backdrop-blur-md rounded-full border border-gray-600/50 text-white hover:bg-purple-600 hover:border-purple-500 transition-all duration-300 transform hover:scale-110"
                           aria-label="View live demo">
                            ${icons.external}
                        </a>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${project.tags.map((tag, i) => createTag(tag, i)).join('')}
                    </div>
                    
                    <h3 class="text-xl font-bold text-gray-100 mb-2 group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                        ${project.title}
                    </h3>
                    
                    <p class="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2">
                        ${project.description}
                    </p>
                    
                    <div class="flex items-center gap-4 pt-4 border-t border-gray-700/50">
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer"
                           class="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors duration-300 group/link">
                            ${icons.github}
                            <span class="group-hover/link:translate-x-1 transition-transform duration-300">GitHub</span>
                        </a>
                        <a href="${project.demoUrl}"
                           class="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-purple-400 transition-colors duration-300 group/link ml-auto">
                            <span>Live Demo</span>
                            ${icons.external}
                        </a>
                    </div>
                </div>
            </div>
        </article>
    `;
};

/**
 * Render projects to container
 * @param {string} containerSelector 
 */
export const renderProjects = (containerSelector = '#mini-projects-grid') => {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn(`[ProjectsSection] Container not found: ${containerSelector}`);
        return;
    }
    
    const html = miniProjects.map((project, index) => 
        createProjectCard(project, index)
    ).join('');
    
    container.innerHTML = html;
};

/**
 * Initialize scroll-triggered fade-in animation
 */
export const initScrollReveal = () => {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                entry.target.classList.add('opacity-100', 'translate-y-0');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => observer.observe(card));
    
    return () => observer.disconnect();
};

/**
 * Initialize Mini Projects Showcase
 */
export const initMiniProjects = () => {
    const section = document.getElementById('mini-projects');
    if (!section) {
        console.warn('[MiniProjects] Section not found, skipping initialization');
        return;
    }
    
    renderProjects();
    initScrollReveal();
    
    console.log('[MiniProjects] Showcase initialized');
};
