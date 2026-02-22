# Utility Hub

A modern, centralized collection of utility tools built with React, TypeScript, and Tailwind CSS.

## Overview

Utility Hub is designed to be a go-to application for various day-to-day digital tasks. It provides a clean, responsive interface to access different tools quickly.

## Current Utilities

### 1. Character Limit Checker
A tool to help content creators and developers ensure their text fits within specific constraints.
- Real-time character counting
- Visual feedback
- Custom limit support

### 2. Image to Video Converter
Convert static images into 2-second MP4 videos.
- Supports JPG, PNG, WEBP, GIF
- Client-side processing (privacy focused)
- Maintains original resolution

## Tech Stack

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **Icons:** Lucide React

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Troubleshooting

### GitHub Pages 404 Errors
If you encounter 404 errors on refresh or direct navigation:
1. Ensure your repository Settings -> Pages -> Build and deployment -> Source is set to **GitHub Actions**.
2. The project uses `HashRouter` to support static hosting. URLs should look like `/#/character-limit`.
3. A `404.html` file is included to redirect old paths to the hash format.

## Future Roadmap

More utilities are planned for future updates to expand the capabilities of this hub.
