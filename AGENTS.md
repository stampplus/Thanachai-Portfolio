# AGENTS.md — Thanachai Portfolio

> AI coding agent guide for this project. Read this first before making any changes.

---

## Project Overview

**Thanachai Portfolio** is a personal portfolio website showcasing AI creative work. The project follows a "Vibe Code" philosophy — blending emotion-driven design with technical precision.

- **Repository:** https://github.com/stampplus/Thanachai-Portfolio
- **Live Site:** https://stampplus.github.io/Thanachai-Portfolio/
- **Tech Stack:** HTML5, TailwindCSS v4, Vanilla JavaScript (ES6), Vite
- **Deployment:** GitHub Pages

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Vite | ^7.3.1 | Build tool and dev server |
| TailwindCSS | ^4.1.18 | Utility-first CSS framework |
| PostCSS | ^8.5.6 | CSS processing with Tailwind plugin |
| Autoprefixer | ^10.4.23 | CSS vendor prefixing |

### External Dependencies (CDN)

- **Google Fonts:** Inter (sans-serif)
- **Material Icons:** Google Material Icons font
- **Tailwind CDN:** Used only in `matrix.html` standalone page

---

## Project Structure

```
Thanachai-Portfolio/
├── index.html              # Main portfolio page (SPA structure)
├── matrix.html             # Standalone Matrix rain demo page
├── matrix.css              # Styles for matrix.html
├── matrix.js               # Standalone Matrix rain script
├── src/
│   ├── main.js             # Entry point: initializes modules
│   ├── style.css           # Tailwind imports + custom animations
│   ├── matrix.js           # Matrix rain animation module (ES6)
│   └── github.js           # GitHub API integration module
├── dist/                   # Production build output (tracked for GitHub Pages)
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages deployment workflow
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind v4 theme configuration
├── postcss.config.js       # PostCSS plugins configuration
└── package.json            # Dependencies and npm scripts
```

---

## Build Commands

```bash
# Development server (port 5173, auto-opens browser)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

### Important Build Notes

- The `dist/` folder is **committed to the repository** because GitHub Pages deploys directly from it
- Always run `npm run build` before committing changes that affect the built output
- The GitHub Actions workflow deploys from `./dist` on every push to `main`

---

## Configuration Details

### Vite Configuration (`vite.config.js`)

```javascript
base: '/Thanachai-Portfolio/'    // GitHub Pages subdirectory path
outDir: 'dist'                   // Build output directory
sourcemap: false                 // Disabled for production
minify: 'esbuild'                // Code minification
assetsDir: 'assets'              // Static assets folder
```

### Tailwind Configuration (`tailwind.config.js`)

- **Dark Mode:** `class` strategy (controlled via `<html class="dark">`)
- **Content Paths:** `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- **Custom Theme Extensions:**
  - Colors: primary, background-light/dark, card-light/dark, text-light/dark, etc.
  - Font: Inter
  - Shadows: glow effects
  - Animations: fadeIn, gradient

### PostCSS Configuration (`postcss.config.js`)

Uses TailwindCSS v4 PostCSS plugin structure:
```javascript
plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
}
```

---

## Code Organization

### Entry Point (`src/main.js`)

```javascript
import './style.css';
import { initMatrix } from './matrix.js';
import { fetchGitHubStats } from './github.js';

// Initializes:
// 1. Matrix animation (if #matrix canvas exists)
// 2. GitHub stats fetch and DOM update
// 3. Mobile menu toggle functionality
```

### Module Responsibilities

| Module | Purpose |
|--------|---------|
| `src/style.css` | Tailwind v4 imports, custom @theme definitions, utility classes |
| `src/matrix.js` | Canvas-based Matrix rain animation with Hiragana characters |
| `src/github.js` | Fetches GitHub user stats (repos, followers) from public API |

### Matrix Animation Details

Two implementations exist:
1. **`src/matrix.js`** — ES6 module used in main site (canvas in work section)
2. **`matrix.js`** (root) — Standalone script for `matrix.html` full-page demo

The animation combines Latin characters (A-Z, 0-9) and Japanese Hiragana for a cyberpunk aesthetic.

---

## Styling Conventions

### Tailwind v4 Usage

The project uses TailwindCSS v4 with the new `@import` and `@theme` syntax:

```css
/* In src/style.css */
@import "tailwindcss";

@theme {
  --animate-fadeIn: fadeIn 0.8s ease-out forwards;
  --color-primary: #3B82F6;
  /* ... custom properties */
}

@layer utilities {
  .animate-float { /* custom utilities */ }
}
```

### Design System

- **Color Palette:** Dark mode by default (`#0D1117` background)
- **Accent Colors:** Blue (`#3B82F6`) to Purple gradient
- **Typography:** Inter font family
- **Border Radius:** `0.75rem` (rounded-2xl commonly used)
- **Animations:** fadeIn, float variants, spin-slow, gradient shifting

### CSS Class Patterns

Common patterns found in `index.html`:
- Gradient backgrounds: `bg-gradient-to-br from-blue-500/10 via-purple-500/5`
- Glassmorphism: `backdrop-blur-sm`, `backdrop-blur-xl`, `backdrop-blur-2xl`
- Hover effects: `group-hover:scale-110`, `hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]`
- Transitions: `transition-all duration-300`, `transition-all duration-500`

---

## GitHub Pages Deployment

### Workflow (`.github/workflows/deploy.yml`)

Triggered on:
- Push to `main` branch
- Manual workflow dispatch

Deploys the `dist/` folder to GitHub Pages using `actions/deploy-pages@v4`.

### Deployment Checklist

Before pushing to `main`:
1. Run `npm run build` to update `dist/`
2. Verify the build output in `dist/`
3. Commit both source changes and `dist/` folder
4. Push to trigger deployment

---

## Development Guidelines

### Adding New Features

1. **New Pages:** Create HTML files in root; use Vite's module system for JS/CSS
2. **New Components:** Add to `src/` as ES6 modules, import in `main.js`
3. **Styling:** Prefer Tailwind utilities; add custom CSS in `src/style.css` `@layer utilities`
4. **Animations:** Define keyframes in `@theme` block; create utility classes in `@layer utilities`

### JavaScript Patterns

- Use ES6 modules with explicit imports/exports
- Check DOM element existence before attaching event listeners
- Use `async/await` for API calls with try/catch error handling

Example:
```javascript
// Check element exists before initialization
if (document.getElementById('matrix')) {
    initMatrix();
}

// API calls with error handling
export async function fetchGitHubStats() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
```

### Working with Images

The project uses Google-hosted images (LH3 Google User Content URLs). To update images:
1. Upload new images to a reliable hosting service
2. Update the `src` attributes in `index.html`

---

## Testing

This project does not currently have automated tests. Manual testing checklist:

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run preview` shows the built site correctly
- [ ] Matrix animation renders in work section
- [ ] GitHub stats load and display (if API available)
- [ ] Mobile menu toggles properly
- [ ] All navigation anchor links work
- [ ] Responsive layout works on mobile, tablet, desktop

---

## Security Considerations

1. **GitHub API:** Uses public API endpoint (no token required for user data)
2. **External Resources:** Fonts and icons loaded from Google CDNs
3. **No Sensitive Data:** No API keys or secrets in the codebase
4. **CSP:** No Content Security Policy currently configured

---

## Common Issues

### Build fails with Tailwind v4 errors

Ensure you're using the correct import syntax:
```css
@import "tailwindcss";  /* v4 syntax */
```
Not the v3 directive syntax.

### GitHub Pages shows 404

- Verify `base` path in `vite.config.js` matches your repository name
- Ensure `dist/` folder is committed and pushed

### Matrix animation not appearing

- Check that canvas element has `id="matrix"`
- Verify `initMatrix()` is being called in `main.js`

---

## License

ISC License — see `package.json` for details.

---

> Last updated: 2026-02-05
> For questions or updates to this guide, update this file directly.
