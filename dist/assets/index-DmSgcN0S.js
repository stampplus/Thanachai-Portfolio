(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function i(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=i(r);fetch(r.href,n)}})();function v(){const e=document.getElementById("matrix"),t=e.getContext("2d");e.width=window.innerWidth,e.height=window.innerHeight;const i=16;t.font=`${i}px monospace`;const n=("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"+"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん").split(""),s=Math.floor(e.width/i),o=Array(s).fill(1);function c(){t.fillStyle="rgba(0, 0, 0, 0.05)",t.fillRect(0,0,e.width,e.height),t.fillStyle="#00ff9c";for(let l=0;l<o.length;l++){const h=n[Math.floor(Math.random()*n.length)],u=l*i,g=o[l]*i;t.fillText(h,u,g),g>e.height&&Math.random()>.975&&(o[l]=0),o[l]++}}setInterval(c,33),window.addEventListener("resize",()=>{e.width=window.innerWidth,e.height=window.innerHeight})}async function b(){const e="stampplus";try{const t=await fetch(`https://api.github.com/users/${e}`);if(!t.ok)throw new Error("Failed to fetch GitHub stats");const i=await t.json();return{repos:i.public_repos,followers:i.followers}}catch(t){return console.error("GitHub API Error:",t),null}}const f=[{id:1,title:"Digital Rain Matrix",description:"A Matrix-inspired generative animation exploring flow, impermanence, and machine rhythm. Built with vanilla JavaScript and HTML5 Canvas.",image:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",githubUrl:"https://github.com/stampplus/Thanachai-Portfolio",tags:["Canvas","Animation","Generative"],gradient:"from-blue-500 to-cyan-500"},{id:2,title:"The Weaver's Oracle",description:"An interactive narrative where a GPT-4 powered oracle weaves personalized tales based on user's emotional inputs and preferences.",image:"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",githubUrl:"https://github.com/stampplus",tags:["AI","NLP","Interactive"],gradient:"from-purple-500 to-pink-500"},{id:3,title:"EmpathAI Toolkit",description:"A creative toolkit that analyzes text and suggests color palettes, musical motifs, and visual styles to match the underlying sentiment.",image:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",githubUrl:"https://github.com/stampplus",tags:["Sentiment Analysis","Creative","ML"],gradient:"from-green-500 to-emerald-500"},{id:4,title:"Neural Dreams",description:"A generative art experiment using StyleGAN to create surreal dreamscapes that blend human creativity with machine imagination.",image:"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",githubUrl:"https://github.com/stampplus",tags:["GAN","Generative Art","Python"],gradient:"from-orange-500 to-red-500"},{id:5,title:"Code Poetry",description:"An exploration of algorithmic poetry generation, where code becomes the medium for expressing human emotions through structured logic.",image:"https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",githubUrl:"https://github.com/stampplus",tags:["NLP","Poetry","Creative Coding"],gradient:"from-indigo-500 to-purple-500"},{id:6,title:"Synesthetic Vision",description:"Cross-modal AI system that translates audio inputs into visual art, creating real-time synesthetic experiences for users.",image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",githubUrl:"https://github.com/stampplus",tags:["Audio","Computer Vision","Real-time"],gradient:"from-teal-500 to-blue-500"}];function x(e,t){const i=t*100;return`
        <article 
            class="project-card group relative bg-gradient-to-br from-gray-800/60 to-gray-900/40 
                   backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 
                   hover:border-white/20 transition-all duration-500 
                   hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-2
                   opacity-0 translate-y-8"
            data-project-id="${e.id}"
            style="transition-delay: ${i}ms"
        >
            <!-- Image Container -->
            <div class="relative overflow-hidden aspect-video">
                <img 
                    src="${e.image}" 
                    alt="${e.title}"
                    class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                >
                <!-- Gradient Overlay on Hover -->
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent 
                            opacity-60 group-hover:opacity-40 transition-opacity duration-500">
                </div>
                
                <!-- Tags Badge -->
                <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                    ${e.tags.map(a=>`
                        <span class="px-3 py-1 text-xs font-medium bg-black/40 backdrop-blur-md 
                                   text-white/90 rounded-full border border-white/10">
                            ${a}
                        </span>
                    `).join("")}
                </div>
            </div>
            
            <!-- Content -->
            <div class="p-6 relative">
                <!-- Accent Line -->
                <div class="absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${e.gradient} 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                </div>
                
                <h3 class="text-xl font-bold text-gray-100 mb-3 group-hover:text-blue-400 
                           transition-colors duration-300 line-clamp-1">
                    ${e.title}
                </h3>
                
                <p class="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                    ${e.description}
                </p>
                
                <!-- GitHub Link -->
                <a 
                    href="${e.githubUrl}" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm font-semibold 
                           bg-gradient-to-r ${e.gradient} bg-clip-text text-transparent
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
    `}function y(e="#projects-grid"){const t=document.querySelector(e);if(!t){console.warn(`Projects container not found: ${e}`);return}const i=f.map((a,r)=>x(a,r)).join("");t.innerHTML=i}function w(){const e={root:null,rootMargin:"0px 0px -50px 0px",threshold:.1},t=new IntersectionObserver(a=>{a.forEach(r=>{r.isIntersecting&&(r.target.classList.add("project-card-visible"),r.target.classList.remove("opacity-0","translate-y-8"),r.target.classList.add("opacity-100","translate-y-0"),t.unobserve(r.target))})},e);return document.querySelectorAll(".project-card").forEach(a=>t.observe(a)),t}function M(){document.getElementById("projects")&&(y(),w(),console.log("Projects showcase initialized"))}const d={github:'<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg>',external:'<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>'},$=(e,t)=>{const i=["from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30","from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30","from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30","from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30"];return`<span class="px-3 py-1 text-xs font-medium bg-gradient-to-r ${i[t%i.length]} rounded-full border backdrop-blur-sm">${e}</span>`},P=(e,t)=>{const i=t*100;return`
        <article class="project-card group relative opacity-0 translate-y-8 transition-all duration-700 ease-out"
                 data-index="${t}"
                 style="transition-delay: ${i}ms">
            
            <div class="relative h-full bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 
                        backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 
                        hover:border-blue-500/30 transition-all duration-500
                        hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-2">
                
                <div class="relative overflow-hidden aspect-video">
                    <img src="${e.image}" 
                         alt="${e.title}"
                         class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                         loading="lazy">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent 
                                opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
                    
                    <div class="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a href="${e.githubUrl}" target="_blank" rel="noopener noreferrer"
                           class="p-3 bg-gray-900/80 backdrop-blur-md rounded-full border border-gray-600/50 text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 transform hover:scale-110"
                           aria-label="View GitHub repository">
                            ${d.github}
                        </a>
                        <a href="${e.demoUrl}" 
                           class="p-3 bg-gray-900/80 backdrop-blur-md rounded-full border border-gray-600/50 text-white hover:bg-purple-600 hover:border-purple-500 transition-all duration-300 transform hover:scale-110"
                           aria-label="View live demo">
                            ${d.external}
                        </a>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${e.tags.map((a,r)=>$(a,r)).join("")}
                    </div>
                    
                    <h3 class="text-xl font-bold text-gray-100 mb-2 group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                        ${e.title}
                    </h3>
                    
                    <p class="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2">
                        ${e.description}
                    </p>
                    
                    <div class="flex items-center gap-4 pt-4 border-t border-gray-700/50">
                        <a href="${e.githubUrl}" target="_blank" rel="noopener noreferrer"
                           class="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors duration-300 group/link">
                            ${d.github}
                            <span class="group-hover/link:translate-x-1 transition-transform duration-300">GitHub</span>
                        </a>
                        <a href="${e.demoUrl}"
                           class="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-purple-400 transition-colors duration-300 group/link ml-auto">
                            <span>Live Demo</span>
                            ${d.external}
                        </a>
                    </div>
                </div>
            </div>
        </article>
    `},I=(e="#mini-projects-grid")=>{const t=document.querySelector(e);if(!t){console.warn(`[ProjectsSection] Container not found: ${e}`);return}const i=f.map((a,r)=>P(a,r)).join("");t.innerHTML=i},C=()=>{const e=document.querySelectorAll(".project-card");if(!e.length)return;const t={root:null,rootMargin:"0px 0px -100px 0px",threshold:.1},i=new IntersectionObserver(a=>{a.forEach(r=>{r.isIntersecting&&(r.target.classList.remove("opacity-0","translate-y-8"),r.target.classList.add("opacity-100","translate-y-0"),i.unobserve(r.target))})},t);return e.forEach(a=>i.observe(a)),()=>i.disconnect()},L=()=>{if(!document.getElementById("mini-projects")){console.warn("[MiniProjects] Section not found, skipping initialization");return}I(),C(),console.log("[MiniProjects] Showcase initialized")};class k{constructor(t,i={}){this.canvas=t,this.ctx=t.getContext("2d"),this.x=Math.random()*t.width,this.y=Math.random()*t.height;const a=i.speed||.3;this.vx=(Math.random()-.5)*a,this.vy=(Math.random()-.5)*a,this.radius=Math.random()*(i.maxRadius||2)+1,this.baseAlpha=Math.random()*.3+.1,this.alpha=this.baseAlpha,this.pulseSpeed=Math.random()*.02+.01,this.pulseOffset=Math.random()*Math.PI*2;const r=Math.random()*60+200;this.color=`hsla(${r}, 70%, 60%,`}update(t){this.x+=this.vx,this.y+=this.vy,this.x<0&&(this.x=this.canvas.width),this.x>this.canvas.width&&(this.x=0),this.y<0&&(this.y=this.canvas.height),this.y>this.canvas.height&&(this.y=0),this.alpha=this.baseAlpha+Math.sin(t*this.pulseSpeed+this.pulseOffset)*.1,this.alpha=Math.max(.05,Math.min(.5,this.alpha))}draw(){this.ctx.beginPath(),this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2),this.ctx.fillStyle=`${this.color} ${this.alpha})`,this.ctx.fill()}}class A{constructor(t,i={}){if(this.canvas=document.getElementById(t),!this.canvas){console.warn(`Particle canvas not found: ${t}`);return}this.ctx=this.canvas.getContext("2d"),this.particles=[],this.animationId=null,this.isRunning=!1,this.lastTime=0,this.config={particleCount:i.particleCount||50,connectionDistance:i.connectionDistance||100,maxConnections:i.maxConnections||3,speed:i.speed||.3,maxRadius:i.maxRadius||2,fpsLimit:i.fpsLimit||60},this.frameInterval=1e3/this.config.fpsLimit,this.init()}init(){this.resize(),this.createParticles(),window.addEventListener("resize",()=>this.resize(),{passive:!0}),document.addEventListener("visibilitychange",()=>{document.hidden?this.pause():this.resume()})}resize(){const t=this.canvas.parentElement;if(!t)return;const i=t.getBoundingClientRect(),a=Math.min(window.devicePixelRatio||1,2);this.canvas.width=i.width*a,this.canvas.height=i.height*a,this.canvas.style.width=`${i.width}px`,this.canvas.style.height=`${i.height}px`,this.ctx.scale(a,a),this.width=i.width,this.height=i.height}createParticles(){this.particles=[];for(let t=0;t<this.config.particleCount;t++)this.particles.push(new k({width:this.width,height:this.height},{speed:this.config.speed,maxRadius:this.config.maxRadius}))}drawConnections(){const{connectionDistance:t,maxConnections:i}=this.config;for(let a=0;a<this.particles.length;a++){let r=0;for(let n=a+1;n<this.particles.length&&!(r>=i);n++){const s=this.particles[a],o=this.particles[n],c=s.x-o.x,l=s.y-o.y,h=Math.sqrt(c*c+l*l);if(h<t){const u=(1-h/t)*.15;this.ctx.beginPath(),this.ctx.moveTo(s.x,s.y),this.ctx.lineTo(o.x,o.y),this.ctx.strokeStyle=`rgba(100, 149, 237, ${u})`,this.ctx.lineWidth=.5,this.ctx.stroke(),r++}}}}animate(t=0){if(!this.isRunning)return;this.animationId=requestAnimationFrame(r=>this.animate(r));const i=t-this.lastTime;if(i<this.frameInterval)return;this.lastTime=t-i%this.frameInterval,this.ctx.clearRect(0,0,this.width,this.height);const a=t/1e3;this.particles.forEach(r=>{r.x=Math.min(Math.max(r.x,0),this.width),r.y=Math.min(Math.max(r.y,0),this.height),r.update(a),r.draw()}),this.drawConnections()}start(){this.isRunning||(this.isRunning=!0,this.animate())}pause(){this.isRunning=!1,this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}resume(){!this.isRunning&&this.canvas&&this.start()}stop(){this.isRunning=!1,this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}}function E(e="hero-particles",t={}){if(!document.getElementById(e))return null;const a=new A(e,t);return a.start(),console.log("Particle animation initialized"),a}document.getElementById("matrix")&&v();document.getElementById("hero-particles")&&E("hero-particles",{particleCount:40,connectionDistance:120,speed:.2,fpsLimit:60});M();L();b().then(e=>{e&&(document.getElementById("repo-count").innerText=e.repos,document.getElementById("follower-count").innerText=e.followers,document.getElementById("github-stats").classList.remove("hidden"))});const m=document.getElementById("menu-btn"),p=document.getElementById("nav-menu");m&&p&&m.addEventListener("click",()=>{p.classList.toggle("hidden"),p.classList.toggle("flex")});console.log("Portfolio V2 loaded via Vite!");
