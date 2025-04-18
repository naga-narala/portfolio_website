import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { ProjectModal } from './components/ProjectModal';
import { MLBackground } from './components/MLBackground';
import { Github, Linkedin, Youtube, ExternalLink, Send, Mail, MapPin, Phone, Download } from 'lucide-react';
import walleImage from './assets/walle.png';

// Function to get window width
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

function App() {
  const windowWidth = useWindowWidth(); // Get window width
  const isMobile = windowWidth < 768; // Define mobile breakpoint
  const [isScrolled, setIsScrolled] = useState(false); // State for scroll detection

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [selectedProject, setSelectedProject] = useState<null | {
    title: string;
    description: string;
    youtubeId: string;
    githubLink: string;
    kaggleLink: string;
  }>(null);

  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      title: "Project 1",
      description: "A revolutionary AI-powered platform that transforms how we interact with data",
      tech: ["React", "Three.js", "TensorFlow"],
      youtubeId: "dQw4w9WgXcQ", // Example YouTube video ID
      githubLink: "https://github.com/username/project1",
      kaggleLink: "https://kaggle.com/username/project1"
    },
    {
      title: "Project 2",
      description: "Immersive 3D visualization tool for complex datasets",
      tech: ["WebGL", "D3.js", "Node.js"],
      youtubeId: "dQw4w9WgXcQ",
      githubLink: "https://github.com/username/project2",
      kaggleLink: "https://kaggle.com/username/project2"
    },
    {
      title: "Project 3",
      description: "Real-time collaboration platform with 3D workspace",
      tech: ["Three.js", "Socket.io", "Redux"],
      youtubeId: "dQw4w9WgXcQ",
      githubLink: "https://github.com/username/project3",
      kaggleLink: "https://kaggle.com/username/project3"
    },
    {
      title: "Project 4",
      description: "Advanced animation system for interactive storytelling",
      tech: ["GSAP", "React Three Fiber", "TypeScript"],
      youtubeId: "dQw4w9WgXcQ",
      githubLink: "https://github.com/username/project4",
      kaggleLink: "https://kaggle.com/username/project4"
    },
    {
      title: "Project 5",
      description: "Virtual reality experience for architectural visualization",
      tech: ["Three.js", "WebXR", "Blender"],
      youtubeId: "dQw4w9WgXcQ",
      githubLink: "https://github.com/username/project5",
      kaggleLink: "https://kaggle.com/username/project5"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const drawConnectingLines = () => {
      const canvas = document.getElementById('connecting-lines') as HTMLCanvasElement;
      if (!canvas || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#8B0000';
      ctx.lineWidth = 2;

      projectRefs.current.forEach((ref, index) => {
        if (index < projectRefs.current.length - 1) {
          const currentCard = ref;
          const nextCard = projectRefs.current[index + 1];

          if (currentCard && nextCard) {
            const currentRect = currentCard.getBoundingClientRect();
            const nextRect = nextCard.getBoundingClientRect();

            const startX = index % 2 === 0 ? 
              currentRect.right - containerRect.left : 
              currentRect.left - containerRect.left;
            const endX = index % 2 === 0 ? 
              nextRect.left - containerRect.left : 
              nextRect.right - containerRect.left;
            
            const startY = currentRect.top + (currentRect.height / 2) - containerRect.top;
            const endY = nextRect.top + (nextRect.height / 2) - containerRect.top;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
          }
        }
      });
    };

    if (isMobile) {
      const canvas = document.getElementById('connecting-lines') as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    drawConnectingLines();
    window.addEventListener('resize', drawConnectingLines);
    window.addEventListener('scroll', drawConnectingLines);

    return () => {
      window.removeEventListener('resize', drawConnectingLines);
      window.removeEventListener('scroll', drawConnectingLines);
    };
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if user scrolls down more than 50px, else false
      setIsScrolled(window.scrollY > 50);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a]">
      {/* Social Links */}
      {/* Apply background conditionally based on isScrolled state */}
      <div 
        className={`fixed top-4 right-4 md:right-8 flex gap-4 md:gap-6 z-50 p-2 rounded-lg transition-colors duration-300 ${
          isScrolled ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <a href="https://www.linkedin.com/in/naga-venkata-sravan-kumar-narala-5bb5319b/" className="social-icon text-white hover:text-red-800">
          <Linkedin className="w-6 h-6 md:w-8 md:h-8" /> {/* Adjusted size for mobile */}
        </a>
        <a href="https://github.com/sravankumarnnv" className="social-icon text-white hover:text-red-800">
          <Github className="w-6 h-6 md:w-8 md:h-8" /> {/* Adjusted size for mobile */}
        </a>
        <a href="https://www.youtube.com/@SravanKumarnnv" className="social-icon text-white hover:text-red-800">
          <Youtube className="w-6 h-6 md:w-8 md:h-8" /> {/* Adjusted size for mobile */}
        </a>
        <a href="https://www.kaggle.com/sravankumarnnv" className="social-icon text-white hover:text-red-800">
          {/* Ensure kaggle.png is in the public folder */}
          <img src="/kaggle.png" alt="Kaggle" className="w-6 h-6 md:w-8 md:h-8" /> {/* Adjusted size for mobile */}
        </a>
      </div>

      {/* About Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#0a0a0a] to-[#1a0404]">
        <div className="max-w-6xl mx-auto">
          <div className="glowing-border p-10 rounded-lg bg-[#1a0404]/50 backdrop-blur-sm">
            <h2 className="text-5xl font-bold mb-10 text-red-800">Naga Narala</h2>
            {/* Changed order of children and ensured items-center */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Profile picture moved to the left on md screens */}
              <div className="profile-circle bg-gray-800 overflow-hidden w-60 h-60 flex-shrink-0"> {/* Added flex-shrink-0 */}
                <img
                  src={walleImage}
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Text description moved to the right on md screens */}
              <div className="flex-1">
                <p className="text-gray-300 mb-6 text-xl leading-relaxed">
                  Currently pursuing a Master of Artificial Intelligence at Monash University.
                  Special interest in Computer Vision and experienced in Machine Learning and Deep Learning projects.
                </p>
                <div className="flex gap-6 mt-8 justify-center md:justify-start"> {/* Keep stats aligned left on desktop */}
                  <div className="stat-box p-4">
                    <span className="text-3xl font-bold text-red-500">5+</span>
                    <span className="text-base text-gray-300">Projects</span>
                  </div>
                  {/* Resume Download Stat Box */}
                  <a
                    href="/resume.pdf" // Make sure resume.pdf is in the public folder
                    download="Naga_Narala_Resume.pdf" // Suggested filename for download
                    className="stat-box p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-red-900/30 transition-colors" // Added cursor and hover effect
                  >
                    <Download className="w-6 h-6 mb-1 text-red-500" /> {/* Icon */}
                    <span className="text-base text-gray-300">Resume</span> {/* Text */}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4 md:px-8 relative projects-bg">
        <div className="max-w-6xl mx-auto mb-16 relative z-10">
          {/* Flex container for title and download button */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="mb-4 md:mb-0 text-center md:text-left"> {/* Container for title and description, centered on mobile */}
              <h2 className="text-4xl font-bold text-red-800">Projects</h2>
              <p className="text-gray-100 mt-1">Showcasing my latest work and experiments</p>
            </div>
          </div>
        </div>
        
        {/* ML Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ opacity: 0.25 }}>
          <Canvas camera={{ position: [0, 0, isMobile ? 7 : 5.0], fov: 60 }}>
            <MLBackground scale={isMobile ? 0.6 : 1.0} />
          </Canvas>
        </div>
        
        <div ref={containerRef} className="max-w-6xl mx-auto projects-container relative z-10">
          <canvas id="connecting-lines" className="absolute top-0 left-0 w-full h-full pointer-events-none" />
          
          {projects.map((project, index) => (
            <div
              key={index}
              ref={el => projectRefs.current[index] = el}
              className="project-card bg-[#1a0404] p-8 rounded-lg border border-red-900/30 mb-24 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <h3 className="text-2xl font-bold mb-4 text-red-500">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-red-900/20 text-red-400 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <button
                className="inline-flex items-center text-red-500 hover:text-red-400 transition-colors"
              >
                View Details <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>
          ))}
          
          {/* Coming More Section */}
          <div className="text-center mt-16">
            <div className="inline-block bg-[#1a0404] px-8 py-4 rounded-lg border border-red-900/30">
              <p className="text-xl text-red-500">Coming More</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#1a0404] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-red-800 text-center">Get in Touch</h2>
          <p className="text-gray-400 text-center mb-12">Let's collaborate on your next project</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="contact-info p-6 bg-[#1a0404] rounded-lg border border-red-900/30">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="contact-icon">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-red-500 font-semibold">Email</h3>
                    <p className="text-gray-400">contact@example.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="contact-icon">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-red-500 font-semibold">Location</h3>
                    <p className="text-gray-400">San Francisco, CA</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="contact-icon">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-red-500 font-semibold">Phone</h3>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="contact-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="contact-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="contact-input"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="submit-button">
                Send Message
                <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

export default App;