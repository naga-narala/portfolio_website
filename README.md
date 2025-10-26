# Portfolio Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, interactive personal portfolio website showcasing projects with 3D animations, responsive design, and seamless user experience.

## Features

- Interactive 3D background with neural network visualization
- Project showcase with detailed modal views
- Contact form integrated with EmailJS
- Fully responsive design optimized for all devices
- Built with modern web technologies for performance

## Technologies Used

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js / React Three Fiber
- **Icons:** Lucide React
- **Email Service:** EmailJS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```
Open [http://localhost:4000](http://localhost:4000) in your browser.

To expose the server to your network:
```bash
npm run dev -- --host
```

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
portfolio-website/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Additional assets
│   ├── components/        # React components
│   │   ├── MLBackground.tsx
│   │   ├── ProjectModal.tsx
│   │   ├── Scene.tsx
│   │   └── StickyHeader.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

