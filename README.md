# portfolio_website

This is a personal portfolio website built using modern web technologies.

## Features

*   Interactive 3D background elements using React Three Fiber.
*   Project showcase with modal views for details.
*   Contact form with EmailJS integration.
*   Responsive design using Tailwind CSS.

## Technologies Used

*   **Frontend Framework:** React
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **3D Graphics:** Three.js / React Three Fiber
*   **Icons:** Lucide React
*   **Email Service:** EmailJS

## Getting Started

Follow these steps to set up and run the project on your local system.

### Prerequisites

Ensure you have the following installed on your system:

1. **Node.js** (v16 or higher) and npm (Node Package Manager):
   - Download and install from [Node.js official website](https://nodejs.org/).
   - Verify installation:
     ```bash
     node -v
     npm -v
     ```

2. **Git** (optional, for cloning the repository):
   - Download and install from [Git official website](https://git-scm.com/).
   - Verify installation:
     ```bash
     git --version
     ```

### Installation

1. **Clone the Repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd portfolio_website
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

### Running the Development Server

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the URL provided in the terminal (e.g., `http://localhost:4000`).

### Exposing the Development Server to the Network

If you want to access the development server from other devices on the same network, use the following command:
```bash
npm run dev -- --host
```
This will expose the server to the network, and you can access it using your machine's IP address (e.g., `http://192.168.x.x:4000`).

### Building for Production

To create an optimized production build:
```bash
npm run build
```

The build output will be located in the `dist/` directory.

### Serving the Production Build

To preview the production build locally:
```bash
npm run preview
```

### Notes for Different Operating Systems

- **Windows:**
  - Use Command Prompt, PowerShell, or Windows Terminal to run the commands.
  - Ensure Node.js and npm are added to your system's PATH during installation.

- **Linux/macOS:**
  - Use a terminal application (e.g., Terminal, iTerm2).
  - You may need to use `sudo` for global installations (e.g., `sudo npm install -g vite`).

## Terminal Commands for Installation

### For macOS
1. **Install Homebrew (if not already installed):**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js and npm:**
   ```bash
   brew install node
   ```

3. **Verify Installation:**
   ```bash
   node -v
   npm -v
   ```

4. **Install Project Dependencies:**
   ```bash
   cd /Users/b/Desktop/portfolio_website
   npm install
   ```

### For Windows
1. **Install Node.js and npm:**
   - Download the installer from [Node.js official website](https://nodejs.org/).
   - Run the installer and ensure you check the option to add Node.js to your system's PATH.

2. **Verify Installation:**
   Open Command Prompt or PowerShell and run:
   ```cmd
   node -v
   npm -v
   ```

3. **Install Project Dependencies:**
   ```cmd
   cd path\to\portfolio_website
   npm install
   ```

### For Linux
1. **Update System Packages:**
   ```bash
   sudo apt update
   sudo apt upgrade
   ```

2. **Install Node.js and npm:**
   ```bash
   sudo apt install -y nodejs npm
   ```

3. **Verify Installation:**
   ```bash
   node -v
   npm -v
   ```

4. **Install Project Dependencies:**
   ```bash
   cd /path/to/portfolio_website
   npm install
   ```

## Folder Structure

- `public/`: Static assets like images.
- `src/`: Source code for the application.
  - `assets/`: Additional assets.
  - `components/`: React components.
- `index.html`: Entry point for the application.
- `vite.config.ts`: Configuration for Vite.

## License

This project is licensed under the MIT License.

