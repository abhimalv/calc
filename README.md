# React Calculator

A modern, interactive calculator built with React and Vite. Features a beautiful gradient UI with smooth animations and full arithmetic operation support.

## Features

 - 🎉 Confetti celebration on successful calculation
 - 📜 Recent calculation history (toggleable)
 - 🌗 Light/Dark theme toggle

## Installation

```bash
npm install

## CI / Deployment

This repository includes a GitHub Actions workflow that builds the site and deploys the `dist` folder to GitHub Pages on pushes to `main`. The workflow file is at `.github/workflows/deploy.yml`.
```

## Development

Start the development server:

```bash
npm run dev
```

The application will open in your browser at `http://localhost:3000`.

## Build

Build for production:

```bash
npm run build
```

## Preview

Preview the production build locally:

```bash
npm preview
```

## How to Use

1. Click number buttons to enter values
2. Click an operation button (+, -, *, ÷)
3. Enter the second number
4. Click the equals button (=) to calculate
5. Click AC to clear and start over
6. Use the decimal button (.) for decimal numbers
