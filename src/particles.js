/**
 * Hero Particle Animation Module
 * Lightweight canvas-based particle system for 60fps performance
 */

/**
 * Particle class representing a single particle
 */
class Particle {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // Velocity (slow, floating movement)
        const speed = options.speed || 0.3;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        
        // Size
        this.radius = Math.random() * (options.maxRadius || 2) + 1;
        
        // Appearance
        this.baseAlpha = Math.random() * 0.3 + 0.1;
        this.alpha = this.baseAlpha;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
        
        // Color (blue/purple gradient range)
        const hue = Math.random() * 60 + 200; // 200-260 (blue to purple)
        this.color = `hsla(${hue}, 70%, 60%,`;
    }
    
    /**
     * Update particle position and alpha
     */
    update(time) {
        // Move
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around edges
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
        
        // Pulse alpha
        this.alpha = this.baseAlpha + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.1;
        this.alpha = Math.max(0.05, Math.min(0.5, this.alpha));
    }
    
    /**
     * Draw particle
     */
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `${this.color} ${this.alpha})`;
        this.ctx.fill();
    }
}

/**
 * Particle System Manager
 */
class ParticleSystem {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn(`Particle canvas not found: ${canvasId}`);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        this.lastTime = 0;
        
        // Configuration
        this.config = {
            particleCount: options.particleCount || 50,
            connectionDistance: options.connectionDistance || 100,
            maxConnections: options.maxConnections || 3,
            speed: options.speed || 0.3,
            maxRadius: options.maxRadius || 2,
            fpsLimit: options.fpsLimit || 60
        };
        
        // Frame timing
        this.frameInterval = 1000 / this.config.fpsLimit;
        
        this.init();
    }
    
    /**
     * Initialize canvas and particles
     */
    init() {
        this.resize();
        this.createParticles();
        
        // Handle resize
        window.addEventListener('resize', () => this.resize(), { passive: true });
        
        // Visibility check - pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    /**
     * Resize canvas to match container
     */
    resize() {
        const parent = this.canvas.parentElement;
        if (!parent) return;
        
        const rect = parent.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR for performance
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        
        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;
    }
    
    /**
     * Create particle instances
     */
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new Particle(
                { width: this.width, height: this.height },
                { speed: this.config.speed, maxRadius: this.config.maxRadius }
            ));
        }
    }
    
    /**
     * Draw connections between nearby particles
     */
    drawConnections() {
        const { connectionDistance, maxConnections } = this.config;
        
        for (let i = 0; i < this.particles.length; i++) {
            let connections = 0;
            
            for (let j = i + 1; j < this.particles.length; j++) {
                if (connections >= maxConnections) break;
                
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const alpha = (1 - distance / connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(100, 149, 237, ${alpha})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                    connections++;
                }
            }
        }
    }
    
    /**
     * Animation loop
     */
    animate(currentTime = 0) {
        if (!this.isRunning) return;
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
        
        // Frame rate limiting
        const deltaTime = currentTime - this.lastTime;
        if (deltaTime < this.frameInterval) return;
        this.lastTime = currentTime - (deltaTime % this.frameInterval);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update and draw particles
        const timeSeconds = currentTime / 1000;
        this.particles.forEach(particle => {
            particle.x = Math.min(Math.max(particle.x, 0), this.width);
            particle.y = Math.min(Math.max(particle.y, 0), this.height);
            particle.update(timeSeconds);
            particle.draw();
        });
        
        // Draw connections
        this.drawConnections();
    }
    
    /**
     * Start animation
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    /**
     * Pause animation (for tab visibility)
     */
    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Resume animation
     */
    resume() {
        if (!this.isRunning && this.canvas) {
            this.start();
        }
    }
    
    /**
     * Stop and cleanup
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

/**
 * Initialize particle system
 * Call this from main.js
 */
export function initParticles(canvasId = 'hero-particles', options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        return null;
    }
    
    const system = new ParticleSystem(canvasId, options);
    system.start();
    
    console.log('Particle animation initialized');
    return system;
}
