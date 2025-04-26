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
  
  useEffect(() => {
    const handleScroll = () => {
      // Get the projects section element
      const projectsSection = document.getElementById('projects-section');
      
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        const headerHeight = 60; // Approximate header height
        
        // Check if we've scrolled to/past the projects section
        if (rect.top <= headerHeight && rect.bottom > headerHeight) {
          setIsVisible(true);
          
          // Make sticky when we've scrolled past the original heading
          if (rect.top <= 0) {
            setIsSticky(true);
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
          ? 'translate-y-0 bg-gradient-to-r from-[#F5F0FF]/90 to-[#E8F5F0]/90 backdrop-blur-sm shadow-lg' 
          : 'translate-y-[-100%]'
      } ${className}`}
    >
      <div className="max-w-6xl mx-auto py-4 px-6 md:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#563D7C]">{title}</h2>
            {subtitle && <p className="text-[#2D2D2D]">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}