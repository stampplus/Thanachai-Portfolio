# Thanachai Portfolio — Agent Guide

> This guide provides essential information for AI coding agents working on this project.

---

## Project Overview

**Thanachai Portfolio** is a personal portfolio website for Thanachai (Stamp) — an AI Creative Developer. The project embodies a "Vibe Code" philosophy where design is emotion and code is its heartbeat.

- **Live Demo**: https://stampplus.github.io/Thanachai-Portfolio/
- **Repository**: https://github.com/stampplus/Thanachai-Portfolio
- **Deployment**: GitHub Pages (auto-deployed from `main` branch)

### Key Characteristics

- Dark-mode-first aesthetic with gradient accents (blue to purple)
- Heavy use of glassmorphism effects (`backdrop-blur`)
- Smooth animations and floating particle effects
- Mobile-responsive navigation with hamburger menu
- Matrix rain animation (Canvas-based, with Hiragana characters)
- GitHub API integration for live stats display

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Build Tool | Vite | ^7.3.1 | Dev server, bundling, HMR |
| Styling | Tailwind CSS | ^4.1.18 | Utility-first CSS |
| PostCSS | @tailwindcss/postcss | ^4.1.18 | Tailwind CSS processing |
| Autoprefixer | autoprefixer | ^10.4.23 | CSS vendor prefixing |
| Language | JavaScript | ES6+ | No TypeScript |
| Icons | Material Icons | - | Google Fonts icon library |
| Fonts | Inter | - | Primary font family |

### Tailwind CSS v4 Notes

This project uses Tailwind CSS v4 with the new CSS-based configuration:
- Configuration is in `src/style.css` using `@theme` directive
- Uses `@import "tailwindcss"` instead of traditional directives
- Custom animations defined in CSS using `@keyframes`

---

## Project Structure

```
Thanachai-Portfolio/
├── index.html              # Main entry point (single-page portfolio)
├── matrix.html             # Standalone Matrix rain animation page
├── matrix.js               # Standalone Matrix script (non-module)
├── matrix.css              # Matrix page styles
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind v3 config (legacy, mostly unused)
├── postcss.config.js       # PostCSS configuration
├── .nojekyll               # Prevents GitHub Pages from using Jekyll
├── COMMIT_GUIDE.md         # Commit message conventions
├── README.md               # Human-readable project docs
├── plans/
│   └── thanat-cha-architecture.md  # Separate perfume shop project spec
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment workflow
├── src/
│   ├── main.js             # Main entry script (imports style.css)
│   ├── style.css           # Tailwind v4 theme + custom animations
│   ├── matrix.js           # Matrix rain animation (ES module)
│   └── github.js           # GitHub API integration
└── dist/                   # Build output (git-ignored, but present)
```

---

## Build Commands

```bash
# Start development server (port 5173, auto-opens browser)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

### Build Output

- **Output Directory**: `dist/`
- **Assets Directory**: `dist/assets/`
- **Sourcemaps**: Disabled in production
- **Minification**: esbuild

---

## Code Style Guidelines

### JavaScript

- Use ES6+ syntax (arrow functions, const/let, async/await)
- Prefer module imports/exports
- Use `fetch` for API calls
- Error handling with try/catch for async operations

### CSS/Tailwind

- Use Tailwind utility classes for layout and styling
- Custom animations defined in `src/style.css` using `@theme`
- Glassmorphism pattern: `backdrop-blur-xl bg-white/5`
- Gradient text: `text-transparent bg-clip-text bg-gradient-to-r`
- Hover transitions: `transition-all duration-300`

### HTML Structure Patterns

```html
<!-- Section with background effects -->
<section class="relative py-32 animate-fadeIn overflow-hidden">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent pointer-events-none">
    </div>
    
    <!-- Content container with max-width -->
    <div class="max-w-7xl mx-auto relative z-10">
        <!-- Content here -->
    </div>
</section>
```

### Gradient Button Pattern

```html
<a class="relative group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl 
          font-semibold overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]">
    <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    </div>
    <span class="relative z-10">Button Text</span>
</a>
```

---

## Git Commit Conventions

See `COMMIT_GUIDE.md` for full details.

| Type | Description | Example |
|------|-------------|---------|
| `feat(vibe)` | New creative feature | `feat(vibe): add animated section transitions 🌙` |
| `refactor(docs)` | Documentation or structure update | `refactor(docs): unify all markdowns into README.md` |
| `style(ui)` | Visual or layout tweaks | `style(ui): enhance card shadows and glow` |
| `chore(sync)` | Maintenance / cleanup | `chore(sync): update dependencies and meta` |

---

## Deployment Process

### GitHub Pages Deployment

The project uses GitHub Actions for automated deployment:

1. **Trigger**: Push to `main` branch or manual workflow dispatch
2. **Workflow**: `.github/workflows/deploy.yml`
3. **Deployment Source**: `dist/` folder (pre-built)

**Important**: The `dist/` folder is pre-built and committed to the repository. The deployment workflow uploads the existing `dist/` folder to GitHub Pages without rebuilding.

### Base Path Configuration

The project is deployed to a subdirectory (`/Thanachai-Portfolio/`), configured in:
- `vite.config.js`: `base: '/Thanachai-Portfolio/'`
- All asset paths must be relative or use this base path

---

## Key Components

### Matrix Rain Animation

Two implementations exist:
1. **Module version** (`src/matrix.js`): Used in main portfolio, imported as ES module
2. **Standalone version** (`matrix.js`): Used in `matrix.html`, vanilla JS

Canvas-based animation with:
- Latin characters (A-Z, 0-9)
- Hiragana characters (あいうえお...)
- Green text color (`#00ff9c`)
- Fade trail effect using semi-transparent fill

### GitHub Stats Integration

Located in `src/github.js`:
- Fetches data from `https://api.github/users/stampplus`
- Displays repository count and follower count
- Falls back gracefully on API errors

### Mobile Navigation

- Hamburger menu button (visible on mobile only)
- Toggle between `hidden` and `flex` classes
- Smooth transitions with backdrop blur

---

## Development Notes

### Tailwind CSS v4 Configuration

The project uses Tailwind CSS v4 with CSS-based configuration in `src/style.css`:

```css
@import "tailwindcss";

@theme {
  --animate-fadeIn: fadeIn 0.8s ease-out forwards;
  --color-primary: #3B82F6;
  /* ... more theme variables */
  
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
}
```

### Font Loading

- Inter font loaded from Google Fonts
- Material Icons loaded from Google Fonts
- Both use `display=swap` for performance

### No Framework

This is a vanilla JavaScript project:
- No React, Vue, or other frontend frameworks
- No build-time framework dependencies
- Direct DOM manipulation for interactivity

---

## Testing Strategy

Currently, this project has no automated testing setup. Manual testing checklist:

- [ ] Responsive layout on mobile (320px+), tablet (768px+), desktop (1024px+)
- [ ] Matrix animation renders correctly
- [ ] GitHub stats load and display
- [ ] Mobile menu toggles properly
- [ ] All navigation links work
- [ ] No console errors

---

## Security Considerations

1. **GitHub API**: Uses public API endpoint, no authentication token required
2. **External Images**: Uses Google-hosted images (lh3.googleusercontent.com)
3. **No User Input**: Portfolio is static, no forms or user data collection
4. **HTTPS Only**: All external resources loaded via HTTPS

---

## Related Projects

### THANAT-CHA Perfume Shop

The `plans/thanat-cha-architecture.md` file contains specifications for a separate project — a premium Thai niche perfume e-commerce web application. This is NOT part of the portfolio codebase but is stored in the repository for reference.

**Key specs**:
- Mobile-first LINE-integrated shopping experience
- Tech stack: Vanilla JS + Vite + Tailwind CSS v4 + Supabase
- Target market: Thailand
- Payment: QR PromptPay, Bank Transfer

---

## Useful Resources

- **Vite Docs**: https://vitejs.dev/
- **Tailwind CSS v4 Docs**: https://tailwindcss.com/docs/v4-beta
- **Material Icons**: https://fonts.google.com/icons
- **GitHub Pages**: https://docs.github.com/pages

---

> "Vibe is the invisible syntax of emotion — and code is how I translate it into light."
> 
> — Thanachai (Stamp)
