# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application built with Vite, using React 19.2.0 with modern tooling including ESLint for code quality.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Architecture

### Entry Point
- `index.html` - HTML entry point that loads `/src/main.jsx`
- `src/main.jsx` - React app entry point that renders `App` component into `#root` div with StrictMode enabled

### Build Configuration
- **Vite** (`vite.config.js`) - Uses `@vitejs/plugin-react` with Babel for Fast Refresh
- **ESLint** (`eslint.config.js`) - Flat config format with:
  - React Hooks rules enforced via `eslint-plugin-react-hooks`
  - React Refresh rules for HMR via `eslint-plugin-react-refresh`
  - Custom rule: unused vars allowed if they match pattern `^[A-Z_]` (constants/components)
  - Ignores `dist` directory

### Project Structure
- `/src` - Source code directory
- `/public` - Static assets served at root
- `/dist` - Build output (git-ignored)

## Key Notes

- React 19.2.0 is used (latest version)
- ES modules format (`"type": "module"` in package.json)
- React Compiler is not enabled due to performance impact on dev/build
- HMR (Hot Module Replacement) is configured via Vite's React plugin
