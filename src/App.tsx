import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import emailjs from '@emailjs/browser';
import { ProjectModal } from './components/ProjectModal';
import { MLBackground } from './components/MLBackground';
import { StickyHeader } from './components/StickyHeader';
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
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

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
    // Don't send yet, just show confirmation
    setIsConfirming(true);
    setFormStatus(''); // Clear any previous status
  };

  const handleConfirmSend = () => {
    setFormStatus('Sending...'); // Indicate sending
    setIsConfirming(false); // Move away from confirmation view

    // Replace with your actual EmailJS Service ID, Template ID, and Public Key
    const serviceID = 'YOUR_SERVICE_ID';
    const templateID = 'YOUR_TEMPLATE_ID';
    const publicKey = 'YOUR_PUBLIC_KEY';

    // Ensure the template variables in EmailJS match these keys
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_email: 'gptstealer@gmail.com' // You can set this in the template or here
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
         console.log('SUCCESS!', response.status, response.text);
         setFormStatus('Message sent successfully!');
         // Clear the form
         setFormData({ name: '', email: '', message: '' });
         // Optionally hide status message after a delay
         setTimeout(() => setFormStatus(''), 5000);
      }, (err) => {
         console.error('FAILED...', err);
         setFormStatus('Failed to send message. Please try again.');
         // Optionally hide status message after a delay
         setTimeout(() => setFormStatus(''), 5000);
      });
  };

  const handleEdit = () => {
    setIsConfirming(false);
    setFormStatus(''); // Clear status when going back to edit
  };

  useEffect(() => {
    const drawConnectingLines = () => {
      const canvas = document.getElementById('connecting-lines') as HTMLCanvasElement;
      if (!canvas || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Ensure canvas dimensions are updated if container size changes
      if (canvas.width !== containerRect.width || canvas.height !== containerRect.height) {
        canvas.width = containerRect.width;
        canvas.height = containerRect.height;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set line styles
      ctx.lineWidth = 2;

      projectRefs.current.forEach((ref, index) => {
        if (index < projectRefs.current.length - 1) {
          const currentCard = ref;
          const nextCard = projectRefs.current[index + 1];

          if (currentCard && nextCard) {
            const currentRect = currentCard.getBoundingClientRect();
            const nextRect = nextCard.getBoundingClientRect();

            // Always connect from bottom middle of current card to top middle of next card
            const startX = currentRect.left + currentRect.width / 2 - containerRect.left;
            const startY = currentRect.bottom - containerRect.top;
            const endX = nextRect.left + nextRect.width / 2 - containerRect.left;
            const endY = nextRect.top - containerRect.top;
            
            // Create gradient for the line
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, '#563D7C');
            gradient.addColorStop(1, '#44B78B');
            ctx.strokeStyle = gradient;
            
            // Define the vertical extension
            const verticalExtension = 30;
            
            // Draw the L-shaped path with sharp corners
            ctx.beginPath();
            ctx.moveTo(startX, startY); // Start at the bottom center of current card
            
            // Draw vertical line down
            ctx.lineTo(startX, startY + verticalExtension);
            
            // For even-indexed cards, go right; for odd-indexed, go left
            const horizontalY = startY + verticalExtension;
            
            if (index % 2 === 0) {
              // RIGHT direction L-shape with sharp corners
              // Draw horizontal line
              ctx.lineTo(endX, horizontalY);
              // Draw vertical line up to the next card
              ctx.lineTo(endX, endY);
            } else {
              // LEFT direction L-shape with sharp corners
              // Draw horizontal line
              ctx.lineTo(endX, horizontalY);
              // Draw vertical line up to the next card
              ctx.lineTo(endX, endY);
            }
            
            ctx.stroke();

            // Add small dots at the connection points
            ctx.beginPath();
            ctx.arc(startX, startY, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#563D7C';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(endX, endY, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#44B78B';
            ctx.fill();
          }
        }
      });
    };

    // Immediately draw lines on mount and after each window resize/scroll
    const drawLinesImmediately = () => {
      // Add small timeout to ensure DOM is ready
      setTimeout(() => {
        drawConnectingLines();
      }, 50);
    };

    // Draw immediately when component mounts
    drawLinesImmediately();
    
    // Setup mutation observer to detect DOM changes that might affect card positions
    const observer = new MutationObserver(drawLinesImmediately);
    if (containerRef.current) {
      observer.observe(containerRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      });
    }
    
    // Setup resize handler
    window.addEventListener('resize', drawLinesImmediately);
    // Setup scroll handler
    window.addEventListener('scroll', drawLinesImmediately);
    
    // Redraw lines every 500ms to ensure they're always visible
    const intervalId = setInterval(drawLinesImmediately, 500);

    return () => {
      window.removeEventListener('resize', drawLinesImmediately);
      window.removeEventListener('scroll', drawLinesImmediately);
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [isMobile, projects]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA]">
      {/* Social Links */}
      <div 
        className={`fixed top-4 right-4 md:right-8 flex gap-4 md:gap-6 z-50 p-2 rounded-lg transition-all duration-300 ${
          isScrolled ? 'bg-gradient-to-r from-white/70 to-[#F5F0FF]/70 backdrop-blur-sm shadow-md' : 'bg-transparent'
        }`}
      >
        <a href="https://www.linkedin.com/in/naga-venkata-sravan-kumar-narala-5bb5319b/" className="social-icon text-[#563D7C] hover:text-[#8C6BC8]">
          <Linkedin className="w-6 h-6 md:w-8 md:h-8" />
        </a>
        <a href="https://github.com/sravankumarnnv" className="social-icon text-[#563D7C] hover:text-[#8C6BC8]">
          <Github className="w-6 h-6 md:w-8 md:h-8" />
        </a>
        <a href="https://www.youtube.com/@SravanKumarnnv" className="social-icon text-[#563D7C] hover:text-[#8C6BC8]">
          <Youtube className="w-6 h-6 md:w-8 md:h-8" />
        </a>
        <a href="https://www.kaggle.com/sravankumarnnv" className="social-icon text-[#563D7C] hover:text-[#8C6BC8]">
          <img src="/kaggle.png" alt="Kaggle" className="w-6 h-6 md:w-8 md:h-8" />
        </a>
      </div>

      {/* About Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#F8F9FA] to-[#E8E9EC]">
        <div className="max-w-6xl mx-auto">
          <div className="glowing-border p-10 rounded-lg bg-gradient-to-br from-white/70 via-[#F5F0FF]/80 to-[#E8F5F0]/70 backdrop-blur-sm shadow-xl">
            <h2 className="text-5xl font-bold mb-10 text-[#563D7C]">Naga Narala</h2>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="profile-circle bg-gray-100 overflow-hidden w-60 h-60 flex-shrink-0">
                <img
                  src={walleImage}
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-[#2D2D2D] mb-6 text-xl leading-relaxed">
                  Currently pursuing a Master of Artificial Intelligence at Monash University.
                  Special interest in Computer Vision and experienced in Machine Learning and Deep Learning projects.
                </p>
                <div className="flex gap-6 mt-8 justify-center md:justify-start">
                  <div className="stat-box p-4">
                    <span className="text-3xl font-bold text-[#563D7C]">5+</span>
                    <span className="text-base text-[#2D2D2D]">Projects</span>
                  </div>
                  <a
                    href="/resume.pdf"
                    download="Naga_Narala_Resume.pdf"
                    className="stat-box p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#563D7C]/10 transition-colors"
                  >
                    <Download className="w-6 h-6 mb-1 text-[#563D7C]" />
                    <span className="text-base text-[#2D2D2D]">Resume</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects-section" className="py-20 px-4 md:px-8 relative projects-bg">
        {/* Sticky Header for Projects section */}
        <StickyHeader 
          title="Projects" 
          subtitle="Showcasing my latest work and experiments" 
        />
        
        <div className="max-w-6xl mx-auto mb-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h2 className="text-4xl font-bold text-[#563D7C]">Projects</h2>
              <p className="text-[#2D2D2D] mt-1">Showcasing my latest work and experiments</p>
            </div>
          </div>
        </div>
        
        {/* ML Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ opacity: 0.3 }}>
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
              className="project-card bg-[#F5F0FF] p-8 rounded-lg border border-[#563D7C]/20 mb-24 cursor-pointer shadow-lg hover:shadow-xl transition-all"
              onClick={() => setSelectedProject(project)}
            >
              <h3 className="text-2xl font-bold mb-4 text-[#563D7C]">{project.title}</h3>
              <p className="text-[#2D2D2D] mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <button
                className="inline-flex items-center text-[#563D7C] hover:text-[#8C6BC8] transition-colors"
              >
                View Details <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>
          ))}
          
          {/* Coming More Section */}
          <div className="text-center mt-16">
            <div className="inline-block bg-gradient-to-r from-[#F5F0FF] to-white px-8 py-4 rounded-lg border border-[#563D7C]/20 shadow-md">
              <p className="text-xl text-[#563D7C]">Coming More</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#E8E9EC] to-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-[#563D7C] text-center">Get in Touch</h2>
          <p className="text-[#2D2D2D] text-center mb-12">Let's collaborate on your next project</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="contact-info p-6 bg-gradient-to-br from-white via-[#F5F0FF]/50 to-[#E8F5F0]/40 rounded-lg border border-[#563D7C]/20 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="contact-icon">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#563D7C] font-semibold">Email</h3>
                    <p className="text-[#2D2D2D]">sravankumar.nnv@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="contact-icon">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#563D7C] font-semibold">Location</h3>
                    <p className="text-[#2D2D2D]">Clayton, VIC</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="contact-icon">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#563D7C] font-semibold">Phone</h3>
                    <p className="text-[#2D2D2D]">+61460766511</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Rendering: Form or Confirmation */}
            {!isConfirming ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="contact-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="contact-input"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="contact-input"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-button">
                  Review & Send
                  <Send className="w-4 h-4 ml-2" />
                </button>
              </form>
            ) : (
              <div className="space-y-4 p-6 bg-gradient-to-br from-white via-[#F5F0FF]/50 to-[#E8F5F0]/40 rounded-lg border border-[#563D7C]/20 shadow-lg">
                <h3 className="text-xl font-semibold text-[#563D7C] mb-4">Confirm Your Details</h3>
                <p><strong className="text-[#563D7C]">Name:</strong> {formData.name}</p>
                <p><strong className="text-[#563D7C]">Email:</strong> {formData.email}</p>
                <p><strong className="text-[#563D7C]">Message:</strong></p>
                <p className="whitespace-pre-wrap p-2 bg-[#F8F9FA] rounded">{formData.message}</p>
                <div className="flex gap-4 mt-6">
                  <button onClick={handleEdit} className="submit-button bg-gray-500 hover:bg-gray-600">
                    Edit Details
                  </button>
                  <button onClick={handleConfirmSend} className="submit-button" disabled={formStatus === 'Sending...'}>
                    {formStatus === 'Sending...' ? 'Sending...' : 'Confirm & Send'}
                  </button>
                </div>
              </div>
            )}

            {/* Display submission status (outside conditional rendering) */}
            {formStatus && !isConfirming && 
              <p className={`mt-4 text-center ${formStatus.includes('Failed') ? 'text-red-500' : 'text-[#44B78B]'}`}>
                {formStatus}
              </p>
            }

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