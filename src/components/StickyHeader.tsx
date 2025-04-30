import { useState, useEffect } from 'react';

interface StickyHeaderProps {
  title: string;
  subtitle?: string;
  scrollTriggerPosition?: number;
  className?: string;
}

export function StickyHeader({ 
  title, 
  subtitle, 
  scrollTriggerPosition = 100,
  className = ''
}: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      // Get the projects section element
      const projectsSection = document.getElementById('projects-section');
      
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        const sectionHeight = rect.height;
        const headerHeight = 60; // Approximate header height
        
        // Check if we've scrolled to/past the projects section
        if (rect.top <= headerHeight && rect.bottom > headerHeight) {
          setIsVisible(true);
          
          // Make sticky when we've scrolled past the original heading
          if (rect.top <= 0) {
            setIsSticky(true);
            
            // Calculate scroll progress through the section
            const scrollPosition = Math.abs(rect.top);
            const progress = Math.min(scrollPosition / (sectionHeight - window.innerHeight), 1);
            setScrollProgress(progress);
          } else {
            setIsSticky(false);
          }
        } else {
          setIsVisible(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollTriggerPosition]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isSticky 
          ? 'translate-y-0 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/30' 
          : 'translate-y-[-100%]'
      } ${className}`}
    >
      <div className="max-w-6xl mx-auto py-4 px-6 md:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#563D7C]">{title}</h2>
            {subtitle && <p className="text-[#2D2D2D] text-sm opacity-80">{subtitle}</p>}
          </div>
          
          {/* Progress bar */}
          <div className="hidden md:block w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#563D7C] to-[#44B78B] rounded-full"
              style={{ width: `${scrollProgress * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}