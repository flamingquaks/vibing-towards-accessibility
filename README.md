# Vibing Towards Accessibility 

A React + TypeScript + Vite application focused on creating accessible web experiences with multiple interactive apps including a calculator, rainbow generator, solitaire, and arcade game.

## 🚀 Live Demo

The application is automatically deployed to GitHub Pages: [https://flamingquaks.github.io/vibing-towards-accessibility](https://flamingquaks.github.io/vibing-towards-accessibility)

## ♿ Accessibility & Compliance

This project prioritizes accessibility and WCAG 2.1 AA compliance through multiple layers of validation:

### Automated Accessibility Testing
- **Semgrep WCAG Rules**: Custom static analysis rules for WCAG 2.1 AA compliance
- **Playwright E2E Tests**: Automated accessibility testing in real browser environments
- **ESLint**: Code quality and accessibility linting
- **Unit Tests**: Comprehensive testing with accessibility assertions

### WCAG Compliance Tools
- `npm run wcag` - Check critical WCAG compliance issues
- `npm run lint:semgrep` - Full accessibility linting with semgrep
- `npm run test:e2e` - End-to-end accessibility testing

For detailed information about our accessibility testing setup, see [SEMGREP.md](./SEMGREP.md).

## 🔧 Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:semgrep` - Run semgrep WCAG compliance checks
- `npm run lint:all` - Run both ESLint and semgrep
- `npm run wcag` - Run critical WCAG compliance checks only
- `npm run security` - Run semgrep security audit
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build for deployment

## 📦 Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch. 

### Setup Instructions

**Before the workflow can run successfully, you must enable GitHub Pages in your repository:**

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select "**Deploy from a branch**" or "**GitHub Actions**" (recommended)
3. If using "Deploy from a branch", select the branch and folder
4. If using "GitHub Actions", the workflow will handle deployment automatically

The deployment workflow:

1. **Builds** the application with the correct base path for GitHub Pages
2. **Lints** the code to ensure quality
3. **Deploys** to GitHub Pages using the official deployment action

### SPA Routing Support

Since GitHub Pages doesn't natively support Single Page Applications (SPAs) with client-side routing, this project includes:

- **404.html fallback**: Redirects invalid routes back to the main application
- **Client-side redirect handling**: JavaScript in index.html processes redirected URLs
- **Correct base path configuration**: Vite is configured for GitHub Pages subpath deployment

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
