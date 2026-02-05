(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(e){if(e.ep)return;e.ep=!0;const a=s(e);fetch(e.href,a)}})();function g(){const i=document.getElementById("matrix"),t=i.getContext("2d");i.width=window.innerWidth,i.height=window.innerHeight;const s=16;t.font=`${s}px monospace`;const a=("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"+"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん").split(""),r=Math.floor(i.width/s),o=Array(r).fill(1);function l(){t.fillStyle="rgba(0, 0, 0, 0.05)",t.fillRect(0,0,i.width,i.height),t.fillStyle="#00ff9c";for(let c=0;c<o.length;c++){const h=a[Math.floor(Math.random()*a.length)],d=c*s,m=o[c]*s;t.fillText(h,d,m),m>i.height&&Math.random()>.975&&(o[c]=0),o[c]++}}setInterval(l,33),window.addEventListener("resize",()=>{i.width=window.innerWidth,i.height=window.innerHeight})}async function f(){const i="stampplus";try{const t=await fetch(`https://api.github.com/users/${i}`);if(!t.ok)throw new Error("Failed to fetch GitHub stats");const s=await t.json();return{repos:s.public_repos,followers:s.followers}}catch(t){return console.error("GitHub API Error:",t),null}}const v=[{id:1,title:"Digital Rain Matrix",description:"A Matrix-inspired generative animation exploring flow, impermanence, and machine rhythm. Built with vanilla JavaScript and HTML5 Canvas.",image:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",githubUrl:"https://github.com/stampplus/Thanachai-Portfolio",tags:["Canvas","Animation","Generative"],gradient:"from-blue-500 to-cyan-500"},{id:2,title:"The Weaver's Oracle",description:"An interactive narrative where a GPT-4 powered oracle weaves personalized tales based on user's emotional inputs and preferences.",image:"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",githubUrl:"https://github.com/stampplus",tags:["AI","NLP","Interactive"],gradient:"from-purple-500 to-pink-500"},{id:3,title:"EmpathAI Toolkit",description:"A creative toolkit that analyzes text and suggests color palettes, musical motifs, and visual styles to match the underlying sentiment.",image:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",githubUrl:"https://github.com/stampplus",tags:["Sentiment Analysis","Creative","ML"],gradient:"from-green-500 to-emerald-500"},{id:4,title:"Neural Dreams",description:"A generative art experiment using StyleGAN to create surreal dreamscapes that blend human creativity with machine imagination.",image:"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",githubUrl:"https://github.com/stampplus",tags:["GAN","Generative Art","Python"],gradient:"from-orange-500 to-red-500"},{id:5,title:"Code Poetry",description:"An exploration of algorithmic poetry generation, where code becomes the medium for expressing human emotions through structured logic.",image:"https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",githubUrl:"https://github.com/stampplus",tags:["NLP","Poetry","Creative Coding"],gradient:"from-indigo-500 to-purple-500"},{id:6,title:"Synesthetic Vision",description:"Cross-modal AI system that translates audio inputs into visual art, creating real-time synesthetic experiences for users.",image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",githubUrl:"https://github.com/stampplus",tags:["Audio","Computer Vision","Real-time"],gradient:"from-teal-500 to-blue-500"}];function x(i,t){const s=t*100;return`
        <article 
            class="project-card group relative bg-gradient-to-br from-gray-800/60 to-gray-900/40 
                   backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 
                   hover:border-white/20 transition-all duration-500 
                   hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-2
                   opacity-0 translate-y-8"
            data-project-id="${i.id}"
            style="transition-delay: ${s}ms"
        >
            <!-- Image Container -->
            <div class="relative overflow-hidden aspect-video">
                <img 
                    src="${i.image}" 
                    alt="${i.title}"
                    class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                >
                <!-- Gradient Overlay on Hover -->
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent 
                            opacity-60 group-hover:opacity-40 transition-opacity duration-500">
                </div>
                
                <!-- Tags Badge -->
                <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                    ${i.tags.map(n=>`
                        <span class="px-3 py-1 text-xs font-medium bg-black/40 backdrop-blur-md 
                                   text-white/90 rounded-full border border-white/10">
                            ${n}
                        </span>
                    `).join("")}
                </div>
            </div>
            
            <!-- Content -->
            <div class="p-6 relative">
                <!-- Accent Line -->
                <div class="absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${i.gradient} 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                </div>
                
                <h3 class="text-xl font-bold text-gray-100 mb-3 group-hover:text-blue-400 
                           transition-colors duration-300 line-clamp-1">
                    ${i.title}
                </h3>
                
                <p class="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                    ${i.description}
                </p>
                
                <!-- GitHub Link -->
                <a 
                    href="${i.githubUrl}" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm font-semibold 
                           bg-gradient-to-r ${i.gradient} bg-clip-text text-transparent
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
    `}function y(i="#projects-grid"){const t=document.querySelector(i);if(!t){console.warn(`Projects container not found: ${i}`);return}const s=v.map((n,e)=>x(n,e)).join("");t.innerHTML=s}function b(){const i={root:null,rootMargin:"0px 0px -50px 0px",threshold:.1},t=new IntersectionObserver(n=>{n.forEach(e=>{e.isIntersecting&&(e.target.classList.add("project-card-visible"),e.target.classList.remove("opacity-0","translate-y-8"),e.target.classList.add("opacity-100","translate-y-0"),t.unobserve(e.target))})},i);return document.querySelectorAll(".project-card").forEach(n=>t.observe(n)),t}function w(){document.getElementById("projects")&&(y(),b(),console.log("Projects showcase initialized"))}class M{constructor(t,s,n={}){this.canvas=t,this.ctx=s,this.x=Math.random()*t.width,this.y=Math.random()*t.height;const e=n.speed||.3;this.vx=(Math.random()-.5)*e,this.vy=(Math.random()-.5)*e,this.radius=Math.random()*(n.maxRadius||2)+1,this.baseAlpha=Math.random()*.3+.1,this.alpha=this.baseAlpha,this.pulseSpeed=Math.random()*.02+.01,this.pulseOffset=Math.random()*Math.PI*2;const a=Math.random()*60+200;this.color=`hsla(${a}, 70%, 60%,`}update(t){this.x+=this.vx,this.y+=this.vy,this.x<0&&(this.x=this.canvas.width),this.x>this.canvas.width&&(this.x=0),this.y<0&&(this.y=this.canvas.height),this.y>this.canvas.height&&(this.y=0),this.alpha=this.baseAlpha+Math.sin(t*this.pulseSpeed+this.pulseOffset)*.1,this.alpha=Math.max(.05,Math.min(.5,this.alpha))}draw(){this.ctx.beginPath(),this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2),this.ctx.fillStyle=`${this.color} ${this.alpha})`,this.ctx.fill()}}class I{constructor(t,s={}){if(this.canvas=document.getElementById(t),!this.canvas){console.warn(`Particle canvas not found: ${t}`);return}this.ctx=this.canvas.getContext("2d"),this.particles=[],this.animationId=null,this.isRunning=!1,this.lastTime=0,this.config={particleCount:s.particleCount||50,connectionDistance:s.connectionDistance||100,maxConnections:s.maxConnections||3,speed:s.speed||.3,maxRadius:s.maxRadius||2,fpsLimit:s.fpsLimit||60},this.frameInterval=1e3/this.config.fpsLimit,this.init()}init(){this.resize(),this.createParticles(),window.addEventListener("resize",()=>this.resize(),{passive:!0}),document.addEventListener("visibilitychange",()=>{document.hidden?this.pause():this.resume()})}resize(){const t=this.canvas.parentElement;if(!t)return;const s=t.getBoundingClientRect(),n=Math.min(window.devicePixelRatio||1,2);this.canvas.width=s.width*n,this.canvas.height=s.height*n,this.canvas.style.width=`${s.width}px`,this.canvas.style.height=`${s.height}px`,this.ctx.scale(n,n),this.width=s.width,this.height=s.height}createParticles(){this.particles=[];for(let t=0;t<this.config.particleCount;t++)this.particles.push(new M(this.canvas,this.ctx,{speed:this.config.speed,maxRadius:this.config.maxRadius}))}drawConnections(){const{connectionDistance:t,maxConnections:s}=this.config;for(let n=0;n<this.particles.length;n++){let e=0;for(let a=n+1;a<this.particles.length&&!(e>=s);a++){const r=this.particles[n],o=this.particles[a],l=r.x-o.x,c=r.y-o.y,h=Math.sqrt(l*l+c*c);if(h<t){const d=(1-h/t)*.15;this.ctx.beginPath(),this.ctx.moveTo(r.x,r.y),this.ctx.lineTo(o.x,o.y),this.ctx.strokeStyle=`rgba(100, 149, 237, ${d})`,this.ctx.lineWidth=.5,this.ctx.stroke(),e++}}}}animate(t=0){if(!this.isRunning)return;this.animationId=requestAnimationFrame(e=>this.animate(e));const s=t-this.lastTime;if(s<this.frameInterval)return;this.lastTime=t-s%this.frameInterval,this.ctx.clearRect(0,0,this.width,this.height);const n=t/1e3;this.particles.forEach(e=>{e.x=Math.min(Math.max(e.x,0),this.width),e.y=Math.min(Math.max(e.y,0),this.height),e.update(n),e.draw()}),this.drawConnections()}start(){this.isRunning||(this.isRunning=!0,this.animate())}pause(){this.isRunning=!1,this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}resume(){!this.isRunning&&this.canvas&&this.start()}stop(){this.isRunning=!1,this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}}function P(i="hero-particles",t={}){if(!document.getElementById(i))return null;const n=new I(i,t);return n.start(),console.log("Particle animation initialized"),n}document.getElementById("matrix")&&g();document.getElementById("hero-particles")&&P("hero-particles",{particleCount:40,connectionDistance:120,speed:.2,fpsLimit:60});w();f().then(i=>{i&&(document.getElementById("repo-count").innerText=i.repos,document.getElementById("follower-count").innerText=i.followers,document.getElementById("github-stats").classList.remove("hidden"))});const p=document.getElementById("menu-btn"),u=document.getElementById("nav-menu");p&&u&&p.addEventListener("click",()=>{u.classList.toggle("hidden"),u.classList.toggle("flex")});console.log("Portfolio V2 loaded via Vite!");
