/**
 * Projects Showcase Module
 * Data-driven project cards with scroll-triggered fade-in animation
 */

// Project data store
const projectsData = [
    {
        id: 1,
        title: "Digital Rain Matrix",
        description: "A Matrix-inspired generative animation exploring flow, impermanence, and machine rhythm. Built with vanilla JavaScript and HTML5 Canvas.",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
        githubUrl: "https://github.com/stampplus/Thanachai-Portfolio",
        tags: ["Canvas", "Animation", "Generative"],
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: 2,
        title: "The Weaver's Oracle",
        description: "An interactive narrative where a GPT-4 powered oracle weaves personalized tales based on user's emotional inputs and preferences.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
        githubUrl: "https://github.com/stampplus",
        tags: ["AI", "NLP", "Interactive"],
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: 3,
        title: "EmpathAI Toolkit",
        description: "A creative toolkit that analyzes text and suggests color palettes, musical motifs, and visual styles to match the underlying sentiment.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        githubUrl: "https://github.com/stampplus",
        tags: ["Sentiment Analysis", "Creative", "ML"],
        gradient: "from-green-500 to-emerald-500"
    },
    {
        id: 4,
        title: "Neural Dreams",
        description: "A generative art experiment using StyleGAN to create surreal dreamscapes that blend human creativity with machine imagination.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
        githubUrl: "https://github.com/stampplus",
        tags: ["GAN", "Generative Art", "Python"],
        gradient: "from-orange-500 to-red-500"
    },
    {
        id: 5,
        title: "Code Poetry",
        description: "An exploration of algorithmic poetry generation, where code becomes the medium for expressing human emotions through structured logic.",
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
        githubUrl: "https://github.com/stampplus",
        tags: ["NLP", "Poetry", "Creative Coding"],
        gradient: "from-indigo-500 to-purple-500"
    },
    {
        id: 6,
        title: "Synesthetic Vision",
        description: "Cross-modal AI system that translates audio inputs into visual art, creating real-time synesthetic experiences for users.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        githubUrl: "https://github.com/stampplus",
        tags: ["Audio", "Computer Vision", "Real-time"],
        gradient: "from-teal-500 to-blue-500"
    }
];

/**
 * Generate HTML for a project card
 * @param {Object} project - Project data object
 * @param {number} index - Index for staggered animation
 * @returns {string} HTML string
 */
function createProjectCard(project, index) {
    const delay = index * 100; // Stagger delay in ms
    
    return `
        <article 
            class="project-card group relative bg-gradient-to-br from-gray-800/60 to-gray-900/40 
                   backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 
                   hover:border-white/20 transition-all duration-500 
                   hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-2
                   opacity-0 translate-y-8"
            data-project-id="${project.id}"
            style="transition-delay: ${delay}ms"
        >
            <!-- Image Container -->
            <div class="relative overflow-hidden aspect-video">
                <img 
                    src="${project.image}" 
                    alt="${project.title}"
                    class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                >
                <!-- Gradient Overlay on Hover -->
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent 
                            opacity-60 group-hover:opacity-40 transition-opacity duration-500">
                </div>
                
                <!-- Tags Badge -->
                <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                    ${project.tags.map(tag => `
                        <span class="px-3 py-1 text-xs font-medium bg-black/40 backdrop-blur-md 
                                   text-white/90 rounded-full border border-white/10">
                            ${tag}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <!-- Content -->
            <div class="p-6 relative">
                <!-- Accent Line -->
                <div class="absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${project.gradient} 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                </div>
                
                <h3 class="text-xl font-bold text-gray-100 mb-3 group-hover:text-blue-400 
                           transition-colors duration-300 line-clamp-1">
                    ${project.title}
                </h3>
                
                <p class="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                    ${project.description}
                </p>
                
                <!-- GitHub Link -->
                <a 
                    href="${project.githubUrl}" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm font-semibold 
                           bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent
                           hover:opacity-80 transition-opacity duration-300 group/link"
                >
                    <svg class="w-5 h-5 text-gray-400 group-hover/link:text-white transition-colors" 
                         fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill-rule="evenodd" 
                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 
                                 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
                                 -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 
                                 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 
                                 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 
                                 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 
                                 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 
                                 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 
                                 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 
                                 0 0022 12.017C22 6.484 17.522 2 12 2z" 
                              clip-rule="evenodd"/>
                    </svg>
                    <span class="group-hover/link:translate-x-1 transition-transform duration-300">
                        View on GitHub
                    </span>
                    <svg class="w-4 h-4 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 
                                transition-transform duration-300" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                </a>
            </div>
        </article>
    `;
}

/**
 * Render projects to the DOM
 * @param {string} containerSelector - CSS selector for the container
 */
export function renderProjects(containerSelector = '#projects-grid') {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn(`Projects container not found: ${containerSelector}`);
        return;
    }
    
    const html = projectsData.map((project, index) => 
        createProjectCard(project, index)
    ).join('');
    
    container.innerHTML = html;
}

/**
 * Initialize scroll-triggered fade-in animation
 * Uses Intersection Observer for performance
 */
export function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class for CSS transition
                entry.target.classList.add('project-card-visible');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                entry.target.classList.add('opacity-100', 'translate-y-0');
                
                // Unobserve after animation triggers (once only)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all project cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => observer.observe(card));
    
    return observer;
}

/**
 * Initialize Projects Showcase
 * Call this from main.js
 */
export function initProjects() {
    // Only initialize if projects section exists
    if (!document.getElementById('projects')) {
        return;
    }
    
    renderProjects();
    initScrollReveal();
    
    console.log('Projects showcase initialized');
}

// Export data for mini projects section
export { projectsData as miniProjects };
