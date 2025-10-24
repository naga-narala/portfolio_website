import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import emailjs from '@emailjs/browser';
import { ProjectModal } from './components/ProjectModal';
import { MLBackground } from './components/MLBackground';
import { StickyHeader } from './components/StickyHeader';
import { Github, Linkedin, Youtube, ExternalLink, Send, Mail, MapPin, Phone, Download, ChevronDown } from 'lucide-react';

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

// Intersection Observer Hook for scroll animations
function useIntersectionObserver(options = {}) {
  const [observedElements, setObservedElements] = useState<HTMLElement[]>([]);
  const [visibleElements, setVisibleElements] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => [...prev, entry.target as HTMLElement]);
        }
      });
    }, options);

    observedElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      observedElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [observedElements, options]);

  const observe = (element: HTMLElement | null) => {
    if (element && !observedElements.includes(element)) {
      setObservedElements((prev) => [...prev, element]);
    }
  };

  const isVisible = (element: HTMLElement | null) => {
    return element ? visibleElements.includes(element) : false;
  };

  return { observe, isVisible };
}

interface ProjectType {
  title: string;
  description: string;
  tech: string[];
  youtubeId: string;
  githubLink: string;
  kaggleLink: string;
}

function App() {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768;
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const { observe, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const projectsSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);

  const projects: ProjectType[] = useMemo(() => [
    {
      title: "Project 1",
      description: "A revolutionary AI-powered platform that transforms how we interact with data",
      tech: ["React", "Three.js", "TensorFlow"],
      youtubeId: "dQw4w9WgXcQ",
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
  ], []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  // Scroll to section functionality
  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      // Check if we have any project refs before trying to draw lines
      if (projectsRef.current.length === 0) return;

      projectsRef.current.forEach((ref, index) => {
        if (index < projectsRef.current.length - 1) {
          const currentCard = ref;
          const nextCard = projectsRef.current[index + 1];

          if (currentCard && nextCard) {
            const currentRect = currentCard.getBoundingClientRect();
            const nextRect = nextCard.getBoundingClientRect();

            // Skip drawing if either card has zero dimensions (not fully rendered)
            if (currentRect.width === 0 || currentRect.height === 0 || 
                nextRect.width === 0 || nextRect.height === 0) {
              return;
            }

            // Calculate container's position relative to viewport
            const containerTop = containerRect.top;
            
            // Start and end points for the connection
            const startX = currentRect.left + currentRect.width / 2 - containerRect.left;
            const startY = currentRect.bottom - containerTop;
            const endX = nextRect.left + nextRect.width / 2 - containerRect.left;
            const endY = nextRect.top - containerTop;
            
            // Create gradient for the line
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, '#563D7C');
            gradient.addColorStop(1, '#44B78B');
            ctx.strokeStyle = gradient;
            
            // Define vertical extension - fixed distance for all connections
            const verticalExtension = 30;
            
            // Connect all lines with the same style - simple right-angled turns
            ctx.beginPath();
            ctx.moveTo(startX, startY); // Start at the bottom center of current card
            
            if (index % 2 === 0) {
              // Left side connection
              // Vertical line down
              ctx.lineTo(startX, startY + verticalExtension);
              // Horizontal line to the right
              ctx.lineTo(endX, startY + verticalExtension);
              // Vertical line up to the next card
              ctx.lineTo(endX, endY);
            } else {
              // Right side connection
              // Vertical line down
              ctx.lineTo(startX, startY + verticalExtension);
              // Horizontal line to the left
              ctx.lineTo(endX, startY + verticalExtension);
              // Vertical line up to the next card
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

    // Function to draw lines with increasing delays until successful
    const ensureLines = () => {
      // First immediate attempt
      drawConnectingLines();
      
      // Then try with increasing delays to ensure DOM is ready
      const delays = [100, 300, 500, 1000, 2000];
      delays.forEach(delay => {
        setTimeout(drawConnectingLines, delay);
      });
    };

    // Setup the initial drawing once components are mounted
    ensureLines();
    
    // Also draw after window has fully loaded
    window.addEventListener('load', ensureLines);
    
    // Setup mutation observer to detect DOM changes that might affect card positions
    const observer = new MutationObserver(() => {
      drawConnectingLines();
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      });
    }
    
    // Setup resize handler
    window.addEventListener('resize', drawConnectingLines);
    // Setup scroll handler
    window.addEventListener('scroll', drawConnectingLines);
    
    // Redraw lines every 500ms for the first 5 seconds to ensure they're always visible
    const intervalId = setInterval(drawConnectingLines, 500);
    setTimeout(() => {
      clearInterval(intervalId);
    }, 5000);

    return () => {
      window.removeEventListener('resize', drawConnectingLines);
      window.removeEventListener('scroll', drawConnectingLines);
      window.removeEventListener('load', ensureLines);
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
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-[#563D7C] font-bold text-2xl">NN</div>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection(aboutSectionRef)} className="text-[#2D2D2D] hover:text-[#563D7C] font-medium transition-all">About</button>
            <button onClick={() => scrollToSection(projectsSectionRef)} className="text-[#2D2D2D] hover:text-[#563D7C] font-medium transition-all">Projects</button>
            <button onClick={() => scrollToSection(contactSectionRef)} className="text-[#2D2D2D] hover:text-[#563D7C] font-medium transition-all">Contact</button>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#563D7C] text-white rounded-lg hover:bg-[#8C6BC8] transition-all flex items-center gap-1.5">
              Resume <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Social Links */}
      <div 
        className={`fixed top-24 right-4 md:right-8 flex flex-col gap-4 md:gap-6 z-40 p-2 rounded-lg transition-all duration-300 hidden md:flex ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <a href="https://www.linkedin.com/in/naga-venkata-sravan-kumar-narala-5bb5319b/" target="_blank" rel="noopener noreferrer" className="social-icon text-[#563D7C] hover:text-[#8C6BC8]">
          <Linkedin className="w-6 h-6" />
        </a>
        <a href="https://github.com/sravankumarnnv" target="_blank" rel="noopener noreferrer" className="social-icon text-[#563D7C] hover:text-[#8C6BC8]">
          <Github className="w-6 h-6" />
        </a>
        <a href="https://www.youtube.com/@SravanKumarnnv" target="_blank" rel="noopener noreferrer" className="social-icon text-[#563D7C] hover:text-[#8C6BC8]">
          <Youtube className="w-6 h-6" />
        </a>
        <a href="https://www.kaggle.com/sravankumarnnv" target="_blank" rel="noopener noreferrer" className="social-icon text-[#563D7C] hover:text-[#8C6BC8]">
          <img src="/kaggle.svg" alt="Kaggle" className="w-6 h-6" />
        </a>
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef as React.RefObject<HTMLElement>}
        className="min-h-screen flex flex-col justify-center items-center pt-20 pb-10 px-6 relative bg-gradient-to-b from-[#F8F9FA] to-[#F5F0FF]/20"
      >
        <div className="max-w-6xl mx-auto w-full text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#563D7C] mb-6">
            Naga <span className="text-[#44B78B]">Narala</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#2D2D2D] max-w-3xl mx-auto mb-12">
            AI & Machine Learning Specialist with expertise in Computer Vision
          </p>
          <div className="flex flex-wrap justify-center gap-5 mb-16">
            <button 
              onClick={() => scrollToSection(projectsSectionRef)}
              className="px-8 py-3 bg-[#563D7C] text-white rounded-lg hover:bg-[#8C6BC8] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              View Projects
              <ChevronDown className="w-5 h-5" />
            </button>
            <a 
              href="/resume.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              download="Naga_Narala_Resume.pdf"
              className="px-8 py-3 bg-white border-2 border-[#563D7C] text-[#563D7C] rounded-lg hover:bg-[#F5F0FF] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Download CV
              <Download className="w-5 h-5" />
            </a>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-[#563D7C]" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        ref={aboutSectionRef as React.RefObject<HTMLElement>}
        className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-[#F5F0FF]/20 to-[#E8E9EC]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#563D7C]">About Me</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#563D7C] to-[#44B78B] mx-auto mt-3"></div>
          </div>
          
          <div 
            className="glowing-border p-8 md:p-10 rounded-2xl bg-white shadow-xl"
            ref={(el) => observe(el)}
          >
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div 
                className={`profile-circle bg-gray-100 overflow-hidden w-60 h-60 flex-shrink-0 transition-all duration-700 ${
                  isVisible(aboutSectionRef.current) ? 'opacity-100' : 'opacity-0 translate-x-[-50px]'
                }`}
              >
                {/* Replace Wall-E with an AI-related professional image */}
                <div className="w-full h-full bg-gradient-to-br from-[#563D7C]/90 to-[#44B78B]/90 flex items-center justify-center">
                  <div className="text-white text-5xl font-bold">NN</div>
                </div>
              </div>
              <div 
                className={`flex-1 transition-all duration-700 delay-300 ${
                  isVisible(aboutSectionRef.current) ? 'opacity-100' : 'opacity-0 translate-y-[30px]'
                }`}
              >
                <h3 className="text-2xl font-bold mb-4 text-[#563D7C]">Machine Learning Specialist</h3>
                <p className="text-[#2D2D2D] mb-6 text-lg leading-relaxed">
                  Currently pursuing a Master of Artificial Intelligence at Monash University.
                  Special interest in Computer Vision and experienced in Machine Learning and Deep Learning projects.
                </p>
                <div className="flex gap-6 mt-8 flex-wrap">
                  <div className="stat-box p-4">
                    <span className="text-3xl font-bold text-[#563D7C]">5+</span>
                    <span className="text-base text-[#2D2D2D]">Projects</span>
                  </div>
                  <div className="stat-box p-4">
                    <span className="text-3xl font-bold text-[#563D7C]">3+</span>
                    <span className="text-base text-[#2D2D2D]">Years</span>
                  </div>
                  <a
                    href="/resume.pdf"
                    download="Naga_Narala_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stat-box p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#563D7C]/10 transition-colors"
                  >
                    <Download className="w-6 h-6 mb-1 text-[#563D7C]" />
                    <span className="text-base text-[#2D2D2D]">Resume</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Skills section */}
            <div 
              className={`mt-12 transition-all duration-700 delay-500 ${
                isVisible(aboutSectionRef.current) ? 'opacity-100' : 'opacity-0 translate-y-[30px]'
              }`}
            >
              <h3 className="text-xl font-bold mb-5 text-[#563D7C]">Technical Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="border border-gray-200 rounded-lg p-5 bg-[#F8F9FA] hover:shadow-md transition-all">
                  <h4 className="font-semibold text-lg mb-3 text-[#563D7C]">Machine Learning</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">TensorFlow</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">PyTorch</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">Scikit-learn</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">CNN</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">RNN</span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-5 bg-[#F8F9FA] hover:shadow-md transition-all">
                  <h4 className="font-semibold text-lg mb-3 text-[#563D7C]">Programming</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">Python</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">JavaScript</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">R</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">SQL</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">Java</span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-5 bg-[#F8F9FA] hover:shadow-md transition-all">
                  <h4 className="font-semibold text-lg mb-3 text-[#563D7C]">Tools & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">Docker</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">Git</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">AWS</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">Pandas</span>
                    <span className="px-3 py-1 bg-[#563D7C]/10 text-[#563D7C] rounded-full text-sm">NumPy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section 
        id="projects-section" 
        ref={projectsSectionRef as React.RefObject<HTMLElement>}
        className="py-24 px-4 md:px-8 relative projects-bg"
      >
        {/* Sticky Header for Projects section */}
        <StickyHeader 
          title="Projects" 
          subtitle="Showcasing my latest work and experiments" 
        />
        
        <div className="max-w-6xl mx-auto mb-16 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#563D7C]">Projects</h2>
            <p className="text-[#2D2D2D] mt-2">Showcasing my latest work and experiments</p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#563D7C] to-[#44B78B] mx-auto mt-4"></div>
          </div>
        </div>
        
        {/* ML Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ opacity: 0.2 }}>
          <Canvas camera={{ position: [0, 0, isMobile ? 7 : 5.0], fov: 60 }}>
            <MLBackground scale={isMobile ? 0.6 : 1.0} />
          </Canvas>
        </div>
        
        <div ref={containerRef} className="max-w-6xl mx-auto projects-container relative z-10">
          <canvas id="connecting-lines" className="absolute top-0 left-0 w-full h-full pointer-events-none" />
          
          {projects.map((project, index) => (
            <div
              key={index}
              ref={(el) => {
                projectsRef.current[index] = el;
                // Keep the reference for connecting lines but don't use observe here
              }}
              className="project-card p-8 rounded-xl border border-gray-200 mb-24 cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => setSelectedProject(project)}
            >
              <h3 className="text-2xl font-bold mb-4 text-[#563D7C]">{project.title}</h3>
              <p className="text-[#2D2D2D] mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
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
                className="inline-flex items-center text-[#563D7C] hover:text-[#8C6BC8] transition-all font-medium"
              >
                View Details <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>
          ))}
          
          {/* Coming Soon Section */}
          <div 
            className="text-center mt-16"
            ref={(el) => observe(el)}
          >
            <div 
              className={`inline-block bg-white px-8 py-4 rounded-lg border border-[#563D7C]/20 shadow-md transition-all duration-500 ${
                isVisible(containerRef.current) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <p className="text-xl text-[#563D7C]">More Projects Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        ref={contactSectionRef as React.RefObject<HTMLElement>}
        className="py-24 px-6 bg-gradient-to-b from-[#E8E9EC] to-[#F8F9FA]"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#563D7C]">Get in Touch</h2>
            <p className="text-[#2D2D2D] mt-2">Let's collaborate on your next project</p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#563D7C] to-[#44B78B] mx-auto mt-4"></div>
          </div>
          
          <div 
            className="grid md:grid-cols-2 gap-8"
            ref={(el) => observe(el)}
          >
            <div 
              className={`contact-info p-8 bg-white rounded-xl border border-gray-200 shadow-lg transition-all duration-500 ${
                isVisible(contactSectionRef.current) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
              }`}
            >
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="contact-icon">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#563D7C] font-semibold text-lg">Email</h3>
                    <p className="text-[#2D2D2D]">sravankumar.nnv@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="contact-icon">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#563D7C] font-semibold text-lg">Location</h3>
                    <p className="text-[#2D2D2D]">Clayton, VIC</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="contact-icon">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#563D7C] font-semibold text-lg">Phone</h3>
                    <p className="text-[#2D2D2D]">+61460766511</p>
                  </div>
                </div>
                
                {/* Social Links in Contact Section */}
                <div className="pt-4">
                  <h3 className="text-[#563D7C] font-semibold text-lg mb-3">Connect</h3>
                  <div className="flex gap-4">
                    <a 
                      href="https://www.linkedin.com/in/naga-venkata-sravan-kumar-narala-5bb5319b/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#F5F0FF] p-3 rounded-full text-[#563D7C] hover:bg-[#563D7C] hover:text-white transition-all"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://github.com/sravankumarnnv" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#F5F0FF] p-3 rounded-full text-[#563D7C] hover:bg-[#563D7C] hover:text-white transition-all"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://www.kaggle.com/sravankumarnnv" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#F5F0FF] p-3 rounded-full text-[#563D7C] hover:bg-[#563D7C] hover:text-white transition-all"
                    >
                      <img src="/kaggle.svg" alt="Kaggle" className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Rendering: Form or Confirmation */}
            <div 
              className={`transition-all duration-500 delay-300 ${
                isVisible(contactSectionRef.current) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
              }`}
            >
              {!isConfirming ? (
                <form onSubmit={handleSubmit} className="space-y-5 p-8 bg-white rounded-xl border border-gray-200 shadow-lg">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Your Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Smith"
                      className="contact-input"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Your Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="contact-input"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Your Message</label>
                    <textarea
                      id="message"
                      placeholder="I'd like to discuss a project..."
                      rows={5}
                      className="contact-input"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-button w-full justify-center">
                    Review & Send
                    <Send className="w-4 h-4 ml-2" />
                  </button>
                </form>
              ) : (
                <div className="space-y-5 p-8 bg-white rounded-xl border border-gray-200 shadow-lg">
                  <h3 className="text-2xl font-semibold text-[#563D7C] mb-4">Confirm Your Details</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Name</span>
                      <p className="font-medium text-[#2D2D2D]">{formData.name}</p>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Email</span>
                      <p className="font-medium text-[#2D2D2D]">{formData.email}</p>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Message</span>
                      <div className="mt-1 p-3 bg-[#F8F9FA] rounded-lg border border-gray-200">
                        <p className="whitespace-pre-wrap text-[#2D2D2D]">{formData.message}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button onClick={handleEdit} className="submit-button bg-gray-500 hover:bg-gray-600 flex-1 justify-center">
                      Edit Details
                    </button>
                    <button onClick={handleConfirmSend} className="submit-button flex-1 justify-center" disabled={formStatus === 'Sending...'}>
                      {formStatus === 'Sending...' ? 'Sending...' : 'Confirm & Send'}
                    </button>
                  </div>
                </div>
              )}

              {/* Display submission status (outside conditional rendering) */}
              {formStatus && !isConfirming && (
                <div className={`mt-4 py-3 px-4 rounded-lg text-center ${
                  formStatus.includes('Failed') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {formStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#F8F9FA] border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#2D2D2D]">© {new Date().getFullYear()} Naga Narala. All rights reserved.</p>
        </div>
      </footer>

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